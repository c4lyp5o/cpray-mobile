import { useState, useEffect, useCallback, createContext } from 'react';
// import { StyleSheet, Text, View, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const FetchContext = createContext();

const BACKGROUND_FETCH_TASK = 'background-azan-setter';

// TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
//   const now = Date.now();

//   const backendData = await fetch(
//     'https://api.waktusolat.me/waktusolat/today/kdh01'
//   ).then((res) => res.json());
//   console.log('myTask() ', backendData);

//   console.log(
//     `Got background fetch call at date: ${new Date(now).toISOString()}`
//   );
//   setStateFn(backendData);

//   // Be sure to return the successful result type!
//   return backendData
//     ? BackgroundFetch.BackgroundFetchResult.NewData
//     : BackgroundFetch.BackgroundFetchResult.NoData;
// });

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  console.log('running task');
  // const BTzoneData = await getData('yourZone');
  // await fetchTimes(BTzoneData);
  // const BTtempDataA = await getData('yourTimes');
  // const BTtempDataB = await getTimeDifference(BTtempDataA);
  // const BTnotifTempData = await checkNotificationStatus();
  // if (BTnotifTempData < 1) {
  //   if (BTtempDataB > 9) {
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

  return BTtempDataB
    ? BackgroundFetch.BackgroundFetchResult.NewData
    : BackgroundFetch.BackgroundFetchResult.NoData;
});

let setStateFn = () => {
  console.log('State not yet initialized');
};

function FetchService({ children }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [status, setStatus] = useState(null);
  const [state, setState] = useState(null);
  setStateFn = setState;

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

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK
    );
    setStatus(status);
    setIsRegistered(isRegistered);
    console.log('status', status);
    console.log('isRegistered', isRegistered);
  };

  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }

    checkStatusAsync();
  };

  async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 1, // 4 hours
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

  useFocusEffect(
    useCallback(() => {
      console.log('---------this is fetch service------------');
      checkStatusAsync();
    })
  );

  useEffect(() => {
    checkStatusAsync();
  }, []);

  return (
    <FetchContext.Provider
      value={{
        BACKGROUND_FETCH_TASK,
        BackgroundFetch,
        TaskManager,
        status,
        setStatus,
        isRegistered,
        setIsRegistered,
        state,
        setState,
        registerBackgroundFetchAsync,
        unregisterBackgroundFetchAsync,
        checkStatusAsync,
        checkNotificationStatus,
        toggleFetchTask,
        fetchTimes,
      }}
    >
      {children}
    </FetchContext.Provider>
  );
}

export { FetchService, FetchContext };

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   button: {
//     padding: 1,
//     marginVertical: 1,
//   },
//   textContainer: {
//     margin: 1,
//   },
//   boldText: {
//     fontWeight: 'bold',
//   },
// });
