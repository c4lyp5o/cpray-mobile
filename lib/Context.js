import React, { useState, useContext, useRef, useEffect } from 'react';
import { Toast, useToast } from 'native-base';
import { AppState } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import {
  getData,
  storeData,
  hardReset,
  getTimeDifference,
} from '../lib/Helper';

const NNWSstore = React.createContext();

const BACKGROUND_FETCH_TASK = 'NNWS-azan-setter';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  console.log('running task at ', new Date().toISOString());
  const fetchTimes = async (zone) => {
    // fetch(`https://api.waktusolat.me/waktusolat/today/${zone}`)
    //   .then((response) => response.json())
    //   .then((json) => {
    //     storeData('yourTimes', json);
    //   });
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
  const BTzoneData = await getData('yourZone');
  await fetchTimes(BTzoneData);
  const BTtempDataA = await getData('yourTimes');
  const BTtempDataB = await getTimeDifference(BTtempDataA);
  const BTnotifTempData = await checkNotificationStatus();
  console.log(BTtempDataA, BTtempDataB, BTnotifTempData);
  if (BTnotifTempData < 1) {
    if (BTtempDataB > 9) {
      console.log('BTtempDataB > 9');
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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function NNWSStoreProvider({ children }) {
  const toast = useToast();
  // STATES
  const [state, setState] = useState({
    yourZone: '',
    yourSettings: 'off',
    yourTimes: '',
    yourTime: new Date(),
    dataSaving: false,
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
    console.log('BACKGROUND TASK REGISTERED');
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 4, // this is 4 hours!
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }
  async function unregisterBackgroundFetchAsync() {
    console.log('BACKGROUND TASK UNREGISTERED');
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
    console.log('Background fetch status:', status);
    console.log('Background fetch running', isRegistered);
    console.log(intepret);
  };
  async function registerBackgroundFetchAsyncTest() {
    console.log('BACKGROUND TASK REGISTERED');
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 1, // this is 4 hours!
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }
  // NOTIFICATION STUFF
  async function schedulePushNotification(waktu, ttt) {
    console.log('scheduling push notification');
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Masuk Waktu ${waktu}`,
        body: 'Hayya alassolah',
        data: { data: `Masuk Waktu ${waktu}` },
      },
      trigger: { channelId: 'NNWS', seconds: ttt },
    });
  }
  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('NNWS', {
        name: 'NNWS',
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
    const scheduledOnes =
      await Notifications.getAllScheduledNotificationsAsync();
    if (scheduledOnes.length > 0) {
      console.log('scheduled notifications', scheduledOnes);
      return scheduledOnes;
    } else {
      console.log('no scheduled notifications');
    }
  }
  async function turnOffNotifications(currentSettings) {
    if (currentSettings === 'off') {
      return true;
    }
    try {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      const tempData = await getData('yourData');
      await storeData('yourData', { ...tempData, yourSettings: 'off' });
      // await storeData('yourSettings', 'off');
      await unregisterBackgroundFetchAsync();
      await cancelAllScheduledNotificationsAsync();
      toast.show({
        description: 'Notifications disabled',
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function turnOnNotifications() {
    try {
      // const tempData = await getData('yourData');
      // await storeData('yourData', { ...tempData, yourSettings: 'on' });
      await storeData('yourSettings', 'on');
      // await registerBackgroundFetchAsync();
      // await Notifications.requestPermissionsAsync();
      // await registerForPushNotificationsAsync();
      const zoneData = await getData('yourZone');
      // console.log(zoneData);
      await fetchTimes(zoneData);
      const tempA = await getData('bgTimesData');
      const tempB = await getTimeDifference(tempA);
      let timers = [];
      Object.entries(tempB.solatETA).map((item) => {
        timers = [...timers, item[0], Math.round(item[1] / 1000)];
      });
      console.log('timers', timers);
      for (let i = 0; i < timers.length; i += 2) {
        await schedulePushNotification(timers[i], timers[i + 1]);
      }
      toast.show({
        description: 'Notifications enabled',
      });
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
    console.log(zone);
    try {
      console.log('Fetching data in bg');
      const data = await fetch(
        `https://api.waktusolat.me/waktusolat/today/${zone}`
      );
      const json = await data.json();
      // console.log(json);
      await storeData('bgTimesData', json);
      // setState({ ...state, yourTimes: json });
      // tempTimesData.current = json;
      // const tempRemind = await timeReminder(json);
      // tempReminderData.current = tempRemind;
      // setTimeout(() => {
      //   setTimesLoading(false);
      // }, 1000);
      return;
    } catch (e) {
      console.log(e);
      // setTimesError(e);
    }
  };
  // LOCATION STUFF
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLocationErrorMsg('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
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
    registerBackgroundFetchAsync,
    registerBackgroundFetchAsyncTest,
    unregisterBackgroundFetchAsync,
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
      // await hardReset(); // THIS IS THE DOOMSDAY SWITCH!!!!! ENABLE IF ANYTHING GOES WRONG
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
    // hardReset();
    // firstInit();
    // start listening
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
