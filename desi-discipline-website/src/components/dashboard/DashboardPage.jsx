"use client";

import React from "react";
import LogoutButton from "../LogoutButton";
import "./Dashboard.css";
import StudyChart from "../graphs/StudyChart";


export default function DashboardPage({stats}) {
  return (
    <div className="dashboard">
      {/* Header with logo and title */}
      <div className="header">
        <div className="logo-title">
          <img className="logo" src="/icon-10.png" alt="Desi Discipline logo" />
          <div className="title">Desi Discipline</div>
        </div>
        <div className="logout-wrapper">
          <LogoutButton />
        </div>
      </div>
      {/* Main content */}
      <div className="welcome-message">Welcome Rocky!</div>
      {/* Dashboard card with border */}
      <div className="dashboard-card">
        {/* Streak info */}
        <div className="streak-container">
          <div className="streak-icon">
            <img
              src="/pngtree-fire-icon-symbol-simple-design-blaze-transparent-flaming-vector-png-image-46963576-removebg-preview-10.png"
              alt="streak fire"
            />
          </div>
          <div className="streak-info">
            <div className="streak-title">69 Day Streak!</div>
            <div className="streak-message">
              Each day you study, one aunty becomes less nosey!
            </div>
          </div>
        </div>
        {/* Chart and insights */}
        <div className="chart-insight-container">
          {/* Bar chart */}
          <div className="chart-container">
      <StudyChart stats={stats}/>
          </div>
          {/* Weekly insight */}
          <div className="insight-container">
            <div className="insight-title">Weekly Insight</div>
            <div className="insight-content"></div>
          </div>
        </div>
      </div>
    </div>
  );
}