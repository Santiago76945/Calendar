// server/config/config.js

require('dotenv').config()

module.exports = {
  PORT: process.env.PORT || 4000,
  GCAL_CLIENT_ID: process.env.GCAL_CLIENT_ID,
  GCAL_CLIENT_SECRET: process.env.GCAL_CLIENT_SECRET,
  GCAL_REDIRECT_URI: process.env.GCAL_REDIRECT_URI,
  GCAL_REFRESH_TOKEN: process.env.GCAL_REFRESH_TOKEN,
  CALENDAR_ID: process.env.CALENDAR_ID || 'primary',
  TIMEZONE: process.env.TIMEZONE || 'America/Argentina/Cordoba'
}
