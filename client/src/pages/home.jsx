import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const { user } = useSelector((state) => state.user);
  return (
    <div className="text-4xl">
      <h1>{`Welcome ${user.name}`}</h1>
    </div>
  );
}
