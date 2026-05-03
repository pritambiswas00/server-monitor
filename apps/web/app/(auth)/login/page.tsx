'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Link from 'next/link';

import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@repo/ui/card';
import { useAuthStore } from '@/lib/stores/auth.store';
import { loginUserAction } from './actions';

const schema = z.object({
    email: z.string().email('Enter a valid email'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
    const router = useRouter();
    const setUser = useAuthStore((s) => s.setUser);
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const onSubmit = (values: FormValues) => {
        startTransition(async () => {
            const result = await loginUserAction(values);
            if (result.success) {
                setUser(result.user);
                router.push('/dashboard');
            } else {
                setError(result.status === 404 ? 'email' : 'root', {
                    message: result.error,
                });
            }
        });
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
                <CardDescription>Enter your email to access your account</CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    {errors.root && (
                        <p className="text-sm text-destructive rounded-md bg-destructive/10 px-3 py-2">
                            {errors.root.message}
                        </p>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            autoComplete="email"
                            autoFocus
                            {...register('email')}
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive">{errors.email.message}</p>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? 'Signing in…' : 'Sign in'}
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-primary underline underline-offset-4 hover:text-primary/80">
                            Create one
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
