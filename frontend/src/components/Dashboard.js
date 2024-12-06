import React, { useEffect, useState } from 'react';
import { getStats } from '../api/smsApi';
import SmsForm from "./SmsForm";
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');
  const [smsUsage, setSmsUsage] = useState({ lastMinute: 0, today: 0 });


  const fetchStats = async () => {
    const response = await getStats();
    if (response.error) {
      setError(response.error);
    } else {
      setStats(response.logs);
      setSmsUsage({
        lastMinute: response.smsLastMinuteCount || 0,
        today: response.smsTodayCount || 0,
      });
      setError('');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <SmsForm refreshStats={fetchStats} />
      <div className="stats">
        <div className='flex'>
          <h2>SMS Request Logs</h2>
          <div className="usage-stats">
            <div className="usage-info">
              <p><strong>Last Minute:</strong> {smsUsage.lastMinute}</p>
              <p><strong>Today:</strong> {smsUsage.today}</p>
            </div>
          </div>
        </div>
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <table className="stats-table">
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Message</th>
                <th>Created At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.length > 0 ? (
                stats.map((log, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{log.message}</td>
                    <td>{new Date(log.created_at).toLocaleString()}</td>
                    <td className={log.status === 'Success' ? 'success' : 'failure'}>
                      {log.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
