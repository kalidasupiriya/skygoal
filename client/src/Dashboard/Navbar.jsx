import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Store/AuthSlice";
import { logoutUser } from "../Store/logoutUser";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">SkyGoal</a>
        <div className="d-flex">
          {isAuthenticated ? (
            <>
              <span className="navbar-text me-3">
                {user?.firstName} {user?.lastName}
              </span>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a className="btn btn-outline-primary me-2" href="/login">Login</a>
              <a className="btn btn-primary" href="/register">Register</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
