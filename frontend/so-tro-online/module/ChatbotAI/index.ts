// Export all chatbot components and utilities
export { default as ChatbotComponent } from './components/chatbot-component';
export { default as ChatbotFloatingButton } from './components/chatbot-floating-button';

// Export API services  
export * from './api/api-chatbot';

// Export types
export * from './types/Chat';

// Export store
export { useChatbotStore } from './store/chatbot-store';

// Export hooks
export { useChatbot } from './hooks/useChatbot';

// Export constants
export { ChatbotLanguageConstants } from './constants/language-constants';
export type { ChatbotLanguage } from './constants/language-constants';

// Export configuration
export { getChatbotConfig } from './config/chatbot-config';
export type { ChatbotConfig } from './config/chatbot-config';

// Default export
export { default } from './components/chatbot-floating-button';