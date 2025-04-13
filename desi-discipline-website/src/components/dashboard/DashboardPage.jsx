"use client";
import React from "react";
import LogoutButton from "../LogoutButton";
<<<<<<< HEAD
import StudyChart from "../graphs/StudyChart";

export default function DashboardPage({stats}) {
    
  return (
    <div className="">
      <div className="welcome-rocky">Welcome Rocky!</div>
      <div className="logout-wrapper">
        <LogoutButton />
      </div>

      <div className="_69-day-streak">69 Day Streak!</div>
      <div className="each-day-you-study-one-aunty-becomes-less-nosey">
        Each day you study, one aunty becomes less nosey!
      </div>

      <div className="line-3"></div>

      <StudyChart stats={stats} />

      <div className="line-4"></div>

=======
import "./Dashboard.css";
export default function DashboardPage() {
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
            <div className="y-axis"></div>
            <div className="bars">
              <div className="bar bar-1"></div>
              <div className="bar bar-2"></div>
              <div className="bar bar-3"></div>
              <div className="bar bar-4"></div>
              <div className="bar bar-5"></div>
              <div className="bar bar-6"></div>
              <div className="bar bar-7"></div>
            </div>
            <div className="x-axis"></div>
          </div>
          {/* Weekly insight */}
          <div className="insight-container">
            <div className="insight-title">Weekly Insight</div>
            <div className="insight-content"></div>
          </div>
        </div>
      </div>
>>>>>>> c4439224ff4ccd00fdaeeafbf09c036057a92109
    </div>
  );
}