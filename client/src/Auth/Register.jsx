import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../Store/AuthSlice";

const Register = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleChange =  (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async  (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      // Only redirect to OTP verify page, not login
      window.location.href = `/verify-otp?email=${formData.email}`;
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-5">
          <div className="card p-4 shadow">
            <h3 className="text-center mb-4">Register</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

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
                <label className="form-label">Mobile</label>
                <input
                  type="text"
                  className="form-control"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  title="Enter a 10 digit mobile number"
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
                  {error.message || "Registration failed"}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>
            </form>

            <div className="mt-3 text-center">
              <p>
                Already have an account? <a href="/login">Login</a>
              </p>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
