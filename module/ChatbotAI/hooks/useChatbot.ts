import { useEffect, useCallback, useRef } from 'react';
import { useChatbotStore } from '../store/chatbot-store';
import { useLanguageStore } from '../../../zustand/language-tranlator';
import { useTaiKhoanStore } from '../../../zustand/taikhoan-store';
import { sendMessageToChatbot, sendMessageToChatbotSync, generateMessageId } from '../api/api-chatbot';
import { getChatbotConfig } from '../config/chatbot-config';
import { ChatbotLanguageConstants, ChatbotLanguage } from '../constants/language-constants';
import { useToast } from '../../../hook/useToast';

export const useChatbot = () => {
    const config = getChatbotConfig();
    const { showError, showSuccess } = useToast();
    const { language } = useLanguageStore();
    const { taiKhoan, isHydrated, validateAndSyncAuth } = useTaiKhoanStore();
    const abortControllerRef = useRef<AbortController | null>(null);
    
    const {
        isOpen,
        isLoading,
        isTyping,
        currentSession,
        sessions,
        error,
        toggleChat,
        setLoading,
        setTyping,
        setError,
        addMessage,
        updateMessage,
        clearMessages,
        createNewSession,
        switchSession,
        deleteSession,
        updateSessionTitle,
        getCurrentSession,
        getSessionMessages
    } = useChatbotStore();

    // Get translated text
    const getTranslation = useCallback((key: keyof typeof ChatbotLanguageConstants.vi) => {
        const currentLanguage: ChatbotLanguage = language === 'vi' ? 'vi' : 'en';
        return ChatbotLanguageConstants[currentLanguage][key];
    }, [language]);

    // Initialize chatbot
    useEffect(() => {
        if (config.showGreeting && sessions.length === 0) {
            const sessionId = createNewSession(getTranslation('newChat'));
            addMessage({
                role: 'assistant',
                content: getTranslation('defaultGreeting'),
                isTyping: false
            });
        }
    }, [config.showGreeting, sessions.length, createNewSession, addMessage, getTranslation]);

    // Send message function with authentication check
    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;

        // Check authentication before sending
        if (!isHydrated) {
            showError(getTranslation('error'));
            return;
        }

        if (!taiKhoan) {
            showError('Please log in to use the chatbot');
            return;
        }

        // Validate and sync auth state
        validateAndSyncAuth();

        // Cancel any ongoing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();

        // Ensure there's a current session
        let session = getCurrentSession();
        if (!session) {
            const sessionId = createNewSession();
            session = getCurrentSession();
        }

        // Add user message
        addMessage({
            role: 'user',
            content,
            isTyping: false
        });

        // Add temporary assistant message for streaming
        const assistantMessageId = generateMessageId();
        addMessage({
            role: 'assistant',
            content: '',
            isTyping: true
        });

        setLoading(true);
        setTyping(true);
        setError(null);

        try {
            let fullResponse = '';
            
            if (config.streamingEnabled) {
                await sendMessageToChatbot(
                    content,
                    (chunk: string) => {
                        fullResponse += chunk;
                        // Update the temporary message with streaming content
                        updateMessage(assistantMessageId, fullResponse, true);
                    },
                    () => {
                        // Finalize the assistant message on completion
                        updateMessage(assistantMessageId, fullResponse, false);
                    },
                    (error: string) => {
                        console.error('Streaming error:', error);
                        setError(error);
                        showError(error);
                    }
                );
            } else {
                // Fallback to non-streaming
                const response = await sendMessageToChatbotSync(content);
                fullResponse = response.data?.response || 'No response';
                
                // Finalize the assistant message for non-streaming
                updateMessage(assistantMessageId, fullResponse, false);
            }

        } catch (error: any) {
            console.error('Error sending message:', error);
            
            if (error.name === 'AbortError') {
                return; // Request was cancelled
            }
            
            let errorMessage = error.response?.data?.message || 
                              error.message || 
                              getTranslation('messageError');
            
            // Handle authentication errors specifically
            if (error.message?.includes('Authentication failed') || 
                error.message?.includes('401') || 
                error.message?.includes('Unauthorized')) {
                errorMessage = 'Authentication failed. Please log in again.';
                // Clear auth state and redirect might be handled by the auth system
            }
            
            setError(errorMessage);
            showError(errorMessage);
            
            // Update the temporary message with error state
            updateMessage(
                assistantMessageId, 
                getTranslation('connectionError'), 
                false
            );
        } finally {
            setLoading(false);
            setTyping(false);
            abortControllerRef.current = null;
        }
    }, [
        config.streamingEnabled,
        getCurrentSession,
        createNewSession,
        addMessage,
        updateMessage,
        setLoading,
        setTyping,
        setError,
        showError,
        getTranslation,
        isHydrated,
        taiKhoan,
        validateAndSyncAuth
    ]);

    // Cancel ongoing request
    const cancelRequest = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setLoading(false);
        setTyping(false);
    }, [setLoading, setTyping]);

    // Start new conversation
    const startNewConversation = useCallback(() => {
        const sessionId = createNewSession(getTranslation('newChat'));
        
        if (config.showGreeting) {
            addMessage({
                role: 'assistant',
                content: getTranslation('defaultGreeting'),
                isTyping: false
            });
        }
        
        return sessionId;
    }, [createNewSession, addMessage, config.showGreeting, getTranslation]);

    // Copy message to clipboard
    const copyMessage = useCallback(async (content: string) => {
        try {
            await navigator.clipboard.writeText(content);
            showSuccess(getTranslation('messageCopied'));
        } catch (error) {
            console.error('Failed to copy message:', error);
            showError(getTranslation('error'));
        }
    }, [showSuccess, showError, getTranslation]);

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        // State
        isOpen,
        isLoading,
        isTyping,
        currentSession,
        sessions,
        error,
        
        // Actions
        toggleChat,
        sendMessage,
        cancelRequest,
        clearMessages,
        startNewConversation,
        copyMessage,
        
        // Session management
        switchSession,
        deleteSession,
        updateSessionTitle,
        getCurrentSession,
        getSessionMessages,
        
        // Utils
        getTranslation,
        config
    };
};