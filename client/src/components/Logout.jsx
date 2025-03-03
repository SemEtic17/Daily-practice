import React from "react";
import api from "../utils/api";
import { signOut } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await api.post("/auth/logout");
    dispatch(signOut());
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <button
      onClick={handleLogout}
      className="h-8 w-16 rounded-2xl bg-blue-500 hover:cursor-pointer"
    >
      Logout
    </button>
  );
}
