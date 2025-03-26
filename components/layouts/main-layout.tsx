"use client";

import SideBar from "components/sidebar";

export default async function MainLayout({ children }) {
  return (
    <main className="w-full h-screen flex items-center justify-center">
      <SideBar />
      {children}
    </main>
  );
}
