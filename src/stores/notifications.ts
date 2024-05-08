import { AlertStatus } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { create } from 'zustand';

export type Notification = {
  id: string;
  type: AlertStatus;
  title?: string;
  message: string;
};

type NotificationsStore = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: string) => void;
  addNotificationBatch: (notifications: Omit<Notification, 'id'>[]) => void;
  dismissNotificationBatch: (ids: string[]) => void;
};

const useNotificationStore = create<NotificationsStore>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => {
      const notifications = new Map<string, Notification>(
        state.notifications.map((notification) => [notification.message, notification])
      );
      notifications.set(notification.message, { ...notification, id: nanoid() });
      return {
        notifications: Array.from(notifications.values()),
      };
    }),
  addNotificationBatch: (notifications) =>
    set((state) => ({
      ...state,
      notifications: [
        ...state.notifications,
        ...notifications.map((notification) => ({ id: nanoid(), ...notification })),
      ],
    })),
  dismissNotification: (id) =>
    set((state) => ({ notifications: state.notifications.filter((entry) => entry.id !== id) })),
  dismissNotificationBatch: (ids) =>
    set((state) => ({
      ...state,
      notifications: state.notifications.filter((notification) => !ids.includes(notification.id)),
    })),
}));

export { useNotificationStore };
