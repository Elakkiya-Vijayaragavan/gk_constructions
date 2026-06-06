const Setting = require("../models/Setting");

const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    } else {
      let updated = false;
      if (settings.companyName === "LK Constructions") {
        settings.companyName = "GK Constructions";
        updated = true;
      }
      if (settings.email === "lkconstructions@example.com") {
        settings.email = "kavihari155@gmail.com";
        updated = true;
      }
      if (updated) {
        await settings.save();
      }
    }
    res.json({ settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const data = req.body;
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(data);
    } else {
      Object.assign(settings, data);
      await settings.save();
    }
    res.json({ settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSettings, updateSettings };
