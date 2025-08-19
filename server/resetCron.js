const cron = require('node-cron');
const User = require('./models/User');

// Reset loginAttempts for all users every 3 hours
cron.schedule('0 */3 * * *', async () => {
  try {
    await User.updateMany({}, { $set: { loginAttempts: 0, lastAttemptTime: null } });
    console.log('Reset loginAttempts for all users');
  } catch (err) {
    console.error('Error resetting loginAttempts:', err);
  }
});
