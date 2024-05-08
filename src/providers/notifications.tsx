import { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useNotificationStore } from '@/stores/notifications';

function Notifications() {
  const toast = useToast();
  const { notifications, dismissNotification } = useNotificationStore();

  useEffect(() => {
    const notification = notifications[0];
    if (notification) {
      dismissNotification(notification.id);
      toast({
        duration: 3000,
        position: 'top',
        id: notification.id,
        title: notification.title,
        description: notification.message,
        colorScheme: notification.type === 'error' ? 'blue' : 'blackAlpha',
        isClosable: true,
      });
    }
  }, [notifications, dismissNotification, toast]);

  return null;
}

export { Notifications };
