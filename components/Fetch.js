import { useEffect } from 'react';
import { Text, Box, Button } from 'native-base';
import { useNNWSStore } from '../lib/Context';
import simpleLogger from '../lib/Logger';

export default function FetchService() {
  const {
    BACKGROUND_FETCH_TASK,
    registerBackgroundFetchAsyncTest,
    unregisterBackgroundFetchAsyncTest,
    checkBackgroundFetchStatusAsync,
    bgIsRegistered,
    bgFetchStatus,
  } = useNNWSStore();

  const createTestBackgroundFetchTask = async () => {
    try {
      await registerBackgroundFetchAsyncTest();
      await checkBackgroundFetchStatusAsync();
    } catch (error) {
      simpleLogger('FETCH', error);
    }
  };

  const unregisterBackgroundFetchTask = async () => {
    try {
      await unregisterBackgroundFetchAsyncTest();
    } catch (error) {
      simpleLogger('FETCH', error);
    }
  };

  useEffect(() => {
    checkBackgroundFetchStatusAsync();
  }, [bgIsRegistered]);

  return (
    <Box mt={2} width='90%'>
      <Text textAlign='center' fontSize='xs'>
        Background fetch status: <Text fontSize='xs'>{bgFetchStatus}</Text>
      </Text>
      <Text textAlign='center' fontSize='xs'>
        Background fetch task name:{' '}
        <Text fontSize='xs'>
          {bgIsRegistered ? BACKGROUND_FETCH_TASK : 'Not registered yet!'}
        </Text>
      </Text>
      <Button
        width='100%'
        shadow='2'
        onPress={createTestBackgroundFetchTask}
        size='xs'
        mt={2}
      >
        Test BG Fetch (1 min)
      </Button>
      <Button
        width='100%'
        shadow='2'
        onPress={unregisterBackgroundFetchTask}
        size='xs'
        mt={2}
      >
        Unregister BG Fetch
      </Button>
    </Box>
  );
}
