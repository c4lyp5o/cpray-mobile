import { useState, useEffect, useCallback } from 'react';
import { Text, Box } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

export default function FetchService({ backgroundFetchTask }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [status, setStatus] = useState(null);

  // useFocusEffect(
  //   useCallback(() => {
  //     console.log('---------this is fetch service------------');
  //     checkStatusAsync();
  //   })
  // );

  useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(
      backgroundFetchTask
    );
    setStatus(status);
    setIsRegistered(isRegistered);
    console.log('Background fetch status:', status);
    console.log('Is fetch registered', isRegistered);
  };

  return (
    <Box mt={5}>
      <Text>
        Background fetch status:{' '}
        <Text>{status && BackgroundFetch.BackgroundFetchStatus[status]}</Text>
      </Text>
      <Text>
        Background fetch task name:{' '}
        <Text>
          {isRegistered ? backgroundFetchTask : 'Not registered yet!'}
        </Text>
      </Text>
    </Box>
  );
}
