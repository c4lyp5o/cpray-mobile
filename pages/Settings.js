import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Box, Button, Text, Stack, HStack, Radio } from 'native-base';

import Loading from '../components/Loading';
// import FetchService from '../components/Fetch';
// import NotificationService from '../components/Notifications';
// import LocationService from '../components/Location';
import FetchService from '../modules/Fetch';
import NotificationService from '../modules/Notifications';
import LocationService from '../modules/Location';

import { useNNWSStore } from '../lib/Context';
import { getData, hardReset } from '../lib/Helper';
import simpleLogger from '../lib/Logger';
import ToastService from '../lib/Toast';

export default function Settings() {
  const { turnOffNotifications, turnOnNotifications } = useNNWSStore();
  const { showToast } = ToastService();
  const [tempZone, setTempZone] = useState(null);
  const [settings, setSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  const setSoundSettings = async (value) => {
    setSettings(value);
    if (value === 'on') {
      await turnOnNotifications();
      showToast('Notifications turned on!');
    } else {
      await turnOffNotifications();
      showToast('Notifications turned off!');
    }
  };

  const harderReset = async () => {
    setSettings('off');
    setTempZone(null);
    await hardReset();
    await turnOffNotifications(settings);
    showToast('Settings reset!');
  };

  const getSettings = async () => {
    try {
      const dataStore = await getData('yourSettings');
      const zoneStore = await getData('yourZone');
      if (!zoneStore) {
        setSettings('off');
        setTempZone(null);
      } else {
        setSettings(dataStore);
        setTempZone(zoneStore);
      }
    } catch (error) {
      simpleLogger('SETTINGS', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      simpleLogger('SETTINGS', 'In focus');
      getSettings();
      return () => {
        simpleLogger('SETTINGS', 'Not in focus');
        getSettings();
      };
    }, [])
  );

  useEffect(() => {
    getSettings();
    return () => {};
  }, [settings]);

  if (loading) return <Loading />;

  return (
    <Box alignItems='center' w='full'>
      <Box
        w='90%'
        mt={3}
        rounded='lg'
        overflow='hidden'
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
        <Stack p='4' space={3}>
          <Stack space={2} marginTop='2'>
            <HStack space={6}>
              <Text
                fontWeight='bold'
                fontSize='lg'
                color='gray.800'
                _dark={{
                  color: 'gray.400',
                }}
              >
                Play the azan
              </Text>
              <Box position='relative' left='100%'>
                <Radio.Group
                  name='soundSettings'
                  value={settings}
                  onChange={(value) => setSoundSettings(value)}
                  accessibilityLabel='enable/disable sound'
                >
                  <HStack space={4} w='100%' maxW='300px'>
                    <Radio
                      value='on'
                      size='sm'
                      my={1}
                      isDisabled={tempZone ? false : true}
                    >
                      On
                    </Radio>
                    <Radio value='off' size='sm' my={1}>
                      Off
                    </Radio>
                  </HStack>
                </Radio.Group>
              </Box>
            </HStack>
            <HStack space={6} marginTop='5'>
              <Text
                fontWeight='bold'
                fontSize='lg'
                color='gray.800'
                _dark={{
                  color: 'gray.400',
                }}
              >
                Reset timezone
              </Text>
              <Button
                colorScheme='secondary'
                position='relative'
                left='31%'
                size='sm'
                color='gray.600'
                _dark={{
                  color: 'gray.400',
                }}
                onPress={harderReset}
              >
                Reset
              </Button>
            </HStack>
          </Stack>
        </Stack>
      </Box>
      {/* <Box
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
        <FetchService />
        <NotificationService />
        <LocationService />
      </Box> */}
      <StatusBar style='light' />
    </Box>
  );
}
