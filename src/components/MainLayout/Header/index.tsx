'use client';

import { FC } from "react";
import { useUserContext } from "@/contexts/userContext";

import Button from "@/components/Form/Button";
import LanguageSelector from "@/components/LanguageSelector";
import Link from "next/link";
import Profile from "@/components/Profile";

const Header:FC = () => {
  const { me } = useUserContext();

  if (!me) {
    return (
      <div
        className="h-20 flex items-center justify-between px-36"
      >
        <Link
          href="/"
          className="text-3xl"
        >
          BlockSign
        </Link>
        <div
          className="flex items-center gap-5"
        >
          <LanguageSelector />
          <Link
            href="/register"
          >
            <Button
              variant="ghost"
            >
              Register
            </Button>
          </Link>
          <Link
            href="/login"
          >
            <Button
              variant="brand"
            >
              Sign in
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="h-20 flex items-center justify-between px-36"
    >
      <Link
        href="/"
        className="text-3xl"
      >
        BlockSign
      </Link>
      <div
        className="flex items-center gap-5"
      >
        <LanguageSelector />
        <Profile />
      </div>
    </div>
  )
}

export default Header;