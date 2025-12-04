"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Lock } from "lucide-react";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { useTaiKhoanStore } from "@/zustand/taikhoan-store";
import ChatbotComponent from './chatbot-component';

interface ChatbotFloatingButtonProps {
    className?: string;
}

export default function ChatbotFloatingButton({ className = "" }: ChatbotFloatingButtonProps) {
    const { language } = useLanguageStore();
    const { taiKhoan, isHydrated } = useTaiKhoanStore();
    const [isChatOpen, setIsChatOpen] = useState(false);

    const isAuthenticated = isHydrated && !!taiKhoan;

    const toggleChat = () => {
        if (!isAuthenticated) {
            // Could show a login prompt or redirect
            alert(language === 'vi' ? 'Vui lòng đăng nhập để sử dụng chatbot' : 'Please log in to use the chatbot');
            return;
        }
        setIsChatOpen(!isChatOpen);
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isChatOpen && (
                <Button
                    onClick={toggleChat}
                    className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl ${
                        isAuthenticated 
                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700' 
                            : 'bg-gradient-to-br from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
                    } text-white border-0 z-40 transition-all duration-300 hover:scale-110 ${className}`}
                    title={
                        isAuthenticated 
                            ? (language === 'vi' ? 'Mở trợ lý AI' : 'Open AI Assistant')
                            : (language === 'vi' ? 'Đăng nhập để sử dụng chatbot' : 'Login to use chatbot')
                    }
                >
                    {isAuthenticated ? (
                        <MessageCircle className="h-6 w-6" />
                    ) : (
                        <Lock className="h-6 w-6" />
                    )}
                </Button>
            )}

            {/* Chat Component */}
            <ChatbotComponent
                isOpen={isChatOpen}
                onToggle={toggleChat}
            />
        </>
    );
}