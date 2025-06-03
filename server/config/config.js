// server/config/config.js

const path = require('path');
// Con __dirname = ".../Calendar/server/config", path.resolve(__dirname, '../.env') → ".../Calendar/server/.env"
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
  PORT: process.env.PORT || 4000,
  GCAL_CLIENT_ID: process.env.GCAL_CLIENT_ID,
  GCAL_CLIENT_SECRET: process.env.GCAL_CLIENT_SECRET,
  GCAL_REDIRECT_URI: process.env.GCAL_REDIRECT_URI,
  GCAL_REFRESH_TOKEN: process.env.GCAL_REFRESH_TOKEN,
  CALENDAR_ID: process.env.CALENDAR_ID || 'primary',
  TIMEZONE: process.env.TIMEZONE || 'America/Argentina/Cordoba'
};
