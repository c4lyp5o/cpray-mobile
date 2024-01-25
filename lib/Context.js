import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';

import { getData, storeData, getTimeDifference } from '../lib/Helper';
import simpleLogger from './Logger';
import ToastService from './Toast';

const NNWSstore = React.createContext();

const BACKGROUND_FETCH_TASK = 'NNWS-azan-setter';
const BACKGROUND_FETCH_TASK_TEST = 'NNWS-azan-setter-test';

TaskManager.defineTask(BACKGROUND_FETCH_TASK_TEST, async () => {
  try {
    simpleLogger('running task at ', new Date().toISOString());
    const BTzoneData = await getData('yourZone');
    await fetchTimes(BTzoneData); // saved to storage thats why no return
    const BTtempDataA = await getData('yourTimes');
    const BTtempDataB = await getTimeDifference(BTtempDataA);
    // const BTnotifTempData = await checkNotificationStatus();
    // simpleLogger(BTtempDataA, BTtempDataB, BTnotifTempData);
    // if (BTnotifTempData < 1) {
    //   if (BTtempDataB > 9) {
    //     simpleLogger('BTtempDataB > 9');
    //     try {
    //       let timers = [];
    //       Object.entries(BTtempDataB.solatETA).map((item) => {
    //         timers = [...timers, item[0], Math.round(item[1] / 1000)];
    //       });
    //       for (let i = 0; i < timers.length; i += 2) {
    //         await schedulePushNotification(timers[i], timers[i + 1]);
    //       }
    //     } catch (error) {
    //       simpleLogger('CONTEXT', error);
    //     }
    //   }
    //   simpleLogger('notif is < 1 but BTtempDataB is < 9');
    // } else {
    //   simpleLogger('notif is > 0');
    // }
    simpleLogger('CONTEXT', 'deleting all push notification');
    await cancelAllScheduledNotificationsAsync();
    let timers = [];
    Object.entries(BTtempDataB.solatETA).map((item) => {
      timers = [...timers, item[0], Math.round(item[1] / 1000)];
    });
    for (let i = 0; i < timers.length; i += 2) {
      if (i === 2) {
        i += 2;
      } // bypassing syuruk
      await schedulePushNotification(timers[i], timers[i + 1]);
    }
    BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    simpleLogger('CONTEXT', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    simpleLogger('CONTEXT', 'background task started');
    const BTnotifTempData = await checkNotificationStatus();
    simpleLogger('CONTEXT', `BTnotifTempData: ${BTnotifTempData.length}`);

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (currentHour > 5) {
      simpleLogger(
        'CONTEXT',
        `Not the time to run background task. Time now is ${currentHour}:${currentMinute}`
      );
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    simpleLogger('CONTEXT', `running task at ${now.toISOString()}`);
    const BTzoneData = await getData('yourZone');
    await fetchTimes(BTzoneData);
    const BTtempDataA = await getData('yourTimes');
    const BTtempDataB = await getTimeDifference(BTtempDataA);
    simpleLogger('CONTEXT', 'deleting all push notification');
    await cancelAllScheduledNotificationsAsync();

    const timers = Object.entries(BTtempDataB.solatETA).reduce((acc, item) => {
      return [...acc, item[0], Math.round(item[1] / 1000)];
    }, []);
    simpleLogger('CONTEXT', `timers are ${JSON.stringify(timers)}`);

    const notifications = timers.map((timer, i) => {
      if (i % 2 === 0) {
        return schedulePushNotification(timer, timers[i + 1]);
      }
    });

    await Promise.all(notifications);

    simpleLogger('CONTEXT', 'background task finished');
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    simpleLogger('CONTEXT', `error ${error}`);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// function to run in background
const fetchTimes = async (zone) => {
  try {
    const response = await fetch(
      `https://api.waktusolat.me/waktusolat/today/${zone}`
    );
    const json = await response.json();
    await storeData('yourTimes', json);
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    return true;
  }
};

async function schedulePushNotification(waktu, ttt) {
  simpleLogger('CONTEXT', `scheduling push notification for ${waktu}`);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Masuk Waktu ${waktu}`,
      body: 'Hayya Alassolah',
      data: { data: `Telah Masuk Waktu ${waktu}` },
      autoDismiss: false,
      priority: 'max',
    },
    trigger: { channelId: 'NNWS', seconds: ttt },
  });
}

async function cancelAllScheduledNotificationsAsync() {
  simpleLogger('CONTEXT', 'cancelling all scheduled notifications');
  await Notifications.cancelAllScheduledNotificationsAsync();
}

async function checkNotificationStatus() {
  try {
    const scheduledOnes =
      await Notifications.getAllScheduledNotificationsAsync();
    return scheduledOnes;
  } catch (error) {
    simpleLogger('CONTEXT', error);
  }
}

function NNWSStoreProvider({ children }) {
  const { showToast } = ToastService();
  // STATES
  const [state, setState] = useState({
    yourZone: '',
    yourSettings: 'off',
    yourTimes: '',
    yourTime: new Date(),
    yourReminder: '',
  });
  const [zone, setZone] = useState('');
  // BG FETCH
  const [bgIsRegistered, setBgIsRegistered] = useState(false);
  const [bgFetchStatus, setBgFetchStatus] = useState(null);
  const [bgFetchStatusIntepret, setBgFetchStatusIntepret] = useState(null);
  // NOTIFICATION STUFF
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef(null);
  const responseListener = useRef(null);
  // LOCATION STUFF
  const [location, setLocation] = useState(null);
  const [locationErrorMsg, setLocationErrorMsg] = useState(null);
  // APP STATE STUFF
  const appState = useRef(AppState.currentState);
  const [stateOfApp, setStateOfApp] = useState(null);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      simpleLogger('CONTEXT', 'App has come to the foreground!');
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    simpleLogger('CONTEXT', `App is ${appState.current}`);
  };

  // BG FETCH STUFF
  async function registerBackgroundFetchAsync() {
    try {
      simpleLogger('CONTEXT', `${BACKGROUND_FETCH_TASK} REGISTERED`);
      return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 60, // this is 1 hour!
        stopOnTerminate: false, // android only,
        startOnBoot: true, // android only
      });
    } catch (error) {
      simpleLogger('CONTEXT', error);
    }
  }

  async function unregisterBackgroundFetchAsync() {
    try {
      simpleLogger('CONTEXT', `${BACKGROUND_FETCH_TASK} UNREGISTERED`);
      return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    } catch (error) {
      simpleLogger('CONTEXT', error);
    }
  }

  const checkBackgroundFetchStatusAsync = async () => {
    try {
      const status = await BackgroundFetch.getStatusAsync();
      const intepret = await BackgroundFetch.BackgroundFetchStatus[status];
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        BACKGROUND_FETCH_TASK
      );
      setBgIsRegistered(isRegistered);
      setBgFetchStatus(intepret);
      simpleLogger('CONTEXT', `Background fetch status: ${status}`);
      simpleLogger('CONTEXT', `Background fetch running ${isRegistered}`);
      simpleLogger('CONTEXT', `Background fetch status intepret: ${intepret}`);
    } catch (error) {
      simpleLogger('CONTEXT', error);
    }
  };

  async function registerBackgroundFetchAsyncTest() {
    try {
      simpleLogger('CONTEXT', `${BACKGROUND_FETCH_TASK_TEST} REGISTERED`);
      return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK_TEST, {
        minimumInterval: 60 * 2, // this is 2 minutes!
        stopOnTerminate: false, // android only,
        startOnBoot: true, // android only
      });
    } catch (error) {
      simpleLogger('CONTEXT', error);
    }
  }

  async function unregisterBackgroundFetchAsyncTest() {
    try {
      simpleLogger('CONTEXT', `${BACKGROUND_FETCH_TASK_TEST} UNREGISTERED`);
      return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK_TEST);
    } catch (error) {
      simpleLogger('CONTEXT', error);
    }
  }

  // NOTIFICATION STUFF
  async function registerForPushNotificationsAsync() {
    try {
      if (Platform.OS === 'android') {
        simpleLogger('CONTEXT', 'registered notification channel');
        return Notifications.setNotificationChannelAsync('NNWS', {
          name: 'NNWS',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          sound: 'azan.wav',
          lightColor: '#FF231F7C',
          lockscreenVisibility:
            Notifications.AndroidNotificationVisibility.PUBLIC,
          bypassDnd: true,
          enableVibrate: true,
          enableLights: true,
          showBadge: true,
          audioAttributes: {
            usage: Notifications.AndroidAudioUsage.ALARM,
            // sound: true,
            // playInForeground: true,
          },
        });
      }
    } catch (error) {
      return simpleLogger('CONTEXT', error);
    }
  }

  async function checkNotificationStatus() {
    try {
      const scheduledOnes =
        await Notifications.getAllScheduledNotificationsAsync();
      if (scheduledOnes.length > 0) {
        return scheduledOnes;
      } else {
        simpleLogger('CONTEXT', 'no scheduled notifications');
      }
    } catch (error) {
      simpleLogger('CONTEXT', error);
    }
  }

  async function scheduleTestPushNotification() {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test',
          body: 'Test',
          data: { data: 'supposed to ada sound lah' },
        },
        trigger: { channelId: 'azan-app', seconds: 5 },
      });
    } catch (error) {
      simpleLogger('CONTEXT', error);
    }
  }

  async function cancelAllScheduledNotificationsAsync() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      simpleLogger('CONTEXT', error);
    }
  }

  const fetchTimes = async (zone) => {
    simpleLogger('CONTEXT', `inner fetchtime got zone: ${zone}`);
    try {
      simpleLogger('CONTEXT', 'Fetching times in bg');
      const data = await fetch(
        `https://api.waktusolat.me/waktusolat/today/${zone}`
      );
      const json = await data.json();
      await storeData('bgTimesData', json);
    } catch (error) {
      simpleLogger('CONTEXT', error);
    }
  };

  // NOTIFICATION SWITCH
  async function turnOffNotifications(currentSettings) {
    if (currentSettings === 'off') {
      return true;
    }
    try {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      await storeData('yourSettings', 'off');
      await unregisterBackgroundFetchAsync();
      await cancelAllScheduledNotificationsAsync();
      await checkBackgroundFetchStatusAsync();
      showToast('Notifications disabled');
    } catch (error) {
      console.error(error);
      showToast('An error occurred while disabling notifications');
    }
  }

  async function turnOnNotifications() {
    try {
      const settingsPromise = storeData('yourSettings', 'on');
      const backgroundFetchPromise = registerBackgroundFetchAsync();
      const permissionsPromise = Notifications.requestPermissionsAsync();
      const pushNotificationsPromise = registerForPushNotificationsAsync();
      const zoneDataPromise = getData('yourZone').then(fetchTimes);
      const bgTimesDataPromise = getData('bgTimesData');

      await Promise.all([
        settingsPromise,
        backgroundFetchPromise,
        permissionsPromise,
        pushNotificationsPromise,
        zoneDataPromise,
        bgTimesDataPromise,
      ]);

      // ! not removed because problems stem from here
      const tempA = await bgTimesDataPromise;
      // console.log('tempA', JSON.stringify(tempA));
      const tempB = await getTimeDifference(tempA);
      // console.log('tempB', JSON.stringify(tempB));

      const timers = Object.entries(tempB.solatETA).reduce((acc, item) => {
        return [...acc, item[0], Math.round(item[1] / 1000)];
      }, []);
      // console.log('timers', JSON.stringify(timers));

      simpleLogger('CONTEXT', `timers: ${JSON.stringify(timers)}`);

      const notifications = timers.map((timer, i) => {
        if (i % 2 === 0) {
          return schedulePushNotification(timer, timers[i + 1]);
        }
      });

      await Promise.all(notifications);

      showToast('Notifications enabled');

      await checkBackgroundFetchStatusAsync();
    } catch (error) {
      simpleLogger('CONTEXT', error);
      throw error;
    }
  }

  // LOCATION STUFF
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationErrorMsg('Permission to access location was denied');
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        setLocation(location);
      } else {
        setLocationErrorMsg('Unable to get current location');
      }
    } catch (error) {
      setLocationErrorMsg(
        'An error occurred while getting the current location'
      );
    }
  };

  // IMPORTS
  const value = {
    state,
    setState,
    notification,
    zone,
    setZone,
    //
    stateOfApp,
    setStateOfApp,
    appState,
    appStateVisible,
    _handleAppStateChange,
    //
    BACKGROUND_FETCH_TASK,
    BACKGROUND_FETCH_TASK_TEST,
    registerBackgroundFetchAsync,
    registerBackgroundFetchAsyncTest,
    unregisterBackgroundFetchAsync,
    unregisterBackgroundFetchAsyncTest,
    checkBackgroundFetchStatusAsync,
    bgIsRegistered,
    bgFetchStatus,
    bgFetchStatusIntepret,
    //
    turnOffNotifications,
    turnOnNotifications,
    schedulePushNotification,
    registerForPushNotificationsAsync,
    checkNotificationStatus,
    scheduleTestPushNotification,
    cancelAllScheduledNotificationsAsync,
    //
    getLocation,
    location,
    locationErrorMsg,
  };

  useEffect(() => {
    // const firstInit = async () => {
    //   simpleLogger('first init in context');
    //   try {
    //     const initialData = await getData('yourData');
    //     // if (!initialData) {
    //     //   simpleLogger('no data in initial data');
    //     //   return;
    //     // }
    //     simpleLogger('Store initial data: ', initialData);
    //     setState({ ...initialData });
    //   } catch (e) {
    //     simpleLogger(e);
    //   }
    // };
    // hardReset(); // THIS IS THE DOOMSDAY SWITCH!!!!! ENABLE IF ANYTHING GOES WRONG
    // firstInit();
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        simpleLogger(response);
      });
    const subscription = AppState.addEventListener(
      'change',
      _handleAppStateChange
    );
    // simpleLogger(notificationListener.current, responseListener.current);
    return () => {
      subscription.remove();
    };
  }, []);

  return <NNWSstore.Provider value={value}>{children}</NNWSstore.Provider>;
}

const useNNWSStore = () => {
  const context = useContext(NNWSstore);
  if (!context) {
    throw new Error('useNNWSStore must be used within a NNWSstoreProvider');
  }
  return context;
};

export { NNWSStoreProvider, useNNWSStore };
