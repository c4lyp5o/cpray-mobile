import { Box, Text, Button } from 'native-base';
import { useNNWSStore } from '../lib/Context';

export default function LocationService() {
  const { getLocation, location, locationErrorMsg, appStateVisible } =
    useNNWSStore();
  return (
    <Box w='90%'>
      <Box>
        <Button onPress={getLocation} shadow={2} size='xs'>
          Get Location
        </Button>
      </Box>
      <Box marginTop={2} alignItems='center' justifyContent='center'>
        <Text fontSize='xs'>
          Location data:{' '}
          {location
            ? JSON.stringify(location)
            : `${locationErrorMsg ? locationErrorMsg : 'Not data yet'}`}
        </Text>
      </Box>
      <Box marginBottom={2} alignItems='center' justifyContent='center'>
        <Text fontSize='xs'>Current state is: {appStateVisible}</Text>
      </Box>
    </Box>
  );
}
