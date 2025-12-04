"use client";

import { useState, useCallback, useRef } from 'react';

interface ToastMessage {
    id: string;
    message: string;
    type: 'error' | 'success' | 'warning' | 'info';
    duration?: number;
}

export function useToast() {
    const [toast, setToast] = useState<ToastMessage | null>(null);
    const toastIdRef = useRef(0);

    const addToast = useCallback((message: string, type: 'error' | 'success' | 'warning' | 'info' = 'info', duration = 5000) => {
        // Clear any existing toast first
        setToast(null);
        
        // Add a small delay to ensure the previous toast is cleared
        setTimeout(() => {
            const newToast: ToastMessage = { 
                id: `toast-${++toastIdRef.current}`,
                message, 
                type, 
                duration 
            };
            
            setToast(newToast);
        }, 50);
    }, []);

    const removeToast = useCallback(() => {
        setToast(null);
    }, []);

    const showError = useCallback((message: string, duration = 5000) => {
        addToast(message, 'error', duration);
    }, [addToast]);

    const showSuccess = useCallback((message: string, duration = 5000) => {
        addToast(message, 'success', duration);
    }, [addToast]);

    const showWarning = useCallback((message: string, duration = 5000) => {
        addToast(message, 'warning', duration);
    }, [addToast]);

    const showInfo = useCallback((message: string, duration = 5000) => {
        addToast(message, 'info', duration);
    }, [addToast]);

    return {
        toast,
        showError,
        showSuccess,
        showWarning,
        showInfo,
        removeToast,
    };
}