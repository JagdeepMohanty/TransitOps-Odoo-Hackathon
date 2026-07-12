const cron = require('node-cron');
const prisma = require('../config/prisma');

// Runs every day at 8:00 AM
const startLicenseExpiryReminder = () => {
  cron.schedule('0 8 * * *', async () => {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    const expiringDrivers = await prisma.driver.findMany({
      where: {
        licenseExpiry: {
          gte: today,
          lte: thirtyDaysLater,
        },
        status: { not: 'Suspended' },
      },
    });

    if (expiringDrivers.length > 0) {
      console.log(`[LicenseExpiryReminder] ${expiringDrivers.length} driver(s) have licenses expiring within 30 days:`);
      expiringDrivers.forEach((driver) => {
        console.log(`  - ${driver.name} | License: ${driver.licenseNumber} | Expiry: ${driver.licenseExpiry}`);
      });
    }
  });

  console.log('[LicenseExpiryReminder] Cron job scheduled — runs daily at 8:00 AM');
};

module.exports = { startLicenseExpiryReminder };
