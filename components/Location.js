import { useState } from 'react';
import * as Location from 'expo-location';
import { Box, Text, Button } from 'native-base';

export default function LocationService() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  return (
    <Box w='90%'>
      <Box>
        <Button onPress={getLocation} shadow={2}>
          Get Location
        </Button>
      </Box>
      <Box marginTop={2} alignItems='center' justifyContent='center'>
        <Text>{location ? JSON.stringify(location) : errorMsg}</Text>
      </Box>
    </Box>
  );
}
