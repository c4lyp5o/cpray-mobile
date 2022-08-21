import { Box, Button, Text, Spinner } from 'native-base';
import { useState, useEffect } from 'react';
import { useNNWSStore } from '../lib/Context';

export default function NotificationService() {
  const {
    test,
    checkNotificationStatus,
    notification,
    scheduleTestPushNotification,
    cancelAllScheduledNotificationsAsync,
  } = useNNWSStore();
  const [notfCount, setNotfCount] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hereAndNow = async () => {
      try {
        const temp = await checkNotificationStatus();
        setNotfCount(temp);
      } catch (error) {
        console.log(error);
      }
    };
    hereAndNow().then(() => {
      setLoading(false);
    });
  }, [test]);

  if (loading) {
    return (
      <Box
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spinner size='lg' color='violet.500' />
      </Box>
    );
  }

  return (
    <Box maxW='90%'>
      <Box mb='2'>
        <Text marginTop={2} fontSize='xs' textAlign='center'>
          Notification Service: {notfCount ? 'on' : 'off'}
        </Text>
      </Box>
      <Box mb='2'>
        <Button shadow='2' onPress={scheduleTestPushNotification} size='xs'>
          Trigger Local Notifications
        </Button>
      </Box>
      <Box mb='2'>
        <Button
          size='xs'
          shadow={2}
          onPress={async () => {
            await cancelAllScheduledNotificationsAsync();
          }}
        >
          Delete all pending notifications
        </Button>
      </Box>
      <Box mb='2'>
        <Button
          size='xs'
          shadow={2}
          onPress={async () => {
            const temp = await checkNotificationStatus();
            setNotfCount(temp);
          }}
        >
          Check Present Notifications
        </Button>
        {notfCount ? (
          <Text marginTop={2} fontSize='xs'>
            {notfCount.map((item, index) => {
              return (
                <Text key={index}>
                  {item.content.title} - {item.trigger.seconds} seconds{'\n'}
                  {'\n'}
                </Text>
              );
            })}
          </Text>
        ) : (
          <Text textAlign='center' mt={1} fontSize='xs'>
            No scheduled notif
          </Text>
        )}
      </Box>
    </Box>
  );
}
