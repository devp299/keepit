"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import { usePathname } from 'next/navigation';
import { useState } from "react";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { navItems } from "@/constants";
import { Button } from "./ui/button";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/users.actions";

interface Props {
  $id: string;
  fullName:string;
  accountId: string;
  avatar: string;
  // icon: string;
  email: string;
  // url: string;
}

const MobileNavigation = ({ $id: ownerId, accountId, fullName, avatar, email} : Props) => {
  const [open,setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className='mobile-header'>
      <Image src="/assets/icons/Group 1.svg" alt='logo' width={120} height={52} className='h-auto' />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image src="/assets/icons/menu.svg" alt='Search' width={30} height={30} />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetHeader>
            <SheetTitle>
              <div className="header-user">
                <Image src={avatar} alt="avatar" width={44} height={44} className="header-user-avatar"/>
                <div className="sm:hidden lg:blok">
                  <p className="subtitle-2 capitalize">{fullName}</p>
                  <p className="caption">{email}</p>
                </div>
              </div>
              <Separator className="mb-4 bg-light-200/20" />
            </SheetTitle>


            <nav className="mobile-nav">
              <ul className="mobile-nav-list">
            {navItems.map(({ url, icon, name}) => (
                    <Link key={name} href={url} className='lg: w-full'>
                        <li className={cn(
                            "mobile-nav-item",
                            pathname === url && "shad-active"
                        )}>
                            <Image src={icon} alt={name} width={24} height={24} className={cn('nav-icon',pathname === url && 'nav-icon-active')} />
                            <p>{name}</p>
                        </li>
                    </Link>
                ))}
            </ul>
            </nav>
            {/* <Separator className="my-5 bg-light-200/20"/> */}
            <Image src="/assets/images/files-2.png" alt='logo' width={506} height={418} className='w-full' />
            <Separator className="my-5 bg-light-200/20"/>
            <div className="flex flex-col justify-between gap-5 pb-5">
                <FileUploader ownerId={ownerId} accountId={accountId} />

                <Button type='submit' className='mobile-sign-out-button' onClick={async () => await signOutUser()}>
                    <Image src="/assets/icons/logout.svg" alt='logo' width={24} height={24} />
                    <p>Logout</p>
                </Button>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
 
    </header>
  )
}

export default MobileNavigation
