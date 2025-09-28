"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ToastProps {
    message: string;
    type: 'error' | 'success' | 'warning' | 'info';
    duration?: number;
    onClose: () => void;
}

export function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Trigger animation after mount
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (duration > 0 && isVisible) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, isVisible]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
    };

    const getToastStyles = () => {
        const baseStyles = "fixed z-[9999] top-4 right-4 flex items-start gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-300 ease-in-out transform max-w-sm sm:max-w-md w-auto min-w-[280px] sm:min-w-[320px]";
        
        if (!isVisible) {
            return `${baseStyles} translate-x-full opacity-0 scale-95`;
        }

        const typeStyles = {
            error: "bg-red-50/95 border-red-200 text-red-800 dark:bg-red-900/95 dark:border-red-800 dark:text-red-200",
            success: "bg-green-50/95 border-green-200 text-green-800 dark:bg-green-900/95 dark:border-green-800 dark:text-green-200",
            warning: "bg-yellow-50/95 border-yellow-200 text-yellow-800 dark:bg-yellow-900/95 dark:border-yellow-800 dark:text-yellow-200",
            info: "bg-blue-50/95 border-blue-200 text-blue-800 dark:bg-blue-900/95 dark:border-blue-800 dark:text-blue-200"
        };

        return `${baseStyles} translate-x-0 opacity-100 scale-100 ${typeStyles[type]}`;
    };

    const getIcon = () => {
        const iconStyles = "w-5 h-5 flex-shrink-0 mt-0.5";
    
        switch (type) {
            case 'error':
                return (
                    <svg className={`${iconStyles} text-red-500 dark:text-red-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            case 'success':
                return (
                    <svg className={`${iconStyles} text-green-500 dark:text-green-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className={`${iconStyles} text-yellow-500 dark:text-yellow-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                );
            case 'info':
                return (
                    <svg className={`${iconStyles} text-blue-500 dark:text-blue-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    if (!mounted) return null;

    return createPortal(
        <div className={getToastStyles()}>
            {getIcon()}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium break-words pr-2">{message}</p>
            </div>
            <button
                onClick={handleClose}
                className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                aria-label="Close notification"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>,
        document.body
    );
}

interface ToastContainerProps {
    children: React.ReactNode;
}

export function ToastContainer({ children }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm sm:max-w-md w-full pointer-events-none">
            <div className="pointer-events-auto">
                {children}
            </div>
        </div>
    );
}