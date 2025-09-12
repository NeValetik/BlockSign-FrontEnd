'use client'

import { useUserContext } from "@/contexts/userContext";
import { FC } from "react"
import { AvatarImage } from "../Avatar/components/AvatarImage";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "../Form/DropDown";
import { ChevronDown, LogOut } from "lucide-react";

import Avatar from "@/components/Avatar";
import AvatarFallback from "../Avatar/components/AvatarFallback";
import getUserShortFromFullName from "@/utils/getUserShortFromFullName";
import Button from "../Form/Button";
import { useRouter } from "next/navigation";

const Profile:FC = () => {
  const { me } = useUserContext();
  const nameFallback = getUserShortFromFullName(me?.profile.fullName);
  const { push } = useRouter();
   
  const links = [
    {
      key: 'profile',
      component: (<div> Profile </div>),
      onClick: () => {push('/profile')},
    },
    {
      key: 'documents',
      component: (<div> Documents </div>),
      onClick: () => {push('/documents')},
    },
    {
      key: 'logout',
      component: (
        <div className="flex gap-2 items-center text-brand">
          Logout
          <LogOut className="text-brand size-4" />
        </div>
      ),
      onClick: () => {handleLogout()},
    },
  ]

  const handleLogout = () => { console.log('logout'); }

  if (!me) {
    return null;
  }
  
  return (
    <div
      className="flex gap-2.5"
    >
      <div className="flex flex-col gap-1 items-end">
        <div className="font-semibold text-sm">
          {me.profile.fullName}
        </div>
        <div className="text-muted-foreground text-sm">
          {me.profile.email}
        </div>
      </div>
      <div className="flex gap-10 items-center">
        <div className="flex gap-3 items-center">
          <Avatar
            className="size-10"
          >
            <AvatarImage
              src={ me.profile.avatar }
            />
            <AvatarFallback>
              { nameFallback }
            </AvatarFallback>
          </Avatar>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <ChevronDown 
                className="
                  size-6 text-brand cursor-pointer 
                  data-[state=open]:-rotate-180 transition-transform 
                  duration-200
                " 
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {
                links.map((link) => {
                  return (
                    <DropdownMenuItem 
                      key={link.key}
                      onClick={link.onClick} 
                      className="cursor-pointer"
                    >
                      {link.component}
                    </DropdownMenuItem>
                  )
                })
              }
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={ ()=>{} }
          className="gap-2"
        >
          <LogOut />
          Exit
        </Button>
      </div>
    </div>
  )
}

export default Profile;