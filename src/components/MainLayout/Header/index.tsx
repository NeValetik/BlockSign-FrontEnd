import Button from "@/components/Form/Button";
import Link from "next/link";
import { FC } from "react";

const Header:FC = () => {
  return (

    <div
      className="h-20 flex items-center justify-between px-36"
    >
      <div
        className="text-3xl"
      >
        BlockSign
      </div>
      <div
        className="flex items-center gap-5"
      >
        <Link
          href="/register"
        >
          <Button
            variant="ghost"
            className="cursor-pointer"
          >
            Register
          </Button>
        </Link>
        <Link
          href="/login"
        >
          <Button
            variant="brand"
            className="cursor-pointer"
          >
            Sign in
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Header;