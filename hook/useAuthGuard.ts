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
            console.log('🚰 Hydrating store...');
            hydrate();
            return; // Exit early, hydration will trigger another effect
        }
        
        // Validate authentication state after hydration
        validateAndSyncAuth();
        
        // Check if user is authenticated
        const isAuth = isAuthenticated();
        
        console.log('🛡️ Auth Guard Check:', {
            isAuthenticated: isAuth,
            hasUserInStore: !!taiKhoan,
            isHydrated,
            redirectTo
        });
        
        if (!isAuth) {
            console.log('⚠️ User not authenticated, clearing store and redirecting...');
            clearTaiKhoan();
            router.push(redirectTo);
        }
    }, [taiKhoan, isHydrated, clearTaiKhoan, validateAndSyncAuth, hydrate, router, redirectTo]);

    return {
        isAuthenticated: isAuthenticated() && !!taiKhoan,
        user: taiKhoan
    };
};