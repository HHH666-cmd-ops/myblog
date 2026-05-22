import * as profileService from "../services/profile.service.js";

export async function getProfile(req, res, next) {
  try {
    const profile = await profileService.getProfile();
    res.json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
}
