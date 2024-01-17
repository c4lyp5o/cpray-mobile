import { useState, useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Text, Box, Button } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_FETCH_TASK = 'background-azan-setter';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = Date.now();

  let backendData;
  try {
    const response = await fetch(
      'https://api.waktusolat.me/waktusolat/today/kdh01'
    );
    backendData = await response.json();
  } catch (error) {
    console.log('Error fetching data:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }

  console.log('myTask() ', backendData);
  console.log(
    'Got background fetch call at date:',
    new Date(now).toISOString()
  );

  setStateFn(backendData);

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
    try {
      const status = await BackgroundFetch.getStatusAsync();
      const isRegistered = await TaskManager.isTaskRegisteredAsync(
        BACKGROUND_FETCH_TASK
      );
      setStatus(status);
      setIsRegistered(isRegistered);
      console.log('status', status);
      console.log('isRegistered', isRegistered);
    } catch (error) {
      console.error('Error in checkStatusAsync:', error);
    }
  };

  const toggleFetchTask = async () => {
    await checkStatusAsync();

    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }
  };

  async function registerBackgroundFetchAsync() {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 4, // 4 hours
        stopOnTerminate: false, // android only,
        startOnBoot: true, // android only
      });
      console.log(
        'Background fetch registered successfully',
        BACKGROUND_FETCH_TASK
      );
    } catch (error) {
      console.error('Error registering background fetch:', error);
    }
  }

  async function unregisterBackgroundFetchAsync() {
    try {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
      console.log(
        'Background fetch unregistered successfully',
        BACKGROUND_FETCH_TASK
      );
    } catch (error) {
      console.error('Error unregistering background fetch:', error);
    }
  }

  return (
    <Box mt={2} width='90%'>
      <Text textAlign='center' fontSize='xs'>
        Background fetch status:{' '}
        <Text style={styles.boldText}>
          {status ? BackgroundFetch.BackgroundFetchStatus[status] : 'Unknown'}
        </Text>
      </Text>
      <Text textAlign='center' fontSize='xs'>
        Background fetch task name:{' '}
        <Text style={styles.boldText}>
          {isRegistered ? BACKGROUND_FETCH_TASK : 'Not registered yet!'}
        </Text>
      </Text>
      <Text textAlign='center' fontSize='xs'>
        Background fetch data:{' '}
        <Text textAlign='center' fontSize='xs'>
          {state ? state : 'No data yet!'}
        </Text>
      </Text>
      <Button width='100%' shadow='2' mt={2} onPress={toggleFetchTask}>
        {isRegistered
          ? 'Unregister BackgroundFetch task'
          : 'Register BackgroundFetch task'}
      </Button>
    </Box>
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
