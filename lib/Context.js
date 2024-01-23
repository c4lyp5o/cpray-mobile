import React, { useState, useContext, useRef, useEffect } from 'react';
import { useToast } from 'native-base';
import { AppState } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { getData, storeData, getTimeDifference, log } from '../lib/Helper';

const NNWSstore = React.createContext();

const BACKGROUND_FETCH_TASK = 'NNWS-azan-setter';
const BACKGROUND_FETCH_TASK_TEST = 'NNWS-azan-setter-test';

TaskManager.defineTask(BACKGROUND_FETCH_TASK_TEST, async () => {
  if (new Date().getHours() > 5) {
    console.log(
      'CONTEXT: Not the time to run background task. Time now is',
      new Date().getHours() + ':' + new Date().getMinutes()
    );
    return BackgroundFetch.BackgroundFetchResult.NoData;
  }
  try {
    console.log('running task at ', new Date().toISOString());
    const BTzoneData = await getData('yourZone');
    await fetchTimes(BTzoneData); // saved to storage thats why no return
    const BTtempDataA = await getData('yourTimes');
    const BTtempDataB = await getTimeDifference(BTtempDataA);
    // const BTnotifTempData = await checkNotificationStatus();
    // console.log(BTtempDataA, BTtempDataB, BTnotifTempData);
    // if (BTnotifTempData < 1) {
    //   if (BTtempDataB > 9) {
    //     console.log('BTtempDataB > 9');
    //     try {
    //       let timers = [];
    //       Object.entries(BTtempDataB.solatETA).map((item) => {
    //         timers = [...timers, item[0], Math.round(item[1] / 1000)];
    //       });
    //       for (let i = 0; i < timers.length; i += 2) {
    //         await schedulePushNotification(timers[i], timers[i + 1]);
    //       }
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    //   console.log('notif is < 1 but BTtempDataB is < 9');
    // } else {
    //   console.log('notif is > 0');
    // }
    console.log('CONTEXT: deleting all push notification');
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
    console.log(error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log('CONTEXT', 'background task started');
    const BTnotifTempData = await checkNotificationStatus();
    console.log('CONTEXT', `BTnotifTempData ${BTnotifTempData.length}`);

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (currentHour > 5) {
      console.log(
        'CONTEXT',
        `Not the time to run background task. Time now is ${currentHour}:${currentMinute}`
      );
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    console.log('CONTEXT', `running task at ${now.toISOString()}`);
    const BTzoneData = await getData('yourZone');
    await fetchTimes(BTzoneData);
    const BTtempDataA = await getData('yourTimes');
    const BTtempDataB = await getTimeDifference(BTtempDataA);
    console.log('CONTEXT', 'deleting all push notification');
    await cancelAllScheduledNotificationsAsync();

    const timers = Object.entries(BTtempDataB.solatETA).reduce((acc, item) => {
      return [...acc, item[0], Math.round(item[1] / 1000)];
    }, []);
    console.log('CONTEXT', `timers are ${timers}`);

    const notifications = timers.map((timer, i) => {
      if (i % 2 === 0) {
        return schedulePushNotification(timer, timers[i + 1]);
      }
    });

    await Promise.all(notifications);

    console.log('CONTEXT', 'background task finished');
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.log('CONTEXT', `error ${error}`);
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
    storeData('yourTimes', json);
  } catch (error) {
    console.error(error);
  }
};

async function schedulePushNotification(waktu, ttt) {
  console.log('CONTEXT: scheduling push notification');
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
  console.log('CONTEXT: cancelling all scheduled notifications');
  await Notifications.cancelAllScheduledNotificationsAsync();
}

async function checkNotificationStatus() {
  try {
    const scheduledOnes =
      await Notifications.getAllScheduledNotificationsAsync();
    return scheduledOnes;
  } catch (error) {
    console.log(error);
  }
}

function NNWSStoreProvider({ children }) {
  const toast = useToast();
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
      console.log('CONTEXT: App has come to the foreground!');
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('CONTEXT: App is', appState.current);
  };

  // BG FETCH STUFF
  async function registerBackgroundFetchAsync() {
    console.log(`CONTEXT: ${BACKGROUND_FETCH_TASK} REGISTERED`);
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 60, // this is 1 hours!
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }

  async function unregisterBackgroundFetchAsync() {
    console.log(`CONTEXT: ${BACKGROUND_FETCH_TASK} UNREGISTERED`);
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
  }

  const checkBackgroundFetchStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const intepret = await BackgroundFetch.BackgroundFetchStatus[status];
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    setBgIsRegistered(isRegistered);
    setBgFetchStatus(intepret);
    console.log('CONTEXT: Background fetch status:', status);
    console.log('CONTEXT: Background fetch running', isRegistered);
  };

  async function registerBackgroundFetchAsyncTest() {
    console.log(`CONTEXT: ${BACKGROUND_FETCH_TASK_TEST} REGISTERED`);
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK_TEST, {
      minimumInterval: 60 * 60, // this is 4 hours!
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }

  async function unregisterBackgroundFetchAsyncTest() {
    console.log(`CONTEXT: ${BACKGROUND_FETCH_TASK_TEST} UNREGISTERED`);
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK_TEST);
  }

  // NOTIFICATION STUFF
  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('NNWS', {
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
          usage: Notifications.AndroidAudioUsage.NOTIFICATION_RINGTONE,
          sound: true,
          playInForeground: true,
        },
      });
    }
    console.log('CONTEXT: registered notification channel');
  }

  async function checkNotificationStatus() {
    try {
      const scheduledOnes =
        await Notifications.getAllScheduledNotificationsAsync();
      if (scheduledOnes.length > 0) {
        // console.log('scheduled notifications', scheduledOnes);
        return scheduledOnes;
      } else {
        console.log('CONTEXT: no scheduled notifications');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function scheduleTestPushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Masuk Waktu',
        body: 'Hayya alassolah',
        data: { data: 'supposed to ada sound lah' },
      },
      trigger: { channelId: 'azan-app', seconds: 5 },
    });
  }

  async function cancelAllScheduledNotificationsAsync() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  const fetchTimes = async (zone) => {
    console.log('CONTEXT: inner fetchtime got zone:', zone);
    try {
      console.log('CONTEXT: Fetching data in bg');
      const data = await fetch(
        `https://api.waktusolat.me/waktusolat/today/${zone}`
      );
      const json = await data.json();
      await storeData('bgTimesData', json);
    } catch (e) {
      console.log(e);
    }
  };

  // NOTIFICATION SWITCH
  async function turnOffNotifications(currentSettings) {
    if (currentSettings.toLowerCase() === 'off') {
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
      toast.show({
        description: 'Notifications disabled',
      });
    } catch (error) {
      console.error(error);
      toast.show({
        description: 'An error occurred while disabling notifications',
      });
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

      const tempA = await bgTimesDataPromise;
      const tempB = await getTimeDifference(tempA);

      const timers = Object.entries(tempB.solatETA).reduce((acc, item) => {
        return [...acc, item[0], Math.round(item[1] / 1000)];
      }, []);

      console.log('CONTEXT: timers', timers);

      const notifications = timers.map((timer, i) => {
        if (i % 2 === 0) {
          return schedulePushNotification(timer, timers[i + 1]);
        }
      });

      await Promise.all(notifications);

      toast.show({
        description: 'Notifications enabled',
      });

      await checkBackgroundFetchStatusAsync();
    } catch (error) {
      console.log(error);
      throw error; // re-throw the error after logging it
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
    toast,
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
    const firstInit = async () => {
      console.log('first init in context');
      try {
        const initialData = await getData('yourData');
        // if (!initialData) {
        //   console.log('no data in initial data');
        //   return;
        // }
        console.log('Store initial data: ', initialData);
        setState({ ...initialData });
      } catch (e) {
        console.log(e);
      }
    };
    // hardReset(); // THIS IS THE DOOMSDAY SWITCH!!!!! ENABLE IF ANYTHING GOES WRONG
    // firstInit();
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    const subscription = AppState.addEventListener(
      'change',
      _handleAppStateChange
    );
    // console.log(notificationListener.current, responseListener.current);
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
