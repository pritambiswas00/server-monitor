'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserDto } from '../clients/users.client';

type AuthState = {
    user: UserDto | null;
    setUser: (user: UserDto) => void;
    clearUser: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
        }),
        { name: 'auth-storage' }
    )
);
