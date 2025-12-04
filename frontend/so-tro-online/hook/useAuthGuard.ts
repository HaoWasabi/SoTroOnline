"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTaiKhoanStore } from '@/zustand/taikhoan-store';
import { isAuthenticated } from '@/module/QuanLyTaiKhoan/api/api-quan-ly-tai-khoan';

export const useAuthGuard = (redirectTo: string = '/login-page') => {
    const router = useRouter();
    const { taiKhoan, isHydrated, clearTaiKhoan, validateAndSyncAuth, hydrate } = useTaiKhoanStore();

    useEffect(() => {
        // First, ensure store is hydrated
        if (!isHydrated) {
            hydrate();
            return; // Exit early, hydration will trigger another effect
        }
        
        // Validate authentication state after hydration
        validateAndSyncAuth();
        
        // Check if user is authenticated with a slight delay to ensure storage is ready
        setTimeout(() => {
            const isAuth = isAuthenticated();
            const hasUser = !!taiKhoan;
            
            console.log('Auth check:', { isAuth, hasUser, taiKhoan });
            
            if (!isAuth || !hasUser) {
                console.log('Authentication failed, redirecting to login');
                clearTaiKhoan();
                router.push(redirectTo);
            }
        }, 100);
    }, [isHydrated, taiKhoan]); // Simplified dependencies

    // Don't return authenticated state until store is hydrated
    const currentlyAuthenticated = isHydrated ? (isAuthenticated() && !!taiKhoan) : false;

    return {
        isAuthenticated: currentlyAuthenticated,
        user: taiKhoan,
        isLoading: !isHydrated // Add loading state for UI
    };
};