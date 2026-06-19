import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else {
        setError(err.message || "Failed to login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 style={{ marginBottom: "0.5rem" }}>Login to Binge</h1>
        <p style={{ color: "var(--text2)", marginBottom: "2rem" }}>
          Sign in to your account to track your shows
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                backgroundColor: "var(--surface2)",
                color: "var(--text1)",
              }}
            />
          </div>

          <div>
            <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                backgroundColor: "var(--surface2)",
                color: "var(--text1)",
              }}
            />
          </div>

          {error && (
            <div style={{ color: "#ef4444", fontSize: "0.9rem", padding: "0.75rem", backgroundColor: "rgba(239,68,68,0.1)", borderRadius: "0.5rem" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.75rem",
              backgroundColor: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem" }}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
