import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/users/profile", {
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
    </div>
  );
};

export default Profile;
