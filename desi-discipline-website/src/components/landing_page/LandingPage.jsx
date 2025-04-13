"use client";
import './LandingPage.css';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="desktop-1">
      <div className="content-container">
        <h1 className="desi-discipline">Desi Discipline</h1>
        <img className="decorative-image" src="/gifaunty.gif" alt="Decorative" />

        <div className="button-group">
          <Link href="/login" className="LoginLink">
            <button className="main-btn">Login</button>
          </Link>
          <Link href="/sign-up" className="LoginLink">
            <button className="main-btn">Sign Up</button>
          </Link>
        </div>

        <div className="signup-text" style={{ fontFamily: "'Pixelify Sans', sans-serif" }}>
        <strong>Study or mummy’s coming for you 👀</strong>
        </div>
      </div>
    </div>
  );
}
