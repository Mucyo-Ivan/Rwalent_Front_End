import React from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import EnhancedNotificationSidebar from '@/components/notifications/EnhancedNotificationSidebar';
import NotificationDetailPage from './NotificationDetailPage';
import { Bell, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// This is a talent-specific notifications page that doesn't include the regular site navbar and footer
const TalentNotificationsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasSelectedNotification = location.pathname.split('/').length > 3; // /talent/notifications/:id

  const handleBack = () => {
    // Go back to the talent dashboard
    navigate('/talent/dashboard');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Back to dashboard button (mobile only) */}
      <div className="md:hidden p-4 bg-white border-b">
        <Button variant="ghost" size="sm" onClick={handleBack} className="flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - takes about 30% of the screen on larger devices */}
        <div className="w-full md:w-1/3 lg:w-[30%] border-r overflow-y-auto">
          <EnhancedNotificationSidebar />
        </div>
        
        {/* Main content area */}
        <main className="hidden md:flex flex-1 overflow-y-auto">
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
            <div className="p-4 bg-white border-b">
              <Button variant="ghost" size="sm" onClick={() => navigate('/talent/notifications')} className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Notifications</span>
              </Button>
            </div>
            <div className="p-4">
              <Routes>
                <Route path=":id" element={<NotificationDetailPage />} />
              </Routes>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentNotificationsPage;