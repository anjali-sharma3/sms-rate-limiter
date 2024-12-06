import React, { useState } from 'react';
import { sendSms } from '../api/smsApi';
import '../styles/SmsForm.css';

const SmsForm = ({ refreshStats }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await sendSms({ phoneNumber, message });

    if (response.error) {
      setFeedback({ message: response.error, color: 'red' });
    } else {
      setFeedback({ message: 'SMS sent successfully!', color: 'green' });
      refreshStats();
    }

    setTimeout(() => {
      setFeedback('');
      window.location.reload(); 
    }, 3000);
  };

  return (
    <div className="sms-form">
      <h2>Send SMS</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter phone number"
          required
        />
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          required
        ></textarea>
        <button type="submit">Send SMS</button>
      </form>
      {feedback && (
        <p className="feedback" style={{ color: feedback.color }}>
          {feedback.message}

        </p>
      )}
    </div>
  );
};

export default SmsForm;
