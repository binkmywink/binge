import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../services/auth";

export default function SignUp() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!displayName.trim()) {
      setError("Name is required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, displayName);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak");
      } else {
        setError(err.message || "Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 style={{ marginBottom: "0.5rem" }}>Create Account</h1>
        <p style={{ color: "var(--text2)", marginBottom: "2rem" }}>
          Join Binge to start tracking your favorite shows
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label htmlFor="name" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="John Doe"
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

          <div>
            <label htmlFor="confirm" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
