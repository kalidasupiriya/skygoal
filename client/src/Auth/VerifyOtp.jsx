import React, { useState } from "react";
import axios from "axios";
const API_BASE_URL = "http://localhost:5000/api/v1";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const email = new URLSearchParams(window.location.search).get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/otp/verify-otp`, { email, otp });
      alert(res.data.message);
      if (res.data.success) {
        window.location.href = "/login"; // redirect to login
      }
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="container mt-5">
     <div className="col-md-5 m-auto">
       <h3>Verify OTP</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
          className="form-control mb-3"
        />
        <button className="btn btn-primary">Verify</button>
      </form>
     </div>
    </div>
  );
};

export default VerifyOtp;
