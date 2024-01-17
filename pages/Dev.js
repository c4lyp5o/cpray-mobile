import BackgroundFetchService from '../components/Fetch';
import NotificationService from '../components/Notifications';
import LocationService from '../components/Location';
import { StatusBar } from 'expo-status-bar';
import { Box } from 'native-base';

export default function Devpage() {
  return (
    <Box alignItems='center' w='full'>
      <Box
        w='90%'
        mt={3}
        rounded='lg'
        overflow='hidden'
        alignContent='center'
        justifyContent='center'
        alignItems='center'
        borderColor='coolGray.200'
        borderWidth='1'
        _dark={{
          borderColor: 'coolGray.600',
          backgroundColor: 'gray.700',
        }}
        _web={{
          shadow: 2,
          borderWidth: 0,
        }}
        _light={{
          backgroundColor: 'gray.50',
        }}
      >
        {/* Development Tools */}
        <BackgroundFetchService />
        <NotificationService />
        <LocationService />
        {/* Development Tools */}
      </Box>
      <StatusBar style='light' />
    </Box>
  );
}
