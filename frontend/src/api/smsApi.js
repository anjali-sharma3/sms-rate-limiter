import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/sms';

// API to send SMS
export const sendSms = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send`, data);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || 'An error occurred' };
  }
};

// API to get SMS statistics
export const getStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    return { error: error.response?.data?.message || 'An error occurred' };
  }
};
