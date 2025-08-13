

import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./Auth/Register";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Login from "./Auth/Login";
import VerifyOtp from "./Auth/VerifyOtp";
import Profile from "./Dashboard/Profile";
import AuthCheck from "./Auth/AuthCheck";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./Dashboard/Navbar";
import { fetchProfile } from "./Store/fetchProfile";
import { useEffect } from "react";


const App = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user]);
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? <Login /> : <Navigate to="/profile" replace />
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? <Register /> : <Navigate to="/profile" replace />
          }
        />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route
          path="/profile"
          element={
            <AuthCheck>
              <Profile />
            </AuthCheck>
          }
        />
      </Routes>
    </>
  );
};

export default App