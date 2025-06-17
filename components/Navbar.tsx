"use client";

import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, UserIcon, Settings2Icon } from "lucide-react";

function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-white/50 backdrop-blur-md border-b border-white/20"></div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-600 to-teal-700 bg-clip-text text-transparent">
                TaskMaster
              </h1>
            </Link>
          </div>

          {/* Center Nav */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              href="/features"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200"
            >
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="border border-cyan-200/30 bg-white/50 backdrop-blur-sm hover:bg-cyan-50 text-cyan-700"
                  >
                    <UserIcon className="h-5 w-5 mr-2" />
                    {session?.user?.name || "Account"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white/80 backdrop-blur-sm border-cyan-100">
                  <DropdownMenuItem className="hover:bg-cyan-50">
                    <Link
                      href="/dashboard"
                      className="flex items-center w-full"
                    >
                      <UserIcon className="h-4 w-4 mr-2 text-cyan-500" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-cyan-50">
                    <Link href="/settings" className="flex items-center w-full">
                      <Settings2Icon className="h-4 w-4 mr-2 text-cyan-500" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-cyan-100/50" />
                  <DropdownMenuItem
                    className="hover:bg-red-50 text-red-600 hover:text-red-700"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="border border-cyan-200/30 bg-white/50 backdrop-blur-sm hover:bg-cyan-50 text-cyan-700"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-cyan-600 hover:bg-teal-700 text-white shadow-cyan-200/50 shadow-lg hover:shadow-cyan-300/50 hover:scale-105 transition-all duration-200">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
