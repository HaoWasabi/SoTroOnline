"use client"

import { Header } from "./header";
import { Sidebar } from "./sidebar";
import ChatbotFloatingButton from "../module/ChatbotAI/components/chatbot-floating-button";


function MainLayout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex">
            <Sidebar />
           
            <main className="flex-1">
                <Header />
                    {children}
                </main>

            {/* Chatbot AI Assistant - Global Access */}
            <ChatbotFloatingButton />
        </div>
    );
}

export default MainLayout;
