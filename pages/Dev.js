import LocationService from '../components/Location';
import NotificationService from '../components/Notifications';
import BackgroundFetchService from '../components/Fetch';
import { Box } from 'native-base';

export default function Devpage() {
  return (
    <Box
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
      safeArea
    >
      <BackgroundFetchService />
      <NotificationService />
      <LocationService />
    </Box>
  );
}
