import React, { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true; // 👈 send cookies automatically

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [showUpdatePw, setShowUpdatePw] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          setError(res.data.message || "Failed to load profile");
        }
      } catch (err) {
        if (err.response?.status === 401) {
          // Only redirect if not already authenticated
          setError("Unauthorized. Please login.");
        } else {
          setError("Network error: " + err.message);
        }
      }
    };

  fetchProfile();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPwMessage("");
    try {
      const res = await api.post("/users/update-password", {
        oldPassword,
        newPassword,
      });
      if (res.data.success) {
        setPwMessage("Password updated successfully.");
        setOldPassword("");
        setNewPassword("");
      } else {
        setPwMessage(res.data.message || "Failed to update password.");
      }
    } catch (err) {
      setPwMessage(err.response?.data?.message || "Network error: " + err.message);
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="container mt-5">
      <h2>
        Welcome, {user.firstName} {user.lastName}
      </h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Status:</strong> {user.status}</p>

      <hr />
      <button className="btn btn-outline-primary mb-3" onClick={() => setShowUpdatePw(true)}>
        Update Password
      </button>
      {showUpdatePw && (
        <form onSubmit={handleUpdatePassword} style={{ maxWidth: 400 }}>
          <h4>Update Password</h4>
          <div className="mb-2">
            <label>Old Password</label>
            <input type="password" className="form-control" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
          </div>
          <div className="mb-2">
            <label>New Password</label>
            <input type="password" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary">Update Password</button>
          <button type="button" className="btn btn-link" onClick={() => { setShowUpdatePw(false); setOldPassword(""); setNewPassword(""); setPwMessage(""); }}>Cancel</button>
          {pwMessage && <div className="mt-2 text-danger">{pwMessage}</div>}
        </form>
      )}
    </div>
  );
};

export default Profile;
