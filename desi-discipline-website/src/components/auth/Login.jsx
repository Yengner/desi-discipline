"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { handleLogin } from "@/lib/user.actions";
import './Login.css';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { errorMessage, access_token, refresh_token } = await handleLogin(email, password);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        if (window.chrome && chrome.runtime) {
          chrome.runtime.sendMessage("nlnjmjjcbokfnpapeoofkflkjgndkafc", { token: access_token, refresh_token }, res => {
            console.log("Extension received token");
          });
        }

        toast.success("Logged In!");
        router.push("/dashboard"); // or window.location.reload();
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="desktop-1">
      <div className="content-container">
        <h1 className="desi-discipline">Desi Discipline</h1>
        <img className="decorative-image" src="/gifaunty.gif" alt="Decorative" />

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button id="loginBtn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="signup-text">
          New Here? <Link href="/sign-up">Sign Up</Link>
          <div className="mummy">(before I call your mummy)</div>
        </div>
      </div>
    </div>
  );
}
