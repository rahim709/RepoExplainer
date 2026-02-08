"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in via cookie existence by hitting an API or checking a flag
    // (Simpler check for UI state)
    const checkAuth = async () => {
       // Optional: Add logic here if you want real server-side validation
       // For now, we rely on the state from previous interactions or simplistic logic
       // Since your auth uses httpOnly cookies, we can't read 'token' from localStorage directly usually
       // But assuming your previous logic:
       const token = localStorage.getItem("token"); // Only works if you set this on login manually
       // setIsLoggedIn(!!token);
    };
    checkAuth();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3 md:p-4 border-b border-[#30363d] bg-[#161b22]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
          <Image 
            src="/Octo-Icon.svg" 
            alt="RepoExplainer Logo" 
            width={28} 
            height={28} 
            className="w-7 h-7 md:w-8 md:h-8"
          />
          <span className="text-lg md:text-xl font-bold tracking-tight text-white">
            RepoExplainer
          </span>
        </Link>
        
        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2 md:gap-3">
          {isLoggedIn ? (
            <Link 
              href="/chat" 
              className="px-3 py-1.5 md:px-4 md:py-1.5 rounded-md border border-[#238636] bg-[#238636] text-xs md:text-sm font-bold text-white hover:bg-[#2ea043] transition-all shadow-sm whitespace-nowrap"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/auth/login" 
                className="px-2 py-1.5 md:px-4 text-xs md:text-sm font-medium text-[#c9d1d9] hover:text-white transition-colors whitespace-nowrap"
              >
                Sign in
              </Link>

              <Link 
                href="/auth/register" 
                className="px-3 py-1.5 md:px-4 rounded-md border border-[#30363d] bg-[#21262d] text-xs md:text-sm font-medium text-white hover:bg-[#30363d] hover:border-[#8b949e] transition-all whitespace-nowrap"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};