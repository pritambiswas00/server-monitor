'use client';

import { useAuthStore } from '@/lib/stores/auth.store';
import { useRouter } from 'next/navigation';
import { Button } from '@repo/ui/button';
import { LogOut, Monitor } from 'lucide-react';

export function TopNav() {
    const user = useAuthStore((s) => s.user);
    const clearUser = useAuthStore((s) => s.clearUser);
    const router = useRouter();

    const handleLogout = () => {
        clearUser();
        router.push('/login');
    };

    return (
        <header className="flex h-14 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                <span className="font-semibold text-sm">Server Monitor</span>
            </div>

            <div className="flex items-center gap-3">
                {user && (
                    <span className="text-sm text-muted-foreground hidden sm:block">
                        {user.name}
                    </span>
                )}
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out">
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        </header>
    );
}
