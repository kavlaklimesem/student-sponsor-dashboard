
import { useState, useEffect } from "react";
import { Bell, CheckCircle, XCircle, AlertCircle, Info, X, Check } from "lucide-react";
import { useNotification, NotificationType, initializeNotifications } from "@/hooks/useNotification";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { tr } from 'date-fns/locale';

const typeIcons = {
  success: <CheckCircle className="h-4 w-4 text-success" />,
  error: <XCircle className="h-4 w-4 text-destructive" />,
  warning: <AlertCircle className="h-4 w-4 text-warning" />,
  info: <Info className="h-4 w-4 text-info" />
};

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    clearAllNotifications 
  } = useNotification();

  useEffect(() => {
    // Sayfa yüklendiğinde bildirimleri yükle
    initializeNotifications();
  }, []);

  // Bildirimleri dışarıda herhangi bir yere tıklandığında kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-notification-center]')) {
          setIsOpen(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    
    // 24 saatten az ise
    if (now.getTime() - notificationDate.getTime() < 24 * 60 * 60 * 1000) {
      return format(notificationDate, "'Bugün' HH:mm", { locale: tr });
    }
    
    // 48 saatten az ise
    if (now.getTime() - notificationDate.getTime() < 48 * 60 * 60 * 1000) {
      return format(notificationDate, "'Dün' HH:mm", { locale: tr });
    }
    
    // Daha eski ise
    return format(notificationDate, 'd MMMM yyyy HH:mm', { locale: tr });
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };

  return (
    <div className="relative" data-notification-center>
      <button 
        className="p-2 rounded-full hover:bg-secondary transition-colors relative flex items-center justify-center"
        onClick={toggleOpen}
        title="Bildirimler"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-destructive text-white text-xs flex items-center justify-center rounded-full animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 bg-background shadow-lg rounded-lg border z-50 animate-fade-in">
          <div className="p-3 border-b flex items-center justify-between">
            <h3 className="font-medium">Bildirimler</h3>
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <>
                  <button 
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    onClick={markAllAsRead}
                    title="Tümünü Okundu İşaretle"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button 
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    onClick={clearAllNotifications}
                    title="Tümünü Temizle"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto p-2 flex flex-col gap-2">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                <p>Henüz bildirim bulunmuyor.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "p-3 rounded-lg border text-sm relative",
                    !notification.isRead && "bg-secondary/30 border-primary/20",
                    notification.isRead && "bg-background"
                  )}
                >
                  <div className="flex gap-2">
                    <div className="mt-0.5">
                      {typeIcons[notification.type]}
                    </div>
                    <div className="flex-1">
                      {notification.title && (
                        <div className="font-medium">{notification.title}</div>
                      )}
                      <div className={cn(!notification.title && "font-medium")}>
                        {notification.message}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDate(notification.timestamp)}
                      </div>
                    </div>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors absolute top-2 right-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
