"use client";

import React from "react";
import "./Dashboard.css";
import LogoutButton from "../LogoutButton";

export default function DashboardPage() {
    
  return (
    <div className="dashboard">
      <div className="welcome-rocky">Welcome Rocky!</div>
      <div className="logout-wrapper">
        <LogoutButton />
      </div>
      <div className="frame-3"></div>
      <div className="rectangle-7"></div>
      <div className="desi-discipline">Desi Discipline</div>

      <img className="icon-1" src="/icon-10.png" alt="icon" />
      <img className="image-1" src="/image-10.png" alt="avatar" />
      <img className="rectangle-6" src="/rectangle-60.svg" alt="bg 1" />
      <img className="rectangle-2" src="/rectangle-20.svg" alt="bg 2" />

      <div className="weekly-insight">Weekly Insight</div>
      <img
        className="pngtree-fire-icon-symbol-simple-design-blaze-transparent-flaming-vector-png-image-46963576-removebg-preview-1"
        src="/pngtree-fire-icon-symbol-simple-design-blaze-transparent-flaming-vector-png-image-46963576-removebg-preview-10.png"
        alt="streak fire"
      />

      <div className="_69-day-streak">69 Day Streak!</div>
      <div className="each-day-you-study-one-aunty-becomes-less-nosey">
        Each day you study, one aunty becomes less nosey!
      </div>

      <div className="line-3"></div>

      <div className="rectangle-8"></div>
      <div className="rectangle-9"></div>
      <div className="rectangle-10"></div>
      <div className="rectangle-11"></div>
      <div className="rectangle-12"></div>
      <div className="rectangle-13"></div>
      <div className="rectangle-14"></div>

      <div className="line-4"></div>

      <img className="polygon-1" src="/polygon-10.svg" alt="arrow1" />
      <img className="polygon-2" src="/polygon-20.svg" alt="arrow2" />

      <div className="rectangle-16"></div>
    </div>
  );
}
