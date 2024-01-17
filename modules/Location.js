import React, { useState, useEffect } from 'react';
import { Box, Text, Button } from 'native-base';
import * as Location from 'expo-location';

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

  useEffect(() => {
    // (async () => {
    //   let { status } = await Location.requestForegroundPermissionsAsync();
    //   if (status !== 'granted') {
    //     setErrorMsg('Permission to access location was denied');
    //     return;
    //   }
    //   let location = await Location.getCurrentPositionAsync({});
    //   setLocation(location);
    // })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <Box w='90%' mb={4}>
      <Button width='100%' onPress={getLocation} shadow={2}>
        Get Location
      </Button>
      <Text textAlign='center' mt={2} fontSize='xs'>
        {text}
      </Text>
    </Box>
  );
}
