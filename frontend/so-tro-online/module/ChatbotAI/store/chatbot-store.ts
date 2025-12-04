"use client"

import { create } from 'zustand';
import { ChatMessage, ChatSession, ChatbotState } from '../types/Chat';
import { generateMessageId } from '../api/api-chatbot';

interface ChatbotStore extends ChatbotState {
    // Actions
    toggleChat: () => void;
    setLoading: (loading: boolean) => void;
    setTyping: (typing: boolean) => void;
    setError: (error: string | null) => void;
    
    // Message actions
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
    updateMessage: (messageId: string, content: string, isTyping?: boolean) => void;
    clearMessages: () => void;
    
    // Session actions
    createNewSession: (title?: string) => string;
    switchSession: (sessionId: string) => void;
    deleteSession: (sessionId: string) => void;
    updateSessionTitle: (sessionId: string, title: string) => void;
    
    // Utilities
    getCurrentSession: () => ChatSession | null;
    getSessionMessages: (sessionId: string) => ChatMessage[];
}

export const useChatbotStore = create<ChatbotStore>((set, get) => ({
    // Initial state
    isOpen: false,
    isLoading: false,
    isTyping: false,
    currentSession: null,
    sessions: [],
    error: null,

    // Actions
    toggleChat: () => set((state) => ({ 
        isOpen: !state.isOpen 
    })),

    setLoading: (loading: boolean) => set({ 
        isLoading: loading 
    }),

    setTyping: (typing: boolean) => set({ 
        isTyping: typing 
    }),

    setError: (error: string | null) => set({ 
        error 
    }),

    // Message actions
    addMessage: (messageData) => {
        const message: ChatMessage = {
            ...messageData,
            id: generateMessageId(),
            timestamp: new Date()
        };

        set((state) => {
            if (!state.currentSession) {
                // Create a new session if none exists
                const newSessionId = generateMessageId();
                const newSession: ChatSession = {
                    id: newSessionId,
                    title: message.content.slice(0, 50) + (message.content.length > 50 ? '...' : ''),
                    messages: [message],
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                return {
                    sessions: [...state.sessions, newSession],
                    currentSession: newSession
                };
            } else {
                // Add to existing session
                const updatedSession = {
                    ...state.currentSession,
                    messages: [...state.currentSession.messages, message],
                    updatedAt: new Date()
                };

                return {
                    sessions: state.sessions.map(session => 
                        session.id === state.currentSession?.id ? updatedSession : session
                    ),
                    currentSession: updatedSession
                };
            }
        });
    },

    updateMessage: (messageId: string, content: string, isTyping?: boolean) => {
        set((state) => {
            if (!state.currentSession) return state;

            const updatedMessages = state.currentSession.messages.map(msg => 
                msg.id === messageId 
                    ? { ...msg, content, isTyping: isTyping ?? msg.isTyping }
                    : msg
            );

            const updatedSession = {
                ...state.currentSession,
                messages: updatedMessages,
                updatedAt: new Date()
            };

            return {
                sessions: state.sessions.map(session => 
                    session.id === state.currentSession?.id ? updatedSession : session
                ),
                currentSession: updatedSession
            };
        });
    },

    clearMessages: () => {
        set((state) => {
            if (!state.currentSession) return state;

            const updatedSession = {
                ...state.currentSession,
                messages: [],
                updatedAt: new Date()
            };

            return {
                sessions: state.sessions.map(session => 
                    session.id === state.currentSession?.id ? updatedSession : session
                ),
                currentSession: updatedSession
            };
        });
    },

    // Session actions
    createNewSession: (title?: string) => {
        const sessionId = generateMessageId();
        const newSession: ChatSession = {
            id: sessionId,
            title: title || 'New Conversation',
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        set((state) => ({
            sessions: [...state.sessions, newSession],
            currentSession: newSession
        }));

        return sessionId;
    },

    switchSession: (sessionId: string) => {
        set((state) => {
            const session = state.sessions.find(s => s.id === sessionId);
            return session ? { currentSession: session } : state;
        });
    },

    deleteSession: (sessionId: string) => {
        set((state) => {
            const updatedSessions = state.sessions.filter(s => s.id !== sessionId);
            const newCurrentSession = state.currentSession?.id === sessionId
                ? updatedSessions[0] || null
                : state.currentSession;

            return {
                sessions: updatedSessions,
                currentSession: newCurrentSession
            };
        });
    },

    updateSessionTitle: (sessionId: string, title: string) => {
        set((state) => {
            const updatedSessions = state.sessions.map(session => 
                session.id === sessionId 
                    ? { ...session, title, updatedAt: new Date() }
                    : session
            );

            const updatedCurrentSession = state.currentSession?.id === sessionId
                ? { ...state.currentSession, title, updatedAt: new Date() }
                : state.currentSession;

            return {
                sessions: updatedSessions,
                currentSession: updatedCurrentSession
            };
        });
    },

    // Utilities
    getCurrentSession: () => get().currentSession,

    getSessionMessages: (sessionId: string) => {
        const session = get().sessions.find(s => s.id === sessionId);
        return session?.messages || [];
    }
}));