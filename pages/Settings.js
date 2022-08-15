import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { Box, Button, Text, Stack, HStack, Radio } from 'native-base';
import {
  getData,
  storeData,
  hardReset,
  getTimeDifference,
} from '../lib/Helper';

// ----------------------------BACKGROUND FETCH------------------------------------

const BACKGROUND_FETCH_TASK = 'background-azan-setter';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  console.log('running task');
  const BTzoneData = await getData('yourZone');
  await fetchTimes(BTzoneData);
  const BTtempDataA = await getData('yourTimes');
  const BTtempDataB = await getTimeDifference(BTtempDataA);
  const BTnotifTempData = await checkNotificationStatus();
  if (BTnotifTempData < 1) {
    if (BTtempDataB > 9) {
      try {
        let timers = [];
        Object.entries(BTtempDataB.solatETA).map((item) => {
          timers = [...timers, item[0], Math.round(item[1] / 1000)];
        });
        for (let i = 0; i < timers.length; i += 2) {
          await schedulePushNotification(timers[i], timers[i + 1]);
        }
      } catch (error) {
        console.log(error);
      }
    }
    console.log('notif is < 1 but BTtempDataB is < 9');
  } else {
    console.log('notif is > 0');
  }

  return BTtempDataB
    ? BackgroundFetch.BackgroundFetchResult.NewData
    : BackgroundFetch.BackgroundFetchResult.NoData;
});

async function registerBackgroundFetchAsync() {
  console.log('BACKGROUND TASK REGISTERED');
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 1, // this is 4 hours!
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

const fetchTimes = async (zone) => {
  fetch(`https://api.waktusolat.me/waktusolat/today/${zone}`)
    .then((response) => response.json())
    .then((json) => {
      storeData('yourTimes', json);
    });
};

// ----------------------------NOTIFICATIONS------------------------------------

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function schedulePushNotification(waktu, ttt) {
  console.log('scheduling push notification');
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Masuk Waktu ${waktu}`,
      body: 'Hayya alassolah',
      data: { data: `Masuk Waktu ${waktu}` },
    },
    trigger: { channelId: 'azan-app', seconds: ttt },
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
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });
  }
  console.log('registered notification channel');
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

// RERENDER
function reRender() {
  const [rerender, setRerender] = useState(0);
  return () => {
    console.log('forcing rerender');
    setRerender((render) => render + 1);
  };
}

export default function Settings() {
  const forceRerender = reRender();
  const notificationListener = useRef();
  const responseListener = useRef();
  const [notification, setNotification] = useState(false);
  const [settings, setSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  async function turnOnNotification() {
    try {
      await storeData('yourSettings', 'on');
      await registerBackgroundFetchAsync();
      await Notifications.requestPermissionsAsync();
      await registerForPushNotificationsAsync();
      const zoneData = await getData('yourZone');
      await fetchTimes(zoneData);
      const tempA = await getData('yourTimes');
      const tempB = await getTimeDifference(tempA);
      let timers = [];
      Object.entries(tempB.solatETA).map((item) => {
        timers = [...timers, item[0], Math.round(item[1] / 1000)];
      });
      console.log('timers', timers);
      for (let i = 0; i < timers.length; i += 2) {
        await schedulePushNotification(timers[i], timers[i + 1]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function turnOffNotifications() {
    try {
      await storeData('yourSettings', 'off');
      await unregisterBackgroundFetchAsync();
      Notifications.cancelAllScheduledNotificationsAsync();
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    } catch (error) {
      console.log(error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      console.log('this is settings');
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        console.log('Settings NOT IN FOCUS');
        const getSettings = async () => {
          const settings = await getData('yourSettings');
          if (!settings) {
            setSettings('off');
          } else {
            setSettings(settings);
          }
        };
        getSettings().then(() => {
          setLoading(false);
        });
        forceRerender();
      };
    }, [])
  );
  useEffect(() => {
    const getSettings = async () => {
      const settings = await getData('yourSettings');
      if (!settings) {
        setSettings('off');
      } else {
        setSettings(settings);
      }
    };
    getSettings().then(() => {
      setLoading(false);
    });
    // set notification listeners on mount
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    return () => {
      // remove notification listeners on unmount
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  if (loading) {
    return <Text>Loading...</Text>;
  }
  return (
    <Box alignItems='center' safeArea>
      <Box
        w='90%'
        mt={3}
        rounded='lg'
        overflow='hidden'
        borderColor='coolGray.200'
        borderWidth='1'
        _dark={{
          borderColor: 'coolGray.600',
          backgroundColor: 'gray.700',
        }}
        _web={{
          shadow: 2,
          borderWidth: 0,
        }}
        _light={{
          backgroundColor: 'gray.50',
        }}
      >
        <Stack p='4' space={3}>
          <Stack space={2} marginTop='2'>
            <HStack space={6}>
              <Text
                fontWeight='bold'
                fontSize='lg'
                color='gray.800'
                _dark={{
                  color: 'gray.400',
                }}
              >
                Play the azan
              </Text>
              <Radio.Group
                name='exampleGroup'
                defaultValue={settings}
                onChange={(value) => {
                  setSettings(value);
                  if (value === 'on') {
                    turnOnNotification();
                  } else {
                    turnOffNotifications();
                  }
                }}
                accessibilityLabel='pick a size'
              >
                <Stack
                  direction={{
                    base: 'column',
                    md: 'row',
                  }}
                  alignItems={{
                    base: 'flex-start',
                    md: 'center',
                  }}
                  space={4}
                  w='100%'
                  maxW='300px'
                >
                  <Radio value='on' size='sm' my={1}>
                    On
                  </Radio>
                  <Radio value='off' size='sm' my={1}>
                    Off
                  </Radio>
                </Stack>
              </Radio.Group>
            </HStack>
            <HStack space={6} marginTop='5'>
              <Text
                fontWeight='bold'
                fontSize='lg'
                color='gray.800'
                _dark={{
                  color: 'gray.400',
                }}
              >
                Reset timezone
              </Text>
              <Button
                size='sm'
                color='gray.600'
                _dark={{
                  color: 'gray.400',
                }}
                onPress={async () => {
                  await turnOffNotifications();
                  hardReset();
                }}
              >
                Reset
              </Button>
            </HStack>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
