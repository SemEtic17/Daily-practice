import React from "react";
import { Navbar } from "flowbite-react";
import { useSelector } from "react-redux";
import Logout from "./Logout";

export default function Navbarr() {
  const user = useSelector((state) => state.user);
  return (
    <Navbar fluid className="rounded-3xl mx-auto mb-20">
      <Navbar.Brand href="/" className="ml-5">
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
          My App
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="flex items-center mr-8 text-white">
        <Navbar.Link className="self-center" href="/" active>
          Home
        </Navbar.Link>
        {!user && (
          <>
            <Navbar.Link className="self-center" href="/login">
              Login
            </Navbar.Link>
            <Navbar.Link className="self-center" href="/signup">
              Signup
            </Navbar.Link>
          </>
        )}
        {user && <Logout />}
      </Navbar.Collapse>
    </Navbar>
  );
}
