// import LocationService from '../components/Location';
// import NotificationService from '../components/Notifications';
// import BackgroundFetchService from '../components/Fetch';
import { useContext } from 'react';
import { StyleSheet, Text, Box, Button } from 'react-native';
import { FetchContext } from '../components/Fetch';

export default function Devpage() {
  const {
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
  } = useContext(FetchContext);
  return (
    <Box
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
      safeArea
    >
      {/* <BackgroundFetchService />
      <NotificationService />
      <LocationService /> */}
      <Box>
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
      </Box>
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
