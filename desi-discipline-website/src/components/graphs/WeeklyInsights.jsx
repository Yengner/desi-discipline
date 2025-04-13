"use client";

import React from "react";

export default function WeeklyInsight({ stats }) {
  if (!Array.isArray(stats) || stats.length === 0) {
    return (
      <div className="insight-container">
        <div className="insight-title">Weekly Insight</div>
        <div className="insight-content">
          <p style={{ padding: "20px", color: "#721c24" }}>
            No stats available for the past weeks.
          </p>
        </div>
      </div>
    );
  }

  const mostProductive = stats.reduce((max, curr) =>
    curr.total_study_time > max.total_study_time ? curr : max
  );

  const leastProductive = stats.reduce((min, curr) =>
    curr.total_study_time < min.total_study_time ? curr : min
  );

  const avgStudyTime =
    stats.reduce((sum, s) => sum + s.total_study_time, 0) / stats.length;

  const avgDistractionVisits =
    stats.reduce((sum, s) => sum + s.distraction_visits, 0) / stats.length;

  return (
    <div className="insight-container">
      <div className="insight-title">Weekly Insight</div>
      <div className="insight-content">
        <ul style={{ listStyle: "none", padding: "20px", margin: 0, color: "#721c24" }}>
          <li>📅 Most productive week: <b>{mostProductive.week_start_date}</b></li>
          <li>😴 Least productive week: <b>{leastProductive.week_start_date}</b></li>
          <li>📈 Average study time: <b>{Math.round(avgStudyTime)} mins</b></li>
          <li>📉 Avg distractions per week: <b>{Math.round(avgDistractionVisits)}</b></li>
          <li>🔥 Last week's study time: <b>{stats.at(-1)?.total_study_time || 0} mins</b></li>
        </ul>
      </div>
    </div>
  );
}
