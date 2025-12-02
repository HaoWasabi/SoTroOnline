export const ChatbotLanguageConstants = {
    vi: {
        // UI Elements
        chatbot: "Trợ lý AI",
        newChat: "Cuộc trò chuyện mới",
        sendMessage: "Gửi tin nhắn",
        typingPlaceholder: "Nhập tin nhắn của bạn...",
        typing: "Đang nhập...",
        connecting: "Đang kết nối...",
        
        // Actions
        send: "Gửi",
        clear: "Xóa",
        delete: "Xóa",
        edit: "Sửa",
        copy: "Sao chép",
        retry: "Thử lại",
        
        // Sessions
        conversations: "Cuộc trò chuyện",
        noConversations: "Chưa có cuộc trò chuyện nào",
        deleteConversation: "Xóa cuộc trò chuyện",
        renameConversation: "Đổi tên cuộc trò chuyện",
        
        // Messages
        messageCopied: "Đã sao chép tin nhắn",
        messageDeleted: "Đã xóa tin nhắn",
        noMessages: "Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!",
        startConversation: "Bắt đầu cuộc trò chuyện với trợ lý AI",
        
        // Errors
        error: "Lỗi",
        connectionError: "Lỗi kết nối. Vui lòng thử lại.",
        messageError: "Không thể gửi tin nhắn. Vui lòng thử lại.",
        loadingError: "Lỗi khi tải dữ liệu",
        networkError: "Lỗi mạng. Kiểm tra kết nối internet.",
        serverError: "Lỗi máy chủ. Vui lòng thử lại sau.",
        
        // Confirmations
        confirmDelete: "Bạn có chắc chắn muốn xóa cuộc trò chuyện này?",
        confirmClear: "Bạn có chắc chắn muốn xóa tất cả tin nhắn?",
        
        // Tooltips
        minimize: "Thu nhỏ",
        maximize: "Phóng to", 
        close: "Đóng",
        settings: "Cài đặt",
        
        // Time
        justNow: "Vừa xong",
        minutesAgo: "phút trước",
        hoursAgo: "giờ trước",
        daysAgo: "ngày trước",
        weeksAgo: "tuần trước",
        
        // Greetings
        defaultGreeting: "Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp gì cho bạn hôm nay?",
        welcomeBack: "Chào mừng bạn quay lại!",
        
        // Quick actions
        quickActions: "Hành động nhanh",
        askQuestion: "Đặt câu hỏi",
        getHelp: "Nhận trợ giúp",
        startOver: "Bắt đầu lại"
    },
    en: {
        // UI Elements
        chatbot: "AI Assistant",
        newChat: "New Conversation",
        sendMessage: "Send Message",
        typingPlaceholder: "Type your message...",
        typing: "Typing...",
        connecting: "Connecting...",
        
        // Actions
        send: "Send",
        clear: "Clear",
        delete: "Delete",
        edit: "Edit",
        copy: "Copy",
        retry: "Retry",
        
        // Sessions
        conversations: "Conversations",
        noConversations: "No conversations yet",
        deleteConversation: "Delete conversation",
        renameConversation: "Rename conversation",
        
        // Messages
        messageCopied: "Message copied",
        messageDeleted: "Message deleted",
        noMessages: "No messages yet. Start a conversation!",
        startConversation: "Start conversation with AI assistant",
        
        // Errors
        error: "Error",
        connectionError: "Connection error. Please try again.",
        messageError: "Failed to send message. Please try again.",
        loadingError: "Error loading data",
        networkError: "Network error. Check your internet connection.",
        serverError: "Server error. Please try again later.",
        
        // Confirmations
        confirmDelete: "Are you sure you want to delete this conversation?",
        confirmClear: "Are you sure you want to clear all messages?",
        
        // Tooltips
        minimize: "Minimize",
        maximize: "Maximize",
        close: "Close",
        settings: "Settings",
        
        // Time
        justNow: "Just now",
        minutesAgo: "minutes ago",
        hoursAgo: "hours ago", 
        daysAgo: "days ago",
        weeksAgo: "weeks ago",
        
        // Greetings
        defaultGreeting: "Hello! I'm your AI assistant. How can I help you today?",
        welcomeBack: "Welcome back!",
        
        // Quick actions
        quickActions: "Quick Actions",
        askQuestion: "Ask Question",
        getHelp: "Get Help",
        startOver: "Start Over"
    }
} as const;

export type ChatbotLanguage = keyof typeof ChatbotLanguageConstants;