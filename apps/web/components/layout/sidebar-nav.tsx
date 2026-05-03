'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@repo/ui/utils';
import { LayoutDashboard } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type NavItem = {
    label: string;
    href: string;
    icon: LucideIcon;
};

// ── Add sidebar items here ────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    // more items coming — you'll tell me what to add
];
// ─────────────────────────────────────────────────────────────────────────────

export function SidebarNav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-1 px-3 py-2">
            {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                            isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                    >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
