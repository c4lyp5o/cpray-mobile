import { Box, Text, Button } from 'native-base';
import { useNNWSStore } from '../lib/Context';

export default function LocationService() {
  const { getLocation, location, locationErrorMsg, appStateVisible } =
    useNNWSStore();

  return (
    <Box w='90%' mb={4}>
      <Button width='100%' onPress={getLocation} shadow={2} size='xs'>
        Get Location
      </Button>
      <Text textAlign='center' mt={2} fontSize='xs'>
        Location data:{' '}
        {location
          ? JSON.stringify(location)
          : `${locationErrorMsg ? locationErrorMsg : 'Not data yet'}`}
      </Text>
      <Text textAlign='center' fontSize='xs'>
        Current state is: {appStateVisible}
      </Text>
    </Box>
  );
}
