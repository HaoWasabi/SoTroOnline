// API service for chatbot AI functionality
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Check if user is authenticated (similar to useAuthGuard logic)
const isUserAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('accessToken') || 
                 sessionStorage.getItem('accessToken') ||
                 localStorage.getItem('token') ||
                 sessionStorage.getItem('token');
    
    return !!token;
};

// Get auth token from storage - using same method as useAuthGuard
const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        // Check localStorage first, then sessionStorage
        const token = localStorage.getItem('accessToken') || 
                     sessionStorage.getItem('accessToken') ||
                     localStorage.getItem('token') ||
                     sessionStorage.getItem('token');
        return token;
    }
    return null;
};

// Create headers with authentication - enhanced validation
const getAuthHeaders = (isStreaming: boolean = false): HeadersInit => {
    const token = getAuthToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    
    // For streaming requests, set appropriate Accept header
    if (isStreaming) {
        headers['Accept'] = 'text/event-stream';
        headers['Cache-Control'] = 'no-cache';
        headers['Connection'] = 'keep-alive';
    } else {
        headers['Accept'] = 'application/json';
    }
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('🔐 Adding JWT token to chatbot request:', token.substring(0, 20) + '...');
    } else {
        console.warn('⚠️ No JWT token found for chatbot request');
        console.log('🔍 Checking storage:', {
            localStorage_accessToken: !!localStorage.getItem('accessToken'),
            sessionStorage_accessToken: !!sessionStorage.getItem('accessToken'),
            localStorage_token: !!localStorage.getItem('token'),
            sessionStorage_token: !!sessionStorage.getItem('token')
        });
    }
    
    return headers;
};

// Interfaces for chatbot API
export interface ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    isTyping?: boolean;
}

export interface ChatbotResponse {
    success: boolean;
    message: string;
    data?: {
        response: string;
        conversationId?: string;
    };
    error?: string;
}

export interface StreamedChatResponse {
    chunk: string;
    isComplete: boolean;
    error?: string;
}

// Send message to chatbot and get streaming response
// Send message to chatbot with streaming response
export const sendMessageToChatbot = async (
    message: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
): Promise<void> => {
    try {
        // Check authentication first
        if (!isUserAuthenticated()) {
            onError('Please log in to use the chatbot');
            return;
        }

        console.log('🤖 Sending message to chatbot:', message);
        
        const headers = getAuthHeaders(true); // true for streaming request
        console.log('📋 Request headers:', headers);
        
        // Create AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch(`${API_BASE_URL}/api/chatbot/chat?message=${encodeURIComponent(message)}`, {
            method: 'GET',
            headers: headers,
            signal: controller.signal,
            mode: 'cors',
            credentials: 'include'
        });
        
        clearTimeout(timeoutId);
        console.log('📡 Response status:', response.status, 'Content-Type:', response.headers.get('Content-Type'));

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `HTTP error! status: ${response.status}`;
            
            // Handle specific authentication errors
            if (response.status === 401) {
                errorMessage = 'Authentication failed. Please log in again.';
                // Clear invalid tokens
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('accessToken');
                    sessionStorage.removeItem('token');
                }
            }
            
            throw new Error(`${errorMessage}, response: ${errorText}`);
        }

        // Handle Server-Sent Events streaming response
        if (!response.body) {
            throw new Error('No response body received');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) {
                    onComplete();
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;
                
                console.log('📥 Received chunk:', chunk.replace(/\n/g, '[LF]'));

                // Process complete SSE messages (ending with \n\n)
                let messages;
                if (buffer.includes('\n\n')) {
                    messages = buffer.split('\n\n');
                    buffer = messages.pop() || ''; // Keep the last incomplete message in buffer
                } else {
                    // No complete messages yet
                    continue;
                }

                for (const message of messages) {
                    let trimmedMessage = message.trim();
                    
                    console.log('🔍 Processing message:', trimmedMessage);
                    
                    // Check if this is a DONE signal
                    if (trimmedMessage === '[DONE]' || trimmedMessage.includes('[DONE]')) {
                        console.log('✅ Received DONE signal');
                        onComplete();
                        return;
                    }
                    
                    // Handle direct JSON format (without "data:" prefix)
                    if (trimmedMessage.startsWith('{"response":')) {
                        console.log('📦 Direct JSON format detected:', trimmedMessage);
                        // Clean newlines for direct JSON parsing
                        let cleanedJSON = trimmedMessage.replace(/\\n/g, '').replace(/\n/g, '').trim();
                        try {
                            const parsedData = JSON.parse(cleanedJSON);
                            if (parsedData.response) {
                                console.log('📝 Emitting chunk:', parsedData.response);
                                onChunk(parsedData.response);
                            }
                        } catch (parseError) {
                            console.log('⚠️ Failed to parse direct JSON:', cleanedJSON, parseError);
                        }
                        continue;
                    }
                    
                    // Handle messages with doubled data: prefix
                    if (trimmedMessage.startsWith('data:data:')) {
                        // Remove doubled prefix and clean up thoroughly
                        let cleanedContent = trimmedMessage.substring(10); // Remove 'data:data:'
                        // Remove all newline characters and extra whitespace
                        cleanedContent = cleanedContent.replace(/\\n/g, '').replace(/\n/g, '').trim();
                        console.log('⚡ Fixed doubled prefix, cleaned content:', cleanedContent);
                        
                        // Check for DONE signal
                        if (cleanedContent === '[DONE]' || cleanedContent.includes('[DONE]')) {
                            console.log('✅ Received DONE signal from doubled prefix');
                            onComplete();
                            return;
                        }
                        
                        // Try to parse as JSON
                        if (cleanedContent.startsWith('{"response":')) {
                            try {
                                const parsedData = JSON.parse(cleanedContent);
                                if (parsedData.response) {
                                    console.log('📝 Emitting chunk from doubled prefix:', parsedData.response);
                                    onChunk(parsedData.response);
                                }
                            } catch (parseError) {
                                console.log('⚠️ Failed to parse JSON from doubled prefix:', cleanedContent, parseError);
                            }
                        }
                        continue;
                    }
                    
                    // Handle traditional SSE format with data: prefix
                    const lines = message.split('\n');
                    for (const line of lines) {
                        let trimmedLine = line.trim();
                        
                        if (!trimmedLine) continue; // Skip empty lines
                        
                        console.log('🔍 Processing line:', trimmedLine);
                        
                        // Handle normal single prefix case
                        if (trimmedLine.startsWith('data: ')) {
                            let dataContent = trimmedLine.substring(6); // Remove 'data: ' prefix
                            // Clean newlines for normal prefix parsing
                            dataContent = dataContent.replace(/\\n/g, '').replace(/\n/g, '').trim();
                            console.log('✨ Normal prefix, cleaned content:', dataContent);
                            
                            if (dataContent === '[DONE]' || dataContent.includes('[DONE]')) {
                                console.log('✅ Received DONE signal from normal prefix');
                                onComplete();
                                return;
                            }
                            
                            if (dataContent.startsWith('{"response":')) {
                                try {
                                    const parsedData = JSON.parse(dataContent);
                                    if (parsedData.response) {
                                        console.log('📝 Emitting chunk from normal prefix:', parsedData.response);
                                        onChunk(parsedData.response);
                                    }
                                } catch (parseError) {
                                    console.log('⚠️ Failed to parse JSON from normal prefix:', dataContent, parseError);
                                }
                            }
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    } catch (error) {
        console.error('❌ Error in chatbot communication:', error);
        
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                onError('Request timeout. Please try again.');
            } else if (error.message.includes('Failed to fetch')) {
                onError('Network connection error. Please check your internet connection and ensure the server is running.');
            } else {
                onError(error.message);
            }
        } else {
            onError('Unknown error occurred');
        }
    }
};

// Non-streaming fallback method
export const sendMessageToChatbotSync = async (message: string): Promise<ChatbotResponse> => {
    try {
        // Check authentication first
        if (!isUserAuthenticated()) {
            return {
                success: false,
                message: 'Authentication required',
                error: 'Please log in to use the chatbot'
            };
        }

        console.log('🤖 Sending message to chatbot (sync):', message);
        
        const headers = getAuthHeaders(false); // false for non-streaming request
        
        // Create AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const response = await fetch(`${API_BASE_URL}/api/chatbot/chat-fallback`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ message }),
            signal: controller.signal,
            mode: 'cors',
            credentials: 'include'
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `HTTP error! status: ${response.status}`;
            
            // Handle specific authentication errors
            if (response.status === 401) {
                errorMessage = 'Authentication failed. Please log in again.';
                // Clear invalid tokens
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('accessToken');
                    sessionStorage.removeItem('token');
                }
            }
            
            return {
                success: false,
                message: errorMessage,
                error: errorText
            };
        }

        // Parse JSON response from the new endpoint
        const jsonResponse = await response.json();
        
        if (jsonResponse.success) {
            return {
                success: true,
                message: 'Message sent successfully',
                data: {
                    response: jsonResponse.data.response
                }
            };
        } else {
            return {
                success: false,
                message: jsonResponse.message || 'Failed to get response',
                error: jsonResponse.error || 'Unknown error'
            };
        }
    } catch (error) {
        console.error('❌ Error in chatbot communication:', error);
        
        let errorMessage = 'Failed to communicate with chatbot';
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                errorMessage = 'Request timeout. Please try again.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Network connection error. Please check your internet connection and ensure the server is running.';
            } else {
                errorMessage = error.message;
            }
        }
        
        return {
            success: false,
            message: errorMessage,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
};

// Generate a unique message ID
export const generateMessageId = (): string => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Export authentication check for other components
export const checkAuthentication = isUserAuthenticated;