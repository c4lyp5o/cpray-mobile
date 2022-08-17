import * as Notifications from 'expo-notifications';
import { Box, Button, Text } from 'native-base';
import { useState } from 'react';

export default function NotificationService({ notification }) {
  const [notfCount, setNotfCount] = useState();

  return (
    <Box maxW='90%'>
      <Box mb='2'>
        <Text marginTop={2} fontSize='xs' textAlign='center'>
          Notification Service: {notification ? 'on' : 'off'}
        </Text>
      </Box>
      <Box mb='2'>
        <Button shadow='2' onPress={schedulePushNotification}>
          Trigger Local Notifications
        </Button>
      </Box>
      <Box mb='2'>
        <Button
          shadow={2}
          onPress={async () => {
            await Notifications.cancelAllScheduledNotificationsAsync();
          }}
        >
          Delete all pending notifications
        </Button>
      </Box>
      <Box mb='2'>
        <Button
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
          <Text textAlign='center' mt={1}>
            No scheduled notif
          </Text>
        )}
      </Box>
    </Box>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Masuk Waktu',
      body: 'Hayya alassolah',
      data: { data: 'supposed to ada sound lah' },
    },
    trigger: { channelId: 'azan-app', seconds: 5 },
  });
}

async function checkNotificationStatus() {
  const scheduledOnes = await Notifications.getAllScheduledNotificationsAsync();
  if (scheduledOnes.length > 0) {
    console.log('scheduled notifications', scheduledOnes);
    return scheduledOnes;
  } else {
    console.log('no scheduled notifications');
  }
}
