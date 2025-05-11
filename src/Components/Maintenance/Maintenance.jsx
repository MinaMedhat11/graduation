import React from 'react';
import './Maintenance.module.css';

const Maintenance = () => {
  return (
    <div className="maintenance-page">
      <div className="maintenance-content">
        <img src="/images/maintenance.png" alt="Maintenance" />
        <h1>Hang on! We are under maintenance</h1>
        <p>It will not take a long time till we get the error fixed. We will live again in</p>
        <div className="countdown">00 : 04 : 13 : 39</div>
        <div className="notify-section">
          <input type="email" placeholder="Enter your mail" />
          <button className="notify-button">Notify Me</button>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
