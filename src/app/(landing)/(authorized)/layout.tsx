'use client'

import { useUserContext } from "@/contexts/userContext"
import { redirect } from "next/navigation";
import { useLayoutEffect } from "react"

const AuthorizedLayout = ({ children }: { children: React.ReactNode }) => {
  const { me } = useUserContext();
  useLayoutEffect(()=>{
    if(!me){
      redirect('/login');
    }
  })
  return (
    <div>

      {children}
    </div>
  )
}

export default AuthorizedLayout;