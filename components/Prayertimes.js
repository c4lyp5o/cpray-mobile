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
  Spinner,
} from 'native-base';
import { useNNWSStore } from '../lib/Context';
import { getProfile } from '../lib/Profile';
import { getData, storeData, timeReminder } from '../lib/Helper';

export default function Prayertimes({ setLoading, setShowZonePicker }) {
  const { setState, state } = useNNWSStore();
  const refZone = useRef(null);
  const tempReminderData = useRef();
  const tempTimesData = useRef();
  const counter = useRef(1);
  const [timesError, setTimesError] = useState(null);
  const [timesLoading, setTimesLoading] = useState(true);

  // useFocusEffect(
  //   useCallback(() => {
  //     if (counter.current === 0) {
  //       return;
  //     }
  //     console.log('PRAYERTIMES: Prayertimes IN FOCUS');
  //     focusEffectService();
  //     setTimeout(() => {
  //       intervalService();
  //     }, 500);
  //     return () => {
  //       console.log('PRAYERTIMES: Prayertimes NOT IN FOCUS');
  //     };
  //   }, [])
  // );

  useFocusEffect(
    useCallback(() => {
      // if (counter.current === 1) {
      console.log('PRAYERTIMES: counter is', counter.current);
      focusEffectService();
      // setTimeout(() => {
      //   intervalService();
      // }, 500);
      // }
      return () => {
        console.log('PRAYERTIMES: NOT IN FOCUS');
      };
    }, [])
  );

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        console.log('PRAYERTIMES: Fetching times');
        const data = await fetch(
          `https://api.waktusolat.me/waktusolat/today/${state.yourZone}`
        );
        const json = await data.json();
        refZone.current = state.yourZone;
        setState((prevState) => ({ ...prevState, yourTimes: json }));
        tempTimesData.current = json;
        const tempRemind = await timeReminder(json);
        setState((prevState) => ({ ...prevState, yourReminder: tempRemind }));
        tempReminderData.current = tempRemind;
      } catch (e) {
        console.log(e);
        setTimesError(e);
      }
    };
    const cacheService = async () => {
      const timesData = await getData('yourTimes');
      if (timesData) {
        console.log('Using stored times data');
        setTimesLoading(false);
      } else {
        console.log('No times data');
        fetchTimes(); // saved to async storage
      }
    };
    const saveToStore = async () => {
      try {
        let testSave = {};
        testSave = { ...testSave, ...state };
        await storeData('yourData', testSave);
        // await storeData('yourZone', state.yourZone);
        await storeData('yourTimes', state.yourTimes);
      } catch (e) {
        console.log(e);
      }
    };
    const intervalService = () => {
      // console.log('running interval:' + prevInt);
      // setTimeNow(new Date());
      setState((prevState) => ({ ...prevState, yourTime: new Date() }));
      timeReminder(tempTimesData.current)
        .then((timeReminderData) => {
          tempReminderData.current = timeReminderData;
        })
        .catch((error) => {
          console.log(error);
        });
    };
    // cacheService();
    fetchTimes().then(() => {
      setTimeout(() => {
        setTimesLoading(false);
      }, 200);
      // setTimeout(() => {
      //   saveToStore();
      // }, 2000);
    });
    const prevInt = setInterval(() => intervalService(), 60000);
    console.log('Prayertimes interval set to: ' + prevInt);
    return () => {
      clearInterval(prevInt);
      console.log(
        `PRAYERTIMES: Prayertimes UNMOUNTED. Clearing interval: ${prevInt}`
      );
    };
  }, []);

  // useEffect(() => {
  //   const saveAllData = async () => {
  //     let tempData = { ...state };
  //     await storeData('yourData', tempData);
  //     console.log(tempData);
  //   };
  //   console.log('times has changed');
  // }, [state.yourTimes]);

  const focusEffectService = async () => {
    getData('yourZone').then((res) => {
      console.log('PRAYERTIMES: focuseffect checking zone:', res);
      if (!res) {
        setTimesLoading(true);
        setLoading(true);
        setShowZonePicker(true);
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    });
  };

  const intervalService = () => {
    console.log('PRAYERTIMES: interval service called');
    setState((prevState) => ({ ...prevState, yourTime: new Date() }));
    timeReminder(tempTimesData.current)
      .then((timeReminderData) => {
        tempReminderData.current = timeReminderData;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (timesLoading) {
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

  if (timesError) {
    return (
      <Box flex={1} justifyContent='center' alignItems='center'>
        <Text>Error: {timesError.message}</Text>;
      </Box>
    );
  }

  // if (appState.current === 'active' && counter.current === 0) {
  //   console.log(
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
        <AspectRatio w='100%' maxH='full' ratio={16 / 9}>
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
          <Heading size='md' ml='-1'>
            {state.yourTimes.zone}
          </Heading>
          <Text
            fontSize='md'
            _light={{
              color: 'violet.500',
            }}
            _dark={{
              color: 'violet.400',
            }}
            fontWeight='500'
            ml='-0.5'
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
            ml='-0.5'
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
            <Stack p='4' space={3}>
              <Stack space={2}>
                <Heading size='2xl' ml='-1' textAlign='center'>
                  {new Date().toLocaleTimeString('en-GB').slice(0, 5)}
                </Heading>
              </Stack>
              <Text
                fontSize='md'
                textAlign={'center'}
                _light={{
                  color: 'violet.500',
                }}
                _dark={{
                  color: 'violet.400',
                }}
                fontWeight='500'
                ml='-0.5'
                mt='-1'
              >
                Solat seterusnya dalam{' '}
                {tempReminderData.current.nextSolat.hours} jam,{' '}
                {tempReminderData.current.nextSolat.minutes} minit
              </Text>
            </Stack>
          </Box>
        </Box>
        <HStack space={3} justifyContent='center'>
          <Box alignItems='center'>
            <Box
              maxW='80'
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
                <Stack space={2}>
                  <Heading size='md' ml='-1'>
                    Subuh
                  </Heading>
                </Stack>
                <Text fontWeight='400'>{state.yourTimes.data[0].fajr}</Text>
              </Stack>
            </Box>
          </Box>
          <Box alignItems='center'>
            <Box
              maxW='80'
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
                <Stack space={2}>
                  <Heading size='md' ml='-1'>
                    Syuruk
                  </Heading>
                </Stack>
                <Text fontWeight='400'>{state.yourTimes.data[0].syuruk}</Text>
              </Stack>
            </Box>
          </Box>
          <Box alignItems='center'>
            <Box
              maxW='80'
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
                <Stack space={2}>
                  <Heading size='md' ml='-1'>
                    Zuhur
                  </Heading>
                </Stack>
                <Text fontWeight='400'>{state.yourTimes.data[0].dhuhr}</Text>
              </Stack>
            </Box>
          </Box>
        </HStack>
        <HStack space={3} justifyContent='center'>
          <Box alignItems='center'>
            <Box
              maxW='80'
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
                <Stack space={2}>
                  <Heading size='md' ml='-1'>
                    Asar
                  </Heading>
                </Stack>
                <Text fontWeight='400'>{state.yourTimes.data[0].asr}</Text>
              </Stack>
            </Box>
          </Box>
          <Box alignItems='center'>
            <Box
              maxW='80'
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
                <Stack space={2}>
                  <Heading size='md' ml='-1'>
                    Maghrib
                  </Heading>
                </Stack>
                <Text fontWeight='400'>{state.yourTimes.data[0].maghrib}</Text>
              </Stack>
            </Box>
          </Box>
          <Box alignItems='center'>
            <Box
              maxW='80'
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
                <Stack space={2}>
                  <Heading size='md' ml='-1'>
                    Isha'
                  </Heading>
                </Stack>
                <Text fontWeight='400'>{state.yourTimes.data[0].isha}</Text>
              </Stack>
            </Box>
          </Box>
        </HStack>
      </Stack>
    </Box>
  );
}
