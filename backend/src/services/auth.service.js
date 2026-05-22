import crypto from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { appConfig } from "../config/app-config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sessionsPath = join(__dirname, "../data/sessions.json");

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

async function loadSessions() {
  if (!existsSync(sessionsPath)) {
    return {};
  }
  const raw = await readFile(sessionsPath, "utf-8");
  return JSON.parse(raw);
}

async function saveSessions(sessions) {
  await writeFile(sessionsPath, `${JSON.stringify(sessions, null, 2)}\n`, "utf-8");
}

function pruneSessions(sessions) {
  const now = Date.now();
  const next = {};
  for (const [token, meta] of Object.entries(sessions)) {
    if (now - meta.createdAt < SESSION_TTL_MS) {
      next[token] = meta;
    }
  }
  return next;
}

export async function login(password) {
  if (!appConfig.adminPassword) {
    const error = new Error("未配置管理密码，请在 backend/.env 设置 ADMIN_PASSWORD");
    error.statusCode = 503;
    throw error;
  }
  if (password !== appConfig.adminPassword) {
    const error = new Error("密码错误");
    error.statusCode = 401;
    throw error;
  }

  const token = crypto.randomBytes(32).toString("hex");
  const sessions = pruneSessions(await loadSessions());
  sessions[token] = { createdAt: Date.now() };
  await saveSessions(sessions);
  return { token, expiresInDays: 7 };
}

export async function verifyToken(token) {
  if (!token) return false;
  const sessions = pruneSessions(await loadSessions());
  const session = sessions[token];
  if (!session) return false;
  if (Date.now() - session.createdAt >= SESSION_TTL_MS) {
    delete sessions[token];
    await saveSessions(sessions);
    return false;
  }
  return true;
}

export async function logout(token) {
  const sessions = await loadSessions();
  delete sessions[token];
  await saveSessions(pruneSessions(sessions));
}
