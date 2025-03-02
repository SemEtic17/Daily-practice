import React from "react";
import { Navbar } from "flowbite-react";
export default function Navbarr() {
  return (
    <Navbar fluid className="rounded-3xl mx-auto mb-20">
      <Navbar.Brand href="/" className="ml-5">
        <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
          My App
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="mr-8">
        <Navbar.Link href="/" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="/login">Login</Navbar.Link>
        <Navbar.Link href="/signup">Signup</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
