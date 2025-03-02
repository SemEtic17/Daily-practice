import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Button } from "flowbite-react";

export default function home() {
  const [data, setData] = useState(null);

  const handleClick = async () => {
    try {
      const res = await api.get("/users/dashboard-users");
      setData(res);
    } catch (error) {
      setData(error);
    }
  };

  return (
    <div className="text-4xl">
      <h1>Admin</h1>
      <Button onClick={handleClick}>Get All Users</Button>
      <div>{data}</div>
    </div>
  );
}
