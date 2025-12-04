# Chatbot AI Module

A comprehensive AI chatbot integration for the Vietnamese property management application, featuring streaming responses, session management, and multilingual support.

## Features

- 🤖 **AI-Powered Conversations**: Integration with Spring AI and OpenAI
- 🌊 **Streaming Responses**: Real-time streaming for better UX
- 💬 **Session Management**: Multiple conversation sessions with persistence
- 🌍 **Multilingual Support**: Vietnamese and English language support
- 📱 **Responsive UI**: Modern floating button interface
- 🎨 **Customizable**: Configurable appearance and behavior
- 🔒 **Secure**: JWT authentication with proper error handling

## Directory Structure

```
ChatbotAI/
├── api/
│   └── api-chatbot.ts          # API service with streaming support
├── components/
│   ├── chatbot-component.tsx    # Main chat interface
│   └── chatbot-floating-button.tsx # Floating button interface
├── config/
│   └── chatbot-config.ts       # Configuration settings
├── constants/
│   └── language-constants.ts   # Language translations
├── hooks/
│   └── useChatbot.ts          # Custom hook for chatbot functionality
├── store/
│   └── chatbot-store.ts       # Zustand store for state management
├── types/
│   └── Chat.ts                # TypeScript interfaces
└── index.ts                   # Module exports
```

## Installation & Setup

### 1. Backend Configuration

Ensure your Spring Boot application has the chatbot controller configured:

```java
@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {
    // Already configured in your application
}
```

### 2. Frontend Integration

The chatbot is automatically integrated into the main layout:

```tsx
// components/main-layout.tsx
import ChatbotFloatingButton from "../module/ChatbotAI/components/chatbot-floating-button";

export default function MainLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1">
                <Header />
                {children}
            </main>
            <ChatbotFloatingButton />
        </div>
    );
}
```

## Usage

### Basic Usage

The chatbot floating button is automatically available on all pages. Users can:

1. Click the floating AI button to open the chat
2. Type messages and receive AI responses
3. Create multiple conversation sessions
4. Switch between conversations
5. Clear or delete conversations

### Custom Integration

```tsx
import { useChatbot } from '../module/ChatbotAI/hooks/useChatbot';

function CustomComponent() {
    const { 
        sendMessage, 
        isLoading, 
        currentSession,
        toggleChat 
    } = useChatbot();

    const handleSendMessage = async () => {
        await sendMessage("Hello, how can you help with property management?");
    };

    return (
        <div>
            <button onClick={toggleChat}>Open Chat</button>
            <button onClick={handleSendMessage}>Send Test Message</button>
        </div>
    );
}
```

### Store Usage

```tsx
import { useChatbotStore } from '../module/ChatbotAI/store/chatbot-store';

function SessionManager() {
    const { 
        sessions, 
        createNewSession, 
        switchSession,
        deleteSession 
    } = useChatbotStore();

    return (
        <div>
            {sessions.map(session => (
                <div key={session.id}>
                    <span>{session.title}</span>
                    <button onClick={() => switchSession(session.id)}>
                        Switch
                    </button>
                    <button onClick={() => deleteSession(session.id)}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}
```

## Configuration

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Customization

Edit `config/chatbot-config.ts` to customize:

```typescript
export const defaultChatbotConfig: ChatbotConfig = {
    // API Configuration
    streamingEnabled: true,
    maxRetries: 3,
    
    // UI Configuration
    defaultLanguage: 'vi', // or 'en'
    position: 'bottom-right',
    theme: 'auto',
    
    // Behavior
    autoOpen: false,
    showGreeting: true,
    enableQuickActions: true
};
```

## API Endpoints

The chatbot integrates with these backend endpoints:

- `POST /api/chatbot/chat` - Send message (streaming)
- `POST /api/chatbot/chat-fallback` - Send message (non-streaming)

### Request Format

```json
{
    "message": "User message content"
}
```

### Response Format (Streaming)

```
data: {"response": "Partial response chunk"}
data: {"response": "Another chunk"}
data: [DONE]
```

### Response Format (Non-streaming)

```json
{
    "response": "Complete AI response",
    "timestamp": "2024-01-20T10:30:00Z"
}
```

## Language Support

The chatbot supports Vietnamese and English:

```typescript
// Automatic language detection from user's language preference
const { getTranslation } = useChatbot();
const welcomeMessage = getTranslation('defaultGreeting');

// Manual language override
const viText = ChatbotLanguageConstants.vi.sendMessage;
const enText = ChatbotLanguageConstants.en.sendMessage;
```

## Error Handling

The chatbot includes comprehensive error handling:

- **Network Errors**: Automatic retry with exponential backoff
- **API Errors**: User-friendly error messages
- **Stream Interruption**: Graceful fallback to non-streaming
- **Authentication**: JWT token validation

## Performance Features

- **Lazy Loading**: Components load only when needed
- **Request Cancellation**: Previous requests cancelled on new ones
- **Session Persistence**: Conversations saved in local storage
- **Debounced Typing**: Optimized typing indicators

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and descriptions
- **High Contrast**: Support for high contrast mode
- **Focus Management**: Proper focus handling

## Troubleshooting

### Common Issues

1. **Chatbot not appearing**
   - Check if `ChatbotFloatingButton` is imported in main layout
   - Verify "use client" directive is present

2. **API connection errors**
   - Check NEXT_PUBLIC_API_URL environment variable
   - Verify backend chatbot endpoints are available
   - Check JWT authentication is working

3. **Streaming not working**
   - Verify backend supports streaming responses
   - Check network connection stability
   - Falls back to non-streaming automatically

### Debug Mode

Enable debug logging:

```typescript
// In development, console.log statements are active
// Check browser console for detailed error information
```

## Contributing

When extending the chatbot module:

1. Follow the existing component patterns
2. Add proper TypeScript types
3. Include both Vietnamese and English translations
4. Test streaming and non-streaming modes
5. Update this README with new features

## License

This chatbot module is part of the SoTroOnline property management system.