import React from 'react';
import { Outlet, Routes, Route } from 'react-router-dom';
import NotificationSidebar from '@/components/notifications/NotificationSidebar';
import NotificationDetailPage from './NotificationDetailPage';

const TalentNotificationsPage: React.FC = () => {
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

export default TalentNotificationsPage; 