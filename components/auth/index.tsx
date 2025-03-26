"use client";

import { useState } from "react";
import SignUp from "./signup";
import SignIn from "./signin";

export default function Auth() {
  const [view, setView] = useState("SIGNUP");
  return (
    <main className="h-screen w-screen flex justify-center items-center bg-gradient-to-br from-purple-100 to-light-blue-100">
      {view === "SIGNUP" ? (
        <SignUp setView={setView} />
      ) : (
        <SignIn setView={setView} />
      )}
    </main>
  );
}
