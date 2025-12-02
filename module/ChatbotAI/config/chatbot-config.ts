import { ChatbotLanguage } from '../constants/language-constants';

export interface ChatbotConfig {
    // API Configuration
    apiBaseUrl: string;
    streamingEnabled: boolean;
    maxRetries: number;
    retryDelay: number;
    
    // UI Configuration
    defaultLanguage: ChatbotLanguage;
    maxMessages: number;
    typingDelay: number;
    autoScroll: boolean;
    
    // Features
    persistSessions: boolean;
    sessionStorageKey: string;
    maxSessions: number;
    
    // Appearance
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    theme: 'light' | 'dark' | 'auto';
    borderRadius: 'sm' | 'md' | 'lg' | 'xl';
    
    // Behavior
    autoOpen: boolean;
    showGreeting: boolean;
    enableQuickActions: boolean;
}

export const defaultChatbotConfig: ChatbotConfig = {
    // API Configuration
    apiBaseUrl: '/api',
    streamingEnabled: true,
    maxRetries: 3,
    retryDelay: 1000,
    
    // UI Configuration
    defaultLanguage: 'vi',
    maxMessages: 100,
    typingDelay: 50,
    autoScroll: true,
    
    // Features
    persistSessions: true,
    sessionStorageKey: 'chatbot_sessions',
    maxSessions: 10,
    
    // Appearance
    position: 'bottom-right',
    theme: 'auto',
    borderRadius: 'lg',
    
    // Behavior
    autoOpen: false,
    showGreeting: true,
    enableQuickActions: true
};

// Environment-specific overrides
export const getChatbotConfig = (): ChatbotConfig => {
    const config = { ...defaultChatbotConfig };
    
    // Development overrides
    if (process.env.NODE_ENV === 'development') {
        config.apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    }
    
    // Production overrides
    if (process.env.NODE_ENV === 'production') {
        config.streamingEnabled = true;
        config.maxRetries = 5;
    }
    
    return config;
};