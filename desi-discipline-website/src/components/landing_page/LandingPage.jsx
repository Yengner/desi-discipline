import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="desktop-1">
      <div className="content-container">
        <h1 className="desi-discipline">Desi Discipline</h1>
        <img className="decorative-image" src="/img-9478-10.png" alt="Decorative" />

        <form className="login-form">
          <label htmlFor="username">Username:</label>
          <input type="email" id="username" placeholder="Enter email" />

          <label htmlFor="password">Password:</label>
          <input type="password" id="password" placeholder="Enter password" />

          <button id="loginBtn">Login</button>
        </form>

        <div className="signup-text">
          New Here? <a href="/signuppath/index.html">Sign Up</a>
          <div className="mummy">(before I call your mummy)</div>
        </div>
      </div>
    </div>
  );
}
