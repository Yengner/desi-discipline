"use client";

import React from "react";
import "./Dashboard.css";
import LogoutButton from "../LogoutButton";
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

    </div>
  );
}
