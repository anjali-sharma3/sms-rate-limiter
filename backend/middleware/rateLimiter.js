const db = require('../config/db');
const moment = require('moment');


const RATE_LIMITS = {
  PER_MINUTE: 3,
  PER_DAY: 10,
};

const rateLimiter = async (req, res, next) => {
  const { ip: ipAddress } = req;
  const { phoneNumber } = req.body;

  try {
    const now = moment();

    // Check if there's an existing record for IP address and phone number in the  table
    const rateLimit = await db('rate_limits')
      .where({ ip_address: ipAddress, phone_number: phoneNumber })
      .first();

    if (rateLimit) {
      const minutesElapsed = now.diff(rateLimit.last_request, 'minutes');
      const dailyElapsed = now.diff(rateLimit.last_request, 'days');

      // Reset counts if more than a day has passed
      if (dailyElapsed >= 1) {
        await db('rate_limits')
          .update({ minute_count: 0, daily_count: 0, last_request: now.toISOString() })
          .where({ ip_address: ipAddress, phone_number: phoneNumber });
      }

      // Reset the minute count if more than a minute has passed
      if (minutesElapsed >= 1) {
        await db('rate_limits')
          .update({ minute_count: 0, last_request: now.toISOString() })
          .where({ ip_address: ipAddress, phone_number: phoneNumber });
      }

      // If the rate limit is exceeded, return a 429 status with retry-after header
      if (rateLimit.daily_count >= RATE_LIMITS.PER_DAY) {
        // Log the rate limit violation for daily requests
        await db('sms_logs').insert({
          ip_address: ipAddress,
          phone_number: phoneNumber,
          created_at: now.toISOString(),
          status: 'Rate Limit Exceeded (Daily)',
        });

        return res.status(429).header('Retry-After', moment(rateLimit.last_request).add(1, 'day').toISOString())
          .json({ message: 'You have exceeded the daily request limit. Try again tomorrow.' });
      }

      if (rateLimit.minute_count >= RATE_LIMITS.PER_MINUTE) {
        // Log the rate limit violation for minute requests
        await db('sms_logs').insert({
          ip_address: ipAddress,
          phone_number: phoneNumber,
          created_at: now.toISOString(),
          status: 'Rate Limit Exceeded (Minute)',
        });
        return res.status(429).header('Retry-After', moment(rateLimit.last_request).add(1, 'minute').toISOString())
          .json({ message: 'Too many requests in the last minute. Try again later.' });
      }

      // Update the rate limit counters for minute and daily counts
      await db('rate_limits')
        .update({
          minute_count: rateLimit.minute_count + 1,
          daily_count: rateLimit.daily_count + 1,
          last_request: now.toISOString(),
        })
        .where({ ip_address: ipAddress, phone_number: phoneNumber });
    } else {
      // If no record exists, create a new one and log the SMS request
      await db('rate_limits').insert({
        ip_address: ipAddress,
        phone_number: phoneNumber,
        minute_count: 1,
        daily_count: 1,
        last_request: now.toISOString(),
      });

      // Log the SMS request in the 'sms_logs' table
      await db('sms_logs').insert({
        ip_address: ipAddress,
        phone_number: phoneNumber,
        created_at: now.toISOString(),
        status: 'Success',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = rateLimiter;

