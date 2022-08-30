import { useEffect } from 'react';
import { Text, Box, Button } from 'native-base';
import { useNNWSStore } from '../lib/Context';

export default function FetchService() {
  const {
    BACKGROUND_FETCH_TASK,
    registerBackgroundFetchAsyncTest,
    unregisterBackgroundFetchAsyncTest,
    checkBackgroundFetchStatusAsync,
    bgIsRegistered,
    bgFetchStatus,
  } = useNNWSStore();

  useEffect(() => {
    checkBackgroundFetchStatusAsync();
  }, [bgIsRegistered]);

  return (
    <Box mt={2}>
      <Text fontSize='xs'>
        Background fetch status: <Text fontSize='xs'>{bgFetchStatus}</Text>
      </Text>
      <Text fontSize='xs'>
        Background fetch task name:{' '}
        <Text fontSize='xs'>
          {bgIsRegistered ? BACKGROUND_FETCH_TASK : 'Not registered yet!'}
        </Text>
      </Text>
      <Button
        shadow='2'
        onPress={async () => {
          await registerBackgroundFetchAsyncTest();
          await checkBackgroundFetchStatusAsync();
        }}
        size='xs'
        mt={1}
      >
        Test BG Fetch (1 min)
      </Button>
      <Button
        shadow='2'
        onPress={async () => {
          await unregisterBackgroundFetchAsyncTest();
          await checkBackgroundFetchStatusAsync();
        }}
        size='xs'
        mt={1}
      >
        Unregister BG Fetch
      </Button>
    </Box>
  );
}
