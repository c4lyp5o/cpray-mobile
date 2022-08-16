import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
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
    <Box margin='2'>
      <Button onPress={getLocation} shadow={2}>
        Get Location
      </Button>
      <Box alignItems='center' justifyContent='center'>
        <Text style={styles.textContainer}>{text}</Text>
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
    marginVertical: 5,
  },
  textContainer: {
    margin: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
});
