import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Store/AuthSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, user, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [showReset, setShowReset] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  useEffect(() => {
    if (error && error.message && error.message.toLowerCase().includes("account locked")) {
      setShowReset(true);
    } else {
      setShowReset(false);
    }
  }, [error]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMsg("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setResetMsg("Password reset successfully. You can now login.");
        setShowReset(false);
        setNewPassword("");
      } else {
        setResetMsg(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setResetMsg("Network error: " + err.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-5">
          <div className="card p-4 shadow">
            <h3 className="text-center mb-4">Login</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>


              {error && (
                <div className="alert alert-danger">
                  {error.message || "Login failed"}
                </div>
              )}

              {showReset && (
                <form onSubmit={handleResetPassword} className="mt-3">
                  <div className="mb-2">
                    <label>New Password</label>
                    <input type="password" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} />
                  </div>
                  <button type="submit" className="btn btn-warning">Reset Password</button>
                  {resetMsg && <div className="mt-2 text-success">{resetMsg}</div>}
                </form>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center mt-3 mb-0">
              Don't have an account?{" "}
              <a href="/register" className="text-decoration-none">
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
