'use client'

import { useUserContext } from "@/contexts/userContext";
import { FC } from "react"
import { AvatarImage } from "../Form/Avatar/components/AvatarImage";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "../Form/DropDown";
import { ChevronDown, LogOut, User, FileText, Settings } from "lucide-react";

import Avatar from "@/components/Form/Avatar";
import AvatarFallback from "../Form/Avatar/components/AvatarFallback";
import getUserShortFromFullName from "@/utils/getUserShortFromFullName";
import { useRouter } from "next/navigation";

const Profile:FC = () => {
  const { me } = useUserContext();
  const nameFallback = getUserShortFromFullName(me?.profile.fullName);
  const { push } = useRouter();
   
  const links = [
    {
      key: 'profile',
      component: (
        <div className="flex items-center gap-2">
          <User className="size-4" />
          <span>Profile</span>
        </div>
      ),
      onClick: () => {push('/profile')},
    },
    {
      key: 'documents',
      component: (
        <div className="flex items-center gap-2">
          <FileText className="size-4" />
          <span>Documents</span>
        </div>
      ),
      onClick: () => {push('/documents')},
    },
    {
      key: 'settings',
      component: (
        <div className="flex items-center gap-2">
          <Settings className="size-4" />
          <span>Settings</span>
        </div>
      ),
      onClick: () => {push('/settings')},
    },
    {
      key: 'logout',
      component: (
        <div className="flex items-center gap-2 text-destructive">
          <LogOut className="size-4" />
          <span>Logout</span>
        </div>
      ),
      onClick: () => {handleLogout()},
    },
  ]

  const handleLogout = () => { 
    console.log('logout'); 
    // Add actual logout logic here
  }

  if (!me) {
    return null;
  }
  
  return (
    <div className="flex items-center gap-3">
      {/* Desktop Profile */}
      <div className="hidden md:flex items-center gap-3">
        <div className="flex flex-col items-end text-right">
          <div className="font-semibold text-sm text-foreground">
            {me.profile.fullName}
          </div>
          <div className="text-muted-foreground text-xs">
            {me.profile.email}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
              <Avatar className="size-8">
                <AvatarImage src={me.profile.avatar} />
                <AvatarFallback className="text-xs">
                  {nameFallback}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="size-4 text-muted-foreground data-[state=open]:rotate-180 transition-transform duration-200" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
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

      {/* Mobile Profile */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent transition-colors">
              <Avatar className="size-8">
                <AvatarImage src={me.profile.avatar} />
                <AvatarFallback className="text-xs">
                  {nameFallback}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <div className="font-semibold text-sm text-foreground">
                  {me.profile.fullName.split(' ')[0]}
                </div>
                <div className="text-muted-foreground text-xs">
                  {me.profile.email.split('@')[0]}
                </div>
              </div>
              <ChevronDown className="size-4 text-muted-foreground data-[state=open]:rotate-180 transition-transform duration-200 ml-auto" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {/* User Info Header */}
            <div className="px-3 py-2 border-b border-border">
              <div className="font-semibold text-sm text-foreground">
                {me.profile.fullName}
              </div>
              <div className="text-muted-foreground text-xs">
                {me.profile.email}
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