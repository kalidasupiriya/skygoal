import React, { useEffect, useState } from "react";

const Profile = () => {
  // All hooks at the top
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [showUpdatePw, setShowUpdatePw] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/profile`, {
          method: "GET",
          credentials: "include", // include cookies for auth
        });

        if (res.status === 401) {
          // not authenticated
          window.location.href = "/login";
          return;
        }

        if (!res.ok) {
          // some other server error
          setError(`Error ${res.status}: ${res.statusText}`);
          return;
        }

        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch (err) {
        setError("Network error: " + err.message);
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>Loading profile...</p>;

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPwMessage("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/update-password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setPwMessage("Password updated successfully.");
        setOldPassword("");
        setNewPassword("");
      } else {
        setPwMessage(data.message || "Failed to update password.");
      }
    } catch (err) {
      setPwMessage("Network error: " + err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>
        Welcome, {user.firstName} {user.lastName}
      </h2>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Status:</strong> {user.status}
      </p>

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
