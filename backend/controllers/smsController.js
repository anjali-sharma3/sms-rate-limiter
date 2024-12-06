const db = require('../config/db');
const moment = require('moment');

const sendSMS = async (req, res, next) => {
  const { phoneNumber, message } = req.body;
  const ipAddress = req.ip;

  try {
    const logEntry = {
      ip_address: ipAddress,
      phone_number: phoneNumber,
      message: message,
      created_at: moment().toISOString(),
      status: 'Success',
    };

    await db('sms_logs').insert(logEntry);

    return res.status(200).json({ message: 'SMS sent successfully' });
  } catch (error) {
    return next(error);
  }
};


const getStats = async (req, res) => {
  try {
    const logs = await db('sms_logs')
      .select('message', 'created_at', 'status')
      .orderBy('created_at', 'desc');
    const now = moment();

    const oneMinuteAgo = now.subtract(1, 'minute');
    const smsLastMinuteCount = await db('sms_logs')
      .where('created_at', '>=', oneMinuteAgo.toISOString())
      .count('* as count')
      .first();

    const startOfDay = now.clone().startOf('day');
    const smsTodayCount = await db('sms_logs')
      .where('created_at', '>=', startOfDay.toISOString())
      .count('* as count')
      .first();

    return res.status(200).json({
      logs,
      smsLastMinuteCount: smsLastMinuteCount.count,
      smsTodayCount: smsTodayCount.count,
    });
  } catch (error) {
    console.error('Error fetching SMS logs:', error);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
};


module.exports = { sendSMS, getStats };

