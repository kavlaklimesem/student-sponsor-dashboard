
import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  title?: string;
  isRead: boolean;
  timestamp: Date;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

export const useNotification = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  
  addNotification: (notification) => {
    const id = Date.now().toString();
    const newNotification = { 
      ...notification, 
      id, 
      isRead: false, 
      timestamp: new Date() 
    };
    
    // Hem lokalde göstermek hem de localStorage'a kaydetmek için
    set((state) => {
      const updatedNotifications = [newNotification, ...state.notifications];
      
      // LocalStorage'a kaydet
      try {
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      } catch (error) {
        console.error('Error saving notifications to localStorage:', error);
      }
      
      return { 
        notifications: updatedNotifications,
        unreadCount: state.unreadCount + 1
      };
    });
    
    // Bildirim sesi çalma
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Notification sound could not be played', e));
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  },
  
  markAsRead: (id) => {
    set((state) => {
      const updatedNotifications = state.notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      );
      
      // LocalStorage'a kaydet
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      
      const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
      
      return { 
        notifications: updatedNotifications,
        unreadCount
      };
    });
  },
  
  markAllAsRead: () => {
    set((state) => {
      const updatedNotifications = state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));
      
      // LocalStorage'a kaydet
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      
      return { 
        notifications: updatedNotifications,
        unreadCount: 0
      };
    });
  },
  
  removeNotification: (id) => {
    set((state) => {
      const updatedNotifications = state.notifications.filter(
        (notification) => notification.id !== id
      );
      
      // LocalStorage'a kaydet
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      
      const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
      
      return { 
        notifications: updatedNotifications,
        unreadCount
      };
    });
  },
  
  clearAllNotifications: () => {
    // LocalStorage'dan sil
    localStorage.removeItem('notifications');
    
    set({ notifications: [], unreadCount: 0 });
  },
}));

// Sayfa yüklendiğinde localStorage'dan bildirimleri yüklemek için bir başlatıcı
export const initializeNotifications = () => {
  try {
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications) as Notification[];
      const unreadCount = parsedNotifications.filter(n => !n.isRead).length;
      
      useNotification.setState({
        notifications: parsedNotifications,
        unreadCount
      });
    }
  } catch (error) {
    console.error('Error loading notifications from localStorage:', error);
  }
};
