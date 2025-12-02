"use client"

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguageStore } from "@/zustand/language-tranlator";
import { useToast } from "@/hook/useToast";
import { Toast } from "@/components/toast";
import { 
    MessageCircle, 
    Send, 
    X, 
    Minimize2, 
    Maximize2, 
    Bot, 
    User, 
    Loader2,
    Trash2,
    Plus
} from "lucide-react";
import { ChatMessage, ChatSession } from "../types/Chat";
import { sendMessageToChatbot, generateMessageId } from "../api/api-chatbot";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";

interface ChatbotComponentProps {
    isOpen: boolean;
    onToggle: () => void;
    className?: string;
}

export default function ChatbotComponent({ isOpen, onToggle, className = "" }: ChatbotComponentProps) {
    const { language } = useLanguageStore();
    const { toast, showSuccess, showError, removeToast } = useToast();
    
    // Chat state
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    
    // Session management
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    
    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen, isMinimized]);

    // Initialize chat with welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMessage: ChatMessage = {
                id: generateMessageId(),
                content: language === 'vi' 
                    ? 'Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp bạn với các câu hỏi về quản lý trọ và nhiều chủ đề khác. Bạn muốn hỏi gì?'
                    : 'Hello! I\'m your AI assistant. I can help you with questions about property management and many other topics. What would you like to ask?',
                role: 'assistant',
                timestamp: new Date()
            };
            setMessages([welcomeMessage]);
        }
    }, [isOpen, language, messages.length]);

    // Handle sending message
    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: generateMessageId(),
            content: inputMessage.trim(),
            role: 'user',
            timestamp: new Date()
        };

        // Add user message
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);
        setIsTyping(true);

        // Create assistant placeholder message
        const assistantMessageId = generateMessageId();
        const assistantMessage: ChatMessage = {
            id: assistantMessageId,
            content: '',
            role: 'assistant',
            timestamp: new Date(),
            isTyping: true
        };

        setMessages(prev => [...prev, assistantMessage]);

        let fullResponse = '';

        try {
            await sendMessageToChatbot(
                userMessage.content,
                // On chunk received
                (chunk: string) => {
                    fullResponse += chunk;
                    setMessages(prev => prev.map(msg => 
                        msg.id === assistantMessageId 
                            ? { ...msg, content: fullResponse, isTyping: true }
                            : msg
                    ));
                },
                // On complete
                () => {
                    setMessages(prev => prev.map(msg => 
                        msg.id === assistantMessageId 
                            ? { ...msg, content: fullResponse, isTyping: false }
                            : msg
                    ));
                    setIsTyping(false);
                    setIsLoading(false);
                },
                // On error
                (error: string) => {
                    setMessages(prev => prev.map(msg => 
                        msg.id === assistantMessageId 
                            ? { 
                                ...msg, 
                                content: language === 'vi' 
                                    ? `Xin lỗi, đã xảy ra lỗi: ${error}` 
                                    : `Sorry, an error occurred: ${error}`,
                                isTyping: false 
                            }
                            : msg
                    ));
                    setIsTyping(false);
                    setIsLoading(false);
                    showError(language === 'vi' ? 'Không thể gửi tin nhắn' : 'Failed to send message');
                }
            );
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
            setIsTyping(false);
            setIsLoading(false);
            showError(language === 'vi' ? 'Không thể gửi tin nhắn' : 'Failed to send message');
        }
    };

    // Handle key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Clear conversation
    const handleClearConversation = () => {
        setMessages([]);
        // Re-add welcome message
        const welcomeMessage: ChatMessage = {
            id: generateMessageId(),
            content: language === 'vi' 
                ? 'Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp bạn với các câu hỏi về quản lý trọ và nhiều chủ đề khác. Bạn muốn hỏi gì?'
                : 'Hello! I\'m your AI assistant. I can help you with questions about property management and many other topics. What would you like to ask?',
            role: 'assistant',
            timestamp: new Date()
        };
        setTimeout(() => setMessages([welcomeMessage]), 100);
        showSuccess(language === 'vi' ? 'Đã xóa cuộc trò chuyện' : 'Conversation cleared');
    };

    // Format timestamp
    const formatTimestamp = (timestamp: Date) => {
        return format(timestamp, 'HH:mm', {
            locale: language === 'vi' ? vi : enUS
        });
    };

    if (!isOpen) return null;

    return (
        <>
            <Card className={`fixed bottom-6 right-6 w-96 h-[600px] z-50 shadow-2xl border-0 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30 backdrop-blur-sm ${className}`}>
                {/* Header */}
                <CardHeader className="pb-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                                <Bot className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-lg font-bold text-gray-900">
                                    {language === 'vi' ? 'Trợ lý AI' : 'AI Assistant'}
                                </CardTitle>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    {language === 'vi' ? 'Trực tuyến' : 'Online'}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleClearConversation}
                                className="p-1 h-8 w-8 hover:bg-red-50 hover:text-red-600"
                                title={language === 'vi' ? 'Xóa cuộc trò chuyện' : 'Clear conversation'}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-1 h-8 w-8 hover:bg-gray-100"
                            >
                                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onToggle}
                                className="p-1 h-8 w-8 hover:bg-gray-100"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {!isMinimized && (
                    <>
                        {/* Messages Area */}
                        <CardContent className="flex-1 overflow-hidden p-0">
                            <div className="h-[450px] overflow-y-auto p-4 space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex items-start gap-3 ${
                                            message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                        }`}
                                    >
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                            message.role === 'user' 
                                                ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                                                : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                        }`}>
                                            {message.role === 'user' ? (
                                                <User className="h-4 w-4 text-white" />
                                            ) : (
                                                <Bot className="h-4 w-4 text-white" />
                                            )}
                                        </div>
                                        <div className={`flex-1 max-w-[280px] ${
                                            message.role === 'user' ? 'text-right' : 'text-left'
                                        }`}>
                                            <div className={`inline-block p-3 rounded-2xl ${
                                                message.role === 'user'
                                                    ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white'
                                                    : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                                            }`}>
                                                <div className="text-sm whitespace-pre-wrap break-words">
                                                    {message.content}
                                                    {message.isTyping && (
                                                        <span className="inline-flex items-center ml-1">
                                                            <Loader2 className="h-3 w-3 animate-spin" />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`text-xs text-gray-500 mt-1 ${
                                                message.role === 'user' ? 'text-right' : 'text-left'
                                            }`}>
                                                {formatTimestamp(message.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </CardContent>

                        {/* Input Area */}
                        <div className="p-4 border-t border-gray-100 bg-white/50 rounded-b-2xl">
                            <div className="flex gap-2">
                                <Input
                                    ref={inputRef}
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={language === 'vi' ? 'Nhập tin nhắn...' : 'Type a message...'}
                                    disabled={isLoading}
                                    className="flex-1 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={isLoading || !inputMessage.trim()}
                                    className="rounded-xl px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            {isTyping && (
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    {language === 'vi' ? 'AI đang trả lời...' : 'AI is typing...'}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </Card>

            {toast && toast.message && <Toast {...toast} onClose={removeToast} />}
        </>
    );
}