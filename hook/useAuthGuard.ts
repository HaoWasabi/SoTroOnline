"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTaiKhoanStore } from '@/zustand/taikhoan-store';
import { isAuthenticated } from '@/module/QuanLyTaiKhoan/api/api-quan-ly-tai-khoan';

export const useAuthGuard = (redirectTo: string = '/login-page') => {
    const router = useRouter();
    const { taiKhoan, clearTaiKhoan, validateAndSyncAuth } = useTaiKhoanStore();

    useEffect(() => {
        // Validate authentication state
        validateAndSyncAuth();
        
        // Check if user is authenticated
        const isAuth = isAuthenticated();
        
        /*console.log('🛡️ Auth Guard Check:', {
            isAuthenticated: isAuth,
            hasUserInStore: !!taiKhoan,
            redirectTo
        });*/
        
        if (!isAuth) {
            //console.log('⚠️ User not authenticated, clearing store and redirecting...');
            clearTaiKhoan();
            router.push(redirectTo);
        }
    }, [taiKhoan, clearTaiKhoan, validateAndSyncAuth, router, redirectTo]);

    return {
        isAuthenticated: isAuthenticated() && !!taiKhoan,
        user: taiKhoan
    };
};