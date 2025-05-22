import React from 'react';
import NotificationSidebar from '@/components/notifications/NotificationSidebar';
import { Outlet, Routes, Route } from 'react-router-dom';
import NotificationDetailPage from './NotificationDetailPage';

const UserNotificationsPage: React.FC = () => {
  return (
    <div className="flex min-h-[80vh] bg-gray-50">
      <NotificationSidebar />
      <main className="flex-1 flex items-center justify-center">
        <Routes>
          <Route path=":id" element={<NotificationDetailPage />} />
        </Routes>
      </main>
    </div>
  );
};
export default UserNotificationsPage; 