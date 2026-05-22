export function errorHandler(err, req, res, next) {
  console.error("[API Error]", err);
  const status = err.statusCode || err.status || 500;
  let message = err.message || "服务器内部错误";
  if (err.code === "LIMIT_FILE_SIZE") {
    message = "文件过大，请缩小后重试";
  }
  res.status(status).json({
    success: false,
    message,
  });
}
