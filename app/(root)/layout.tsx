import { getCurrentUser } from '@/lib/actions/users.actions'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import MobileNavigation from '@/components/MobileNavigation'
import SideBar from '@/components/SideBar'
import React from 'react'
import { Toaster } from "@/components/ui/toaster"

export const dynamic = "force-dynamic"

const layout = async ({ children }: { children: React.ReactNode }) => {
    const currentUser = await getCurrentUser();

    // Ensure we redirect properly when no user is found
    if (!currentUser) {
        redirect("/sign-in");
        return null;  // Prevent further rendering
    }

    return (
        <main className='flex h-screen'>
            <SideBar {...currentUser} />
            <section className='flex h-full flex-1 flex-col'>
                <MobileNavigation {...currentUser} />
                <Header userId={currentUser.$id} accountId={currentUser.accountId} />

                <div className='main-content'>
                    {children}
                </div>
            </section>
            <Toaster />
        </main>
    );
}

export default layout;
