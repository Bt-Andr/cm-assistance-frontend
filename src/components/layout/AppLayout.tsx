
import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ChatAssistant from '../assistant/ChatAssistant';
import { useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-secondary-light/30">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
      
      {/* Chat Assistant will float above the layout */}
      <ChatAssistant />
    </div>
  );
};



export default AppLayout;


