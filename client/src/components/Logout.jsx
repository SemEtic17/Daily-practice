import React from "react";
import api from "../utils/api";
import {
  signOutSuccess,
  signOutStart,
  signOutFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { persistor } from "../redux/store";

export default function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      dispatch(signOutStart());
      await api.post("/auth/logout");
      dispatch(signOutSuccess());
      localStorage.removeItem("token");
      // Clear Redux Persist properly
      persistor.pause(); // Pause persistence
      persistor.flush(); // Wait for pending writes to complete
      persistor.purge(); // Purge persisted state
      navigate("/login");
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };
  return (
    <button
      onClick={handleLogout}
      className="h-8 w-16 rounded-2xl bg-blue-500 hover:cursor-pointer"
    >
      {loading ? "LogingOut..." : "LogOut"}
    </button>
  );
}
