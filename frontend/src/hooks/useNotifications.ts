import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export type NotificationTargetRole = 'ALL' | 'STUDENT' | 'COLLEGE_NODAL' | 'MODERATOR';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  targetRole: NotificationTargetRole;
  targetCollegeCode?: string;
  targetStudentId?: string;
  sender: string;
  senderRole: 'STUDENT' | 'COLLEGE_NODAL' | 'MODERATOR' | 'SYSTEM';
  timestamp: string;
  unread: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
  actionUrl?: string;
}

const STORAGE_KEY = 'apaar_platform_notifications';

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'AICTE Sanctioned Quota Reconciled',
    message: 'National Moderator verified annual intake quota. 1,450 seats confirmed for academic session 2024-25.',
    targetRole: 'COLLEGE_NODAL',
    targetCollegeCode: 'C-16622',
    sender: 'National Moderator (Dr. V. K. Sharma)',
    senderRole: 'MODERATOR',
    timestamp: '10m ago',
    unread: true,
    type: 'success',
    actionUrl: '/college'
  },
  {
    id: 'notif-2',
    title: 'APAAR Digital Credential Generated',
    message: 'Your college has verified your enrollment dossier and issued verified 12-digit APAAR ID 9842-1083-4912.',
    targetRole: 'STUDENT',
    targetStudentId: '9842-1083-4912',
    sender: 'College Admissions Authority (C-16622)',
    senderRole: 'COLLEGE_NODAL',
    timestamp: '25m ago',
    unread: true,
    type: 'success',
    actionUrl: '/student'
  },
  {
    id: 'notif-3',
    title: 'New Student Batch Ingestion Received',
    message: 'College C-16622 uploaded batch dataset (146 records). Verhoeff checksum algorithm completed.',
    targetRole: 'MODERATOR',
    sender: 'College Nodal Officer (Dr. R. Rajesh)',
    senderRole: 'COLLEGE_NODAL',
    timestamp: '1h ago',
    unread: true,
    type: 'info',
    actionUrl: '/admin/cases'
  }
];

export function useNotifications(currentRole?: 'STUDENT' | 'COLLEGE_NODAL' | 'MODERATOR', collegeCode?: string, studentId?: string) {
  const [allNotifications, setAllNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  // Sync state with localStorage on cross-window/storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setAllNotifications(JSON.parse(e.newValue));
        } catch {}
      }
    };

    const handleCustomEvent = (e: CustomEvent<AppNotification>) => {
      const newNotif = e.detail;
      setAllNotifications((prev) => {
        const exists = prev.some((n) => n.id === newNotif.id);
        if (exists) return prev;
        return [newNotif, ...prev];
      });

      // Show instant pop-up toast if current portal role is the recipient
      if (!currentRole || newNotif.targetRole === 'ALL' || newNotif.targetRole === currentRole) {
        toast(`[${newNotif.sender}] ${newNotif.title}: ${newNotif.message}`, {
          duration: 6000,
          position: 'top-right',
          icon: newNotif.type === 'alert' || newNotif.type === 'warning' ? '⚠️' : '🔔',
          style: {
            borderRadius: '16px',
            border: '1px solid #CBD5E1',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '12px 16px',
            background: '#FFFFFF',
            fontSize: '12px',
            fontWeight: '600',
            maxWidth: '420px'
          }
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('apaar_notification_dispatched' as any, handleCustomEvent as any);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('apaar_notification_dispatched' as any, handleCustomEvent as any);
    };
  }, [currentRole]);

  // Filter notifications relevant to the active user role
  const userNotifications = allNotifications.filter((n) => {
    if (!currentRole) return true;
    if (n.targetRole === 'ALL') return true;
    if (n.targetRole !== currentRole) return false;

    // Filter by specific college code if college nodal
    if (currentRole === 'COLLEGE_NODAL' && n.targetCollegeCode && collegeCode) {
      return n.targetCollegeCode === collegeCode;
    }

    // Filter by specific student id if student
    if (currentRole === 'STUDENT' && n.targetStudentId && studentId) {
      return n.targetStudentId === studentId;
    }

    return true;
  });

  const unreadCount = userNotifications.filter((n) => n.unread).length;

  const sendNotification = useCallback((params: {
    title: string;
    message: string;
    targetRole: NotificationTargetRole;
    targetCollegeCode?: string;
    targetStudentId?: string;
    sender: string;
    senderRole: 'STUDENT' | 'COLLEGE_NODAL' | 'MODERATOR' | 'SYSTEM';
    type?: 'info' | 'success' | 'warning' | 'alert';
    actionUrl?: string;
  }) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: params.title,
      message: params.message,
      targetRole: params.targetRole,
      targetCollegeCode: params.targetCollegeCode,
      targetStudentId: params.targetStudentId,
      sender: params.sender,
      senderRole: params.senderRole,
      timestamp: 'Just now',
      unread: true,
      type: params.type || 'info',
      actionUrl: params.actionUrl
    };

    setAllNotifications((prev) => {
      const updated = [newNotif, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // Dispatch global event for instant popup across tabs and active views
    window.dispatchEvent(new CustomEvent('apaar_notification_dispatched', { detail: newNotif }));

    return newNotif;
  }, []);

  const markAsRead = useCallback((id: string) => {
    setAllNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, unread: false } : n));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setAllNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, unread: false }));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    toast.success('All notifications marked as read');
  }, []);

  const clearAll = useCallback(() => {
    setAllNotifications([]);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch {}
    toast.success('Cleared all notifications');
  }, []);

  return {
    notifications: userNotifications,
    allNotifications,
    unreadCount,
    sendNotification,
    markAsRead,
    markAllAsRead,
    clearAll
  };
}
