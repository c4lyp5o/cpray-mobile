import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_FETCH_TASK = 'background-azan-setter';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  const backendData = await fetch(
    'https://api.waktusolat.me/waktusolat/today/kdh01'
  ).then((res) => res.json());
  console.log('myTask() ', backendData);

  console.log(
    `Got background fetch call at date: ${new Date(now).toISOString()}`
  );
  setStateFn(backendData);

  // Be sure to return the successful result type!
  return backendData
    ? BackgroundFetch.BackgroundFetchResult.NewData
    : BackgroundFetch.BackgroundFetchResult.NoData;
});

let setStateFn = () => {
  console.log('State not yet initialized');
};

export default function FetchService() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [status, setStatus] = useState(null);
  const [state, setState] = useState(null);
  setStateFn = setState;

  useFocusEffect(
    useCallback(() => {
      console.log('---------this is fetch service------------');
      checkStatusAsync();
    })
  );

  useEffect(() => {
    checkStatusAsync();
  }, []);

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
      minimumInterval: 60 * 4, // 4 hours
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
  }

  async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
  }

  return (
    <View>
      <Text>
        Background fetch status:{' '}
        <Text style={styles.boldText}>
          {status && BackgroundFetch.BackgroundFetchStatus[status]}
        </Text>
      </Text>
      <Text>
        Background fetch task name:{' '}
        <Text style={styles.boldText}>
          {isRegistered ? BACKGROUND_FETCH_TASK : 'Not registered yet!'}
        </Text>
      </Text>
      <Text>
        Background fetch data:{' '}
        {/* <Text style={styles.boldText}>{state ? state : 'No data yet!'}</Text> */}
      </Text>
      <Button
        title={
          isRegistered
            ? 'Unregister BackgroundFetch task'
            : 'Register BackgroundFetch task'
        }
        onPress={toggleFetchTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 1,
    marginVertical: 1,
  },
  textContainer: {
    margin: 1,
  },
  boldText: {
    fontWeight: 'bold',
  },
});
