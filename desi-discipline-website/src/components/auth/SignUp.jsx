"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { handleSignUp } from "@/lib/user.actions";
import "./SignUp.css";

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { errorMessage } = await handleSignUp(email, password, userName);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {

        toast.success("Signed Up!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="frame-2">
      <form className="signup-container" onSubmit={handleSubmit}>
        <img className="rectangle-6" src="rectangle-60.svg" alt="bg1" />
        <img className="rectangle-2" src="rectangle-20.svg" alt="bg2" />

        <div className="back-again-login-and-start-studying-no-more-excuses">
          <span className="back-again-login-and-start-studying-no-more-excuses-span">
            Back again?{" "}
          </span>
          <Link
            href="/login"
            className="back-again-login-and-start-studying-no-more-excuses-span2"
          >
            Login
          </Link>
          <span className="back-again-login-and-start-studying-no-more-excuses-span3">
            {" "}
            and start studying. No more excuses!
          </span>
        </div>

        <div className="rectangle-1"></div>
        <div className="desi-discipline" style={{ fontFamily: "'Pixelify Sans', sans-serif" }}>Desi Discipline</div>

        <div className="email">Email:</div>
        <input
          className="rectangle-3"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="username">Username:</div>
        <input
          className="rectangle-4"
          type="text"
          name="username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />

        <div className="password">Password:</div>
        <input
          className="rectangle-7"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <img className="img-3923-1" src="img-3923-10.png" alt="decor" />

        <button className="rectangle-15" type="submit" disabled={loading}>
          <span className="sign-up">{loading ? "Loading..." : "Sign Up"}</span>
        </button>
      </form>
    </div>
  );
}
