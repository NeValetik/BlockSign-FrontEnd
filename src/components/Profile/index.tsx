'use client'

import { useUserContext } from "@/contexts/userContext";
import { FC } from "react"
import { AvatarImage } from "../Avatar/components/AvatarImage";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "../Form/DropDown";
import { ChevronDown, FileText, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import Avatar from "@/components/Avatar";
import AvatarFallback from "../Avatar/components/AvatarFallback";
import getUserShortFromFullName from "@/utils/getUserShortFromFullName";
import Button from "../Form/Button";

const Profile:FC = () => {
  const { me } = useUserContext();
  const nameFallback = getUserShortFromFullName(me?.fullName);
  const { push } = useRouter();
  const isAdmin = me?.role === "ADMIN";

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: '/' });
    localStorage.removeItem('privateKey');
  }
   
  const links = isAdmin ? [
    {
      key: 'admin',
      component: (<div> Admin Console </div>),
      onClick: () => {push('/adminconsole')},
    },
    {
      key: 'logout',
      component: (
        <div className="flex items-center gap-2 text-destructive">
          <LogOut className="size-4" />
          <span>Logout</span>
        </div>
      ),
      onClick: handleLogout,
    },
  ] : [
    {
      key: 'profile',
      component: (<div> Profile </div>),
      onClick: () => {push('/account/profile')},
    },
    {
      key: 'documents',
      component: (
        <div className="flex items-center gap-2">
          <FileText className="size-4" />
          <span>Documents</span>
        </div>
      ),
      onClick: () => {push('/verify-doc')},
    },
    {
      key: 'logout',
      component: (
        <div className="flex items-center gap-2 text-destructive">
          <LogOut className="size-4" />
          <span>Logout</span>
        </div>
      ),
      onClick: handleLogout,
    },
  ]

  if (!me) {
    return null;
  }
  
  return (
    <div>
      <div className="hidden md:flex gap-2.5">
        <div className="flex flex-col gap-1 items-end">
          <div className="font-semibold text-sm">
            {me.fullName}
          </div>
          <div className="text-muted-foreground text-sm">
            {me.email}
          </div>
        </div>
        <div className="flex gap-10 items-center">
          <div className="flex gap-3 items-center">
            <Avatar
              className="size-10"
            >
              <AvatarImage
                src=""
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
            onClick={ handleLogout }
            className="gap-2"
          >
            <LogOut />
            Exit
          </Button>
        </div>
      </div>
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
              <Avatar className="size-8">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs">
                  {nameFallback}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <div className="font-semibold text-sm text-foreground">
                  {me.fullName}
                </div>
                <div className="text-muted-foreground text-xs">
                  {me.email}
                </div>
              </div>
              <ChevronDown className="size-4 text-muted-foreground data-[state=open]:rotate-180 transition-transform duration-200 ml-auto" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* User Info Header */}
            <div className="px-3 py-2 border-b border-border">
              <div className="font-semibold text-sm text-foreground">
                {me.fullName}
              </div>
              <div className="text-muted-foreground text-xs">
                {me.email}
              </div>
            </div>
            
            {/* Menu Items */}
            {links.map((link) => (
              <DropdownMenuItem 
                key={link.key}
                onClick={link.onClick} 
                className="cursor-pointer"
              >
                {link.component}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Profile;