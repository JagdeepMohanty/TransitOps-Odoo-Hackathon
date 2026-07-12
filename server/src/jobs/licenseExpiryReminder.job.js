import cron from 'node-cron';
import prisma from '../config/prisma.js';

export const startLicenseExpiryReminder = () => {
  cron.schedule('0 8 * * *', async () => {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    const expiringDrivers = await prisma.driver.findMany({
      where: {
        licenseExpiryDate: {
          gte: today,
          lte: thirtyDaysLater,
        },
        status: { not: 'SUSPENDED' },
      },
    });

    if (expiringDrivers.length > 0) {
      console.log(`[LicenseExpiryReminder] ${expiringDrivers.length} driver(s) have licenses expiring within 30 days:`);
      expiringDrivers.forEach((driver) => {
        console.log(`  - ${driver.name} | License: ${driver.licenseNumber} | Expiry: ${driver.licenseExpiryDate}`);
      });
    }
  });

  console.log('[LicenseExpiryReminder] Cron job scheduled — runs daily at 8:00 AM');
};
