"use client";
import './LandingPage.css';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="desktop-1">
      <div className="content-container">
        <h1 className="desi-discipline">Desi Discipline</h1>
        <img className="decorative-image" src="/img-9478-10.png" alt="Decorative" />

        <div className="button-group">
          <Link href="/login">
            <button className="main-btn">Login</button>
          </Link>
          <Link href="/sign-up">
            <button className="main-btn">Sign Up</button>
          </Link>
        </div>

        <div className="signup-text">
          Stay disciplined or your mummy’s coming for you 👀
        </div>
      </div>
    </div>
  );
}
