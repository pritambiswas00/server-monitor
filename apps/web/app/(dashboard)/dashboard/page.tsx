'use client';

import { useEffect, useState, useTransition } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import { getDashboardDataAction, type DashboardData } from './actions';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Server, Radio, BrainCircuit, Loader2, AlertCircle } from 'lucide-react';
import type { RemoteServerDto } from '@/lib/clients/remote-server.client';
import type { LogSourceDto } from '@/lib/clients/log-source.client';
import type { LogAnalysisJobDto } from '@/lib/clients/log-analysis-job.client';

// ── status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const variants: Record<string, string> = {
        ONLINE:      'bg-green-100 text-green-700',
        OFFLINE:     'bg-red-100 text-red-700',
        UNKNOWN:     'bg-gray-100 text-gray-600',
        RUNNING:     'bg-blue-100 text-blue-700',
        PENDING:     'bg-yellow-100 text-yellow-700',
        INITIALIZED: 'bg-purple-100 text-purple-700',
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variants[status] ?? 'bg-gray-100 text-gray-600'}`}>
            {status}
        </span>
    );
}

// ── summary stat card ─────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{value}</p>
            </CardContent>
        </Card>
    );
}

// ── remote servers table ──────────────────────────────────────────────────────

function RemoteServersSection({ servers }: { servers: RemoteServerDto[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Server className="h-4 w-4" /> Remote Servers
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {servers.length === 0 ? (
                    <p className="px-6 py-4 text-sm text-muted-foreground">No remote servers registered yet.</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/40">
                                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Name</th>
                                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Status</th>
                                <th className="px-6 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Added</th>
                            </tr>
                        </thead>
                        <tbody>
                            {servers.map((s) => (
                                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-3 font-medium">{s.name}</td>
                                    <td className="px-6 py-3"><StatusBadge status={s.status} /></td>
                                    <td className="px-6 py-3 text-muted-foreground hidden md:table-cell">
                                        {new Date(s.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </CardContent>
        </Card>
    );
}

// ── log sources table ─────────────────────────────────────────────────────────

function LogSourcesSection({ sources }: { sources: LogSourceDto[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <Radio className="h-4 w-4" /> Log Sources
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {sources.length === 0 ? (
                    <p className="px-6 py-4 text-sm text-muted-foreground">No log sources configured yet.</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/40">
                                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Name</th>
                                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Type</th>
                                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Status</th>
                                <th className="px-6 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Added</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sources.map((s) => (
                                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-3 font-medium">{s.name}</td>
                                    <td className="px-6 py-3">
                                        <span className="text-xs text-muted-foreground font-mono">{s.type}</span>
                                    </td>
                                    <td className="px-6 py-3"><StatusBadge status={s.status} /></td>
                                    <td className="px-6 py-3 text-muted-foreground hidden md:table-cell">
                                        {new Date(s.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </CardContent>
        </Card>
    );
}

// ── active jobs table ─────────────────────────────────────────────────────────

function ActiveJobsSection({ jobs }: { jobs: LogAnalysisJobDto[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <BrainCircuit className="h-4 w-4" /> Active Analysis Jobs
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {jobs.length === 0 ? (
                    <p className="px-6 py-4 text-sm text-muted-foreground">No active analysis jobs.</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/40">
                                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Name</th>
                                <th className="px-6 py-3 text-left font-medium text-muted-foreground">Status</th>
                                <th className="px-6 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Started</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((j) => (
                                <tr key={j.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-3 font-medium">{j.name}</td>
                                    <td className="px-6 py-3"><StatusBadge status={j.status} /></td>
                                    <td className="px-6 py-3 text-muted-foreground hidden md:table-cell">
                                        {new Date(j.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </CardContent>
        </Card>
    );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const user = useAuthStore((s) => s.user);
    const [data, setData] = useState<DashboardData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(async () => {
            const result = await getDashboardDataAction();
            if (result.success) {
                setData(result.data);
            } else {
                setError(result.error);
            }
        });
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Welcome back{user?.name ? `, ${user.name}` : ''}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Here&apos;s an overview of your monitored servers.
                </p>
            </div>

            {isPending && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading dashboard data…
                </div>
            )}

            {error && !isPending && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            )}

            {data && (
                <>
                    <div className="grid gap-4 md:grid-cols-3">
                        <StatCard label="Remote Servers" value={data.remoteServers.length} icon={Server} />
                        <StatCard label="Log Sources"    value={data.logSources.length}    icon={Radio} />
                        <StatCard label="Active Jobs"    value={data.activeJobs.length}    icon={BrainCircuit} />
                    </div>

                    <RemoteServersSection servers={data.remoteServers} />
                    <LogSourcesSection    sources={data.logSources} />
                    <ActiveJobsSection    jobs={data.activeJobs} />
                </>
            )}
        </div>
    );
}
