"use client";
import React from "react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

const Logout = () => {
  return (
    <div>
      <Button onClick={() => signOut()}>Logout</Button>
    </div>
  );
};

export default Logout;
