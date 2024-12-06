import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import './styles/App.css';

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <Dashboard />
    </div>
  );
};

export default App;
