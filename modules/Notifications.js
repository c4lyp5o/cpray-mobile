import * as Notifications from 'expo-notifications';
import { Platform, Box, Button, Text } from 'native-base';
import React, { useState, useEffect, useRef } from 'react';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

export default function NotificationService() {
  const [notification, setNotification] = useState(false);
  const [notfCount, setNotfCount] = useState();
  const notificationListener = useRef();
  const responseListener = useRef();

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

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('azan-app', {
        name: 'Azan App',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'azan.wav',
        lightColor: '#FF231F7C',
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
      });
    }
    console.log('registered notification channel');
  }

  async function checkNotificationStatus() {
    try {
      let scheduledOnes = [];
      scheduledOnes = await Notifications.getAllScheduledNotificationsAsync();
      if (scheduledOnes.length > 0) {
        console.log(
          'scheduled notifications',
          JSON.stringify(scheduledOnes, null, 2)
        );
        setNotfCount(scheduledOnes);
      } else {
        console.log('no scheduled notifications');
        setNotfCount(null);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      return scheduledOnes;
    }
  }

  // useEffect(() => {
  //   registerForPushNotificationsAsync();

  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       setNotification(notification);
  //     });

  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       console.log(response);
  //     });

  //   console.log('registered notification listeners');

  //   return () => {
  //     console.log('unregistered listener');
  //     Notifications.removeNotificationSubscription(
  //       notificationListener.current
  //     );
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  return (
    <Box mt={2} width='90%'>
      <Box mb='2'>
        <Button shadow={2} width='100%' onPress={schedulePushNotification}>
          Trigger Local Notifications
        </Button>
      </Box>
      <Box mb='2'>
        <Button
          shadow={2}
          width='100%'
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
          width='100%'
          onPress={async () => {
            const temp = await checkNotificationStatus();
            console.log('temp', temp);
            setNotfCount(temp);
          }}
        >
          Check Present Notifications
        </Button>
        {notfCount ? (
          <Text textAlign='center' mt={2} mb={2} fontSize='xs'>
            {notfCount.map((item, index) => {
              return (
                <Text key={index}>
                  {item.content.title} - {item.content.body} - {item.identifier}{' '}
                  - {item.trigger.seconds} seconds{'\n'}
                  {'\n'}
                </Text>
              );
            })}
          </Text>
        ) : (
          <Text textAlign='center' mt={2} fontSize='xs'>
            No scheduled notifications
          </Text>
        )}
      </Box>
    </Box>
  );
}
