import React from 'react';
import { TopNav } from '@/components/layout/top-nav';
import { SidebarNav } from '@/components/layout/sidebar-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col">
            <TopNav />

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="hidden md:flex w-56 shrink-0 flex-col border-r bg-background">
                    <div className="flex-1 overflow-y-auto py-2">
                        <SidebarNav />
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto bg-muted/40 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
