import * as ProfileService from "../service/profile.service.js";

export const getProfile = async (req, res) => {
  try {
    const profile = await ProfileService.getProfile(req.userId);
    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const profile = await ProfileService.updateProfile({
      userId: req.userId,
      name,
      email,
    });
    res.status(200).json({ message: "Profil berhasil diperbarui", profile });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await ProfileService.changePassword({
      userId: req.userId,
      currentPassword,
      newPassword,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
