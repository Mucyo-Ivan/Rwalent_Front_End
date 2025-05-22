import React from 'react';
import EnhancedNotificationSidebar from '@/components/notifications/EnhancedNotificationSidebar';
import { Routes, Route, useLocation } from 'react-router-dom';
import NotificationDetailPage from './NotificationDetailPage';
import { Bell } from 'lucide-react';

const UserNotificationsPage: React.FC = () => {
  const location = useLocation();
  const hasSelectedNotification = location.pathname.split('/').length > 2;

  return (
    <div className="flex min-h-[80vh] bg-gray-50">
      {/* Sidebar - takes about 30% of the screen on larger devices */}
      <div className="w-full md:w-1/3 lg:w-[30%] border-r">
        <EnhancedNotificationSidebar />
      </div>
      
      {/* Main content area */}
      <main className="hidden md:flex flex-1">
        <Routes>
          <Route path=":id" element={<NotificationDetailPage />} />
          <Route path="*" element={
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Your Notifications</h2>
              <p className="text-gray-500 max-w-md">
                Select a notification from the sidebar to view its details here.
              </p>
            </div>
          } />
        </Routes>
      </main>
      
      {/* On mobile, when a notification is selected, we hide the sidebar and show only the detail */}
      {hasSelectedNotification && (
        <div className="fixed inset-0 z-50 md:hidden bg-white">
          <Routes>
            <Route path=":id" element={<NotificationDetailPage />} />
          </Routes>
        </div>
      )}
    </div>
  );
};
export default UserNotificationsPage;