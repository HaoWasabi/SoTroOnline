export interface ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    isTyping?: boolean;
}

export interface ChatSession {
    id: string;
    messages: ChatMessage[];
    title: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatbotState {
    isOpen: boolean;
    isLoading: boolean;
    isTyping: boolean;
    currentSession: ChatSession | null;
    sessions: ChatSession[];
    error: string | null;
}