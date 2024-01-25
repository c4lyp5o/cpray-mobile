import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Box,
  Center,
  Text,
  AspectRatio,
  Image,
  HStack,
  Stack,
  Heading,
  Flex,
} from 'native-base';
import { useNNWSStore } from '../lib/Context';
import { getProfile } from '../lib/Profile';
import { getData, storeData, timeReminder } from '../lib/Helper';
import simpleLogger from '../lib/Logger';

import Loading from './Loading';
import Error from './Error';

export default function Prayertimes({ setLoading, setShowZonePicker }) {
  const { setState, state } = useNNWSStore();
  const refZone = useRef(null);
  const tempReminderData = useRef();
  const tempTimesData = useRef();
  const counter = useRef(1);
  const [timesError, setTimesError] = useState(null);
  const [timesLoading, setTimesLoading] = useState(true);
  const [retry, setRetry] = useState(false);

  const retryFetch = async () => {
    setTimesLoading(true);
    setTimesError(null);
    setRetry(true);
  };

  function formatTime(timeString) {
    try {
      const [hours, minutes] = timeString.split(':');
      return `${parseInt(hours)}:${minutes}`;
    } catch (error) {
      simpleLogger('PRAYERTIMES', error);
    }
  }

  function formatETA(hours, minutes) {
    try {
      if (hours === 0) {
        return `${minutes} minit`;
      } else {
        return `${hours} jam ${minutes} minit`;
      }
    } catch (error) {
      simpleLogger('PRAYERTIMES', error);
    }
  }

  const fetchTimes = async () => {
    try {
      simpleLogger('PRAYERTIMES', 'Fetching times in fg');
      const data = await fetch(
        `https://api.waktusolat.me/waktusolat/today/${state.yourZone}`
      );
      const json = await data.json();
      await storeData('bgTimesData', json);
      refZone.current = state.yourZone;
      setState((prevState) => ({ ...prevState, yourTimes: json }));
      tempTimesData.current = json;
      const tempRemind = await timeReminder(json);
      setState((prevState) => ({ ...prevState, yourReminder: tempRemind }));
      tempReminderData.current = tempRemind;
    } catch (error) {
      simpleLogger('PRAYERTIMES', error);
      setTimesError(error);
    } finally {
      setTimeout(() => {
        setTimesLoading(false);
      }, 500);
      // setTimeout(() => {
      //   saveToStore();
      // }, 2000);
    }
  };

  // const cacheService = async () => {
  //   const timesData = await getData('yourTimes');
  //   if (timesData) {
  //     simpleLogger('Using stored times data');
  //     setTimesLoading(false);
  //   } else {
  //     simpleLogger('No times data');
  //     fetchTimes(); // saved to async storage
  //   }
  // };

  // const saveToStore = async () => {
  //   try {
  //     let testSave = {};
  //     testSave = { ...testSave, ...state };
  //     await storeData('yourData', testSave);
  //     // await storeData('yourZone', state.yourZone);
  //     await storeData('yourTimes', state.yourTimes);
  //   } catch (error) {
  //     simpleLogger('PRAYERTIMES', error);
  //   }
  // };

  const focusEffectService = async () => {
    try {
      const res = await getData('yourZone');
      simpleLogger('PRAYERTIMES', `focuseffect checking zone: ${res}`);
      if (!res) {
        setTimesLoading(true);
        setLoading(true);
        setShowZonePicker(true);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    } catch (error) {
      console.error('Error in focusEffectService:', error);
    } finally {
      intervalService();
    }
  };

  const intervalService = async () => {
    simpleLogger('PRAYERTIMES', 'interval service called');
    setState((prevState) => ({ ...prevState, yourTime: new Date() }));

    if (tempTimesData.current) {
      try {
        const timeReminderData = await timeReminder(tempTimesData.current);
        tempReminderData.current = timeReminderData;
      } catch (error) {
        simpleLogger('PRAYERTIMES', error);
      }
    } else {
      simpleLogger('PRAYERTIMES', 'tempTimesData.current is null');
    }
  };

  useEffect(() => {
    // cacheService();
    fetchTimes();
    const prevInt = setInterval(() => intervalService(), 60000);
    simpleLogger('PRAYERTIMES', `Prayertimes interval set to: ${prevInt}`);
    return () => {
      clearInterval(prevInt);
      simpleLogger(
        'PRAYERTIMES',
        `Prayertimes UNMOUNTED. Clearing interval: ${prevInt}`
      );
    };
  }, [retry]);

  // useEffect(() => {
  //   const saveAllData = async () => {
  //     let tempData = { ...state };
  //     await storeData('yourData', tempData);
  //     simpleLogger(tempData);
  //   };
  //   simpleLogger('times has changed');
  // }, [state.yourTimes]);

  // useFocusEffect(
  //   useCallback(() => {
  //     if (counter.current === 0) {
  //       return;
  //     }
  //     simpleLogger('PRAYERTIMES: Prayertimes IN FOCUS');
  //     focusEffectService();
  //     setTimeout(() => {
  //       intervalService();
  //     }, 500);
  //     return () => {
  //       simpleLogger('PRAYERTIMES: Prayertimes NOT IN FOCUS');
  //     };
  //   }, [])
  // );

  useFocusEffect(
    useCallback(() => {
      // if (counter.current === 1) {
      simpleLogger('PRAYERTIMES', `counter is ${counter.current}`);
      focusEffectService();
      // setTimeout(() => {
      //   intervalService();
      // }, 500);
      // }
      return () => {
        simpleLogger('PRAYERTIMES', 'NOT IN FOCUS');
      };
    }, [])
  );

  if (timesLoading) return <Loading />;

  if (timesError) return <Error func={retryFetch} />;

  // if (appState.current === 'active' && counter.current === 0) {
  //   simpleLogger(
  //     'PRAYERTIMES: from background, calling focusEffectService and intervalService'
  //   );
  //   focusEffectService();
  //   setTimeout(() => {
  //     intervalService();
  //   }, 500);
  //   counter.current += 1;
  // }

  // if (appState.current === 'background' && counter.current === 1) {
  //   counter.current = 0;
  // }

  return (
    <Box w='full'>
      <Box>
        <AspectRatio w='full' ratio={16 / 9}>
          <Image
            source={{
              uri: getProfile(state.yourZone).picture,
            }}
            alt='image'
          />
        </AspectRatio>
        <Center
          bg='violet.500'
          _dark={{
            bg: 'violet.400',
          }}
          _text={{
            color: 'warmGray.50',
            fontWeight: '700',
            fontSize: 'xs',
          }}
          position='absolute'
          bottom='0'
          px='3'
          py='1.5'
        >
          HAYYA'LASSOLAH
        </Center>
      </Box>
      <Stack p='4' space={3}>
        <Stack space={2}>
          <Heading size='md'>{state.yourTimes.zone}</Heading>
          <Text
            fontSize='md'
            _light={{
              color: 'violet.500',
            }}
            _dark={{
              color: 'violet.400',
            }}
            fontWeight='500'
            mt='-1'
          >
            {state.yourTimes.negeri}
          </Text>
          <Text
            fontSize='md'
            _light={{
              color: 'violet.500',
            }}
            _dark={{
              color: 'violet.400',
            }}
            fontWeight='500'
            mt='-1'
          >
            {state.yourTimes.today.day.split(' / ')[0]},{' '}
            {state.yourTimes.today.hijri.split(' / ')[1]},{' '}
            {state.yourTimes.today.date.split(' / ')[1]}
          </Text>
        </Stack>
        <Box alignItems='center'>
          <Box
            w='full'
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
            <Stack p='2'>
              <Heading size='2xl' textAlign='center'>
                {new Date().toLocaleTimeString('en-GB').slice(0, 5)}
              </Heading>
              <Text
                fontSize='md'
                textAlign='center'
                _light={{
                  color: 'violet.500',
                }}
                _dark={{
                  color: 'violet.400',
                }}
                fontWeight='500'
              >
                <Text textTransform={'capitalize'}>
                  {tempReminderData.current.nextSolat.name}
                </Text>{' '}
                akan masuk dalam{' '}
                {formatETA(
                  tempReminderData.current.nextSolat.hours,
                  tempReminderData.current.nextSolat.minutes
                )}
              </Text>
            </Stack>
          </Box>
        </Box>
        <Flex direction='column' alignItems='center'>
          <HStack space={3} justifyContent='center'>
            <Box
              mb={2}
              width='100px'
              height='80px'
              alignItems='center'
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
              <Stack p='4' space={1}>
                <Stack>
                  <Heading size='sm' textAlign='center'>
                    Subuh
                  </Heading>
                </Stack>
                <Text textAlign='center' fontWeight='400'>
                  {formatTime(state.yourTimes.data[0].fajr)}
                </Text>
              </Stack>
            </Box>
            <Box
              mb={2}
              width='100px'
              height='80px'
              alignItems='center'
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
              <Stack p='4' space={1}>
                <Stack>
                  <Heading size='sm' textAlign='center'>
                    Syuruk
                  </Heading>
                </Stack>
                <Text textAlign='center' fontWeight='400'>
                  {formatTime(state.yourTimes.data[0].syuruk)}
                </Text>
              </Stack>
            </Box>
            <Box
              mb={2}
              width='100px'
              height='80px'
              alignItems='center'
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
              <Stack p='4' space={1}>
                <Stack>
                  <Heading size='sm' textAlign='center'>
                    Zuhur
                  </Heading>
                </Stack>
                <Text textAlign='center' fontWeight='400'>
                  {formatTime(state.yourTimes.data[0].dhuhr)}
                </Text>
              </Stack>
            </Box>
          </HStack>
          <HStack space={3} justifyContent='center'>
            <Box
              width='100px'
              height='80px'
              alignItems='center'
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
              <Stack p='4' space={1}>
                <Stack>
                  <Heading size='sm' textAlign='center'>
                    Asar
                  </Heading>
                </Stack>
                <Text textAlign='center' fontWeight='400'>
                  {formatTime(state.yourTimes.data[0].asr)}
                </Text>
              </Stack>
            </Box>
            <Box
              width='100px'
              height='80px'
              alignItems='center'
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
              <Stack p='4' space={1}>
                <Stack>
                  <Heading size='sm' textAlign='center'>
                    Maghrib
                  </Heading>
                </Stack>
                <Text textAlign='center' fontWeight='400'>
                  {formatTime(state.yourTimes.data[0].maghrib)}
                </Text>
              </Stack>
            </Box>
            <Box
              width='100px'
              height='80px'
              alignItems='center'
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
              <Stack p='4' space={1}>
                <Stack>
                  <Heading size='sm' textAlign='center'>
                    Isha'
                  </Heading>
                </Stack>
                <Text textAlign='center' fontWeight='400'>
                  {formatTime(state.yourTimes.data[0].isha)}
                </Text>
              </Stack>
            </Box>
          </HStack>
        </Flex>
      </Stack>
    </Box>
  );
}
