import { useState } from "react";
import { supabase } from "./supabase";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("SIGN UP ERROR:", error);
      return;
    }

    console.log("Signed up:", data);
  }

  async function login() {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      console.error("LOGIN ERROR:", error);
      return;
    }

    console.log("Logged in:", data);
  }

  return (
    <div>
      <h2>Authentication</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={signUp}>
        Sign Up
      </button>

      <button onClick={login}>
        Login
      </button>
    </div>
  );
}

export default Auth;