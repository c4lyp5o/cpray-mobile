import { Box, Button, Text, Spinner } from 'native-base';
import { useState, useEffect } from 'react';
import { useNNWSStore } from '../lib/Context';
import simpleLogger from '../lib/Logger';

import Loading from './Loading';

export default function NotificationService() {
  const {
    checkNotificationStatus,
    scheduleTestPushNotification,
    cancelAllScheduledNotificationsAsync,
  } = useNNWSStore();
  const [notfCount, setNotfCount] = useState(null);
  const [loading, setLoading] = useState(true);

  const cancelAllScheduledNotifications = async () => {
    try {
      await cancelAllScheduledNotificationsAsync();
      setNotfCount(null);
    } catch (error) {
      simpleLogger('NOTIFICATIONS', error);
    }
  };

  const checkPresentNotifications = async () => {
    try {
      const temp = await checkNotificationStatus();
      if (temp) {
        simpleLogger(
          'NOTIFICATIONS',
          `Got ${JSON.stringify(temp)} as notifications`
        );
        setNotfCount(temp);
      } else {
        simpleLogger('NOTIFICATIONS', 'Got no notifications');
        setNotfCount(null);
      }
    } catch (error) {
      simpleLogger('NOTIFICATIONS', error);
    }
  };

  useEffect(() => {
    const hereAndNow = async () => {
      try {
        const temp = await checkNotificationStatus();
        setNotfCount(temp);
      } catch (error) {
        simpleLogger('NOTIFICATIONS', error);
      }
    };

    try {
      hereAndNow();
    } catch (error) {
      simpleLogger('NOTIFICATIONS', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <Loading />;

  return (
    <Box width='90%'>
      <Box mb='2'>
        <Text marginTop={2} fontSize='xs' textAlign='center'>
          Notification Service: {notfCount ? 'on' : 'off'}
        </Text>
      </Box>
      <Box mb='2'>
        <Button
          width='100%'
          shadow='2'
          onPress={scheduleTestPushNotification}
          size='xs'
        >
          Trigger Local Notifications
        </Button>
      </Box>
      <Box mb='2'>
        <Button
          width='100%'
          size='xs'
          shadow={2}
          onPress={cancelAllScheduledNotifications}
        >
          Delete all pending notifications
        </Button>
      </Box>
      <Box>
        <Button
          width='100%'
          size='xs'
          shadow={2}
          onPress={checkPresentNotifications}
        >
          Check Present Notifications
        </Button>
        {notfCount ? (
          <Text textAlign='center' mt={2} mb={2} fontSize='xs'>
            {notfCount.map((item, index) => {
              return (
                <Text key={index}>
                  {(() => {
                    const hours = Math.floor(item.trigger.seconds / 60 / 60);
                    const minutes = Math.floor(
                      (item.trigger.seconds / 60) % 60
                    );
                    return `${
                      item.content.title
                    } - ${hours} hours, ${minutes} minutes${
                      index < notfCount.length - 1 ? '\n' : ''
                    }`;
                  })()}
                </Text>
              );
            })}
          </Text>
        ) : (
          <Text textAlign='center' mt={2} mb={2} fontSize='xs'>
            No scheduled notifications
          </Text>
        )}
      </Box>
    </Box>
  );
}
