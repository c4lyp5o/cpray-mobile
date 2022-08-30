import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import {
  Box,
  Button,
  Text,
  Stack,
  HStack,
  Radio,
  Spinner,
  useToast,
} from 'native-base';
import { useNNWSStore } from '../lib/Context';
import FetchService from '../components/Fetch';
import NotificationService from '../components/Notifications';
import LocationService from '../components/Location';
import { getData, hardReset } from '../lib/Helper';

export default function Settings() {
  const { turnOffNotifications, turnOnNotifications, toast } = useNNWSStore();
  const [tempZone, setTempZone] = useState(null);
  const [settings, setSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  async function harderReset() {
    setSettings('off');
    setTempZone(null);
    await hardReset();
    await turnOffNotifications(settings);
    toast.show({
      description: 'Waktu solat telah direset',
    });
  }

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
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log('SETTINGS: in focus');
      getSettings().then(() => {
        // setTempZone(state.yourZone);
        setLoading(false);
      });
      return () => {
        console.log('SETTINGS: not in focus');
        getSettings().then(() => {
          // setTempZone(state.yourZone);
          setLoading(false);
        });
      };
    }, [])
  );

  useEffect(() => {
    getSettings()
      // .then(() => {
      //   setTempZone(state.yourZone);
      // })
      .then(() => {
        setLoading(false);
      });
    // forceRerender();
    return () => {};
  }, [settings]);

  if (loading) {
    return (
      <Box
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spinner size='lg' color='violet.500' />
      </Box>
    );
  }

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
                  defaultValue={settings}
                  value={settings}
                  onChange={async (value) => {
                    setSettings(value);
                    if (value === 'on') {
                      await turnOnNotifications();
                    } else {
                      await turnOffNotifications();
                    }
                  }}
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
                onPress={async () => {
                  await harderReset();
                }}
              >
                Reset
              </Button>
            </HStack>
          </Stack>
        </Stack>
      </Box>
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
        <FetchService />
        <NotificationService />
        <LocationService />
        {/* Development Tools */}
      </Box>
      <StatusBar style='light' />
    </Box>
  );
}
