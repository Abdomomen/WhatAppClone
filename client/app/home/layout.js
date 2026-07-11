"use client";
import useInitAuth from "../hooks/useInitAuth";

export default function HomeLayout({ children }) {
  useInitAuth();
  return <>{children}</>;
}
