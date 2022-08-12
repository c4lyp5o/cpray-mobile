import React, { useState, useEffect } from 'react';
import {
  Box,
  Center,
  Text,
  AspectRatio,
  Image,
  HStack,
  Stack,
  Heading,
} from 'native-base';
import { Audio } from 'expo-av';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { getProfile } from '../lib/Profile';
import {
  timeReminder,
  intepretHijriDate,
  intepretChristDate,
  intepretDay,
} from '../lib/Helper';

TaskManager.defineTask('background-azan')
const Timesdata = ({ data, zone }) => {
  const [timeNow, setTimeNow] = useState(new Date());
  const [timeReminderData, setTimeReminderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(); // sound is a promise
  const playSound = async () => {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
      require('../assets/azan.mp3')
    );
    setSound(sound);
    console.log('Playing Sound');
    await sound.playAsync();
  };
  const firstInit = async (data) => {    
    timeReminder(data)
      .then((timeReminderData) => {
        setTimeReminderData(timeReminderData);
        setLoading(false);
        // setInterval(() => {
        //   playSound();
        //   setIsPlaying(false);
        // }, timeReminderData.nextSolah.milliseconds);
        console.log(timeReminderData);
        return timeReminderData;
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // const intervalCheck = async (data) => {
  //   try {
  //     setTimeNow(new Date());
  //     const forThisMoment = await timeReminder(data);
  //     setTimeReminderData(forThisMoment);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const theTimer = setInterval(() => {
  //   intervalCheck(data);
  // }, 30000);
  const stopCounter = () => {
    clearInterval(theTimer);
  };
  const fuselage = (reminder) => {
    console.log(reminder);
    if (reminder.nextSolah.minutes === 0 && isPlaying === false) {
      playSound();
      setIsPlaying(true);
    }
  };
  const myTask = () => {
    try {
      // fetch data here...
      playSound();
      const backendData = 'Simulated fetch ' + Math.random();
      console.log('myTask() ', backendData);
      return backendData
        ? BackgroundFetch.Result.NewData
        : BackgroundFetch.Result.NoData;
    } catch (err) {
      return BackgroundFetch.Result.Failed;
    }
  };
  const initBackgroundFetch = async (taskName, taskFn, interval) => {
    try {
      if (!TaskManager.isTaskDefined(taskName)) {
        TaskManager.defineTask(taskName, taskFn);
      }
      const options = {
        minimumInterval: interval, // in seconds
      };
      await BackgroundFetch.registerTaskAsync(taskName, options);
    } catch (err) {
      console.log('registerTaskAsync() failed:', err);
    }
  };
  const removeBackgroundFetch = async (taskName) => {
    try {
      await BackgroundFetch.unregisterTaskAsync(taskName);
    } catch (err) {
      console.log('unregisterTaskAsync() failed:', err);
    }
  };
  useEffect(() => {
    // timeReminder(data).then((timeReminderData) => {
    //   setTimeReminderData(timeReminderData);
    //   setLoading(false);
    //   setInterval(() => {
    //     playSound();
    //     setIsPlaying(false);
    //   }, timeReminderData.nextSolah.milliseconds);
    //   console.log(timeReminderData);
    // });
    firstInit(data);
    initBackgroundFetch('background-azan', myTask, 30000);
    // prevInt = setInterval(() => {
    //   console.log('running new interval:' + prevInt);
    //   setTimeNow(new Date());
    //   timeReminder(data)
    //     .then((timeReminderData) => {
    //       setTimeReminderData(timeReminderData);
    //       console.log(timeReminderData, prevInt);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // }, 30000);
  }, [zone]);
  if (loading) {
    return <Text>Loading...</Text>;
  }
  return (
    <>
      <Box alignItems='center'>
        <Box
          maxW='full'
          h='full'
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
          <Box>
            <AspectRatio w='100%' maxH='full' ratio={16 / 9}>
              <Image
                source={{
                  uri: getProfile(zone).picture,
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
                {data.zone}
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
                {getProfile(zone).negeri}
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
                {intepretDay(data.data[0].day)},{' '}
                {intepretHijriDate(data.data[0].hijri)} /{' '}
                {intepretChristDate(data.data[0].date)}
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
                      {timeNow.toLocaleTimeString('en-GB').slice(0, 5)}
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
                    Solat seterusnya dalam {timeReminderData.nextSolah.hours}{' '}
                    jam, {timeReminderData.nextSolah.minutes} minit
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
                    <Text fontWeight='400'>{data.data[0].fajr}</Text>
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
                    <Text fontWeight='400'>{data.data[0].syuruk}</Text>
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
                    <Text fontWeight='400'>{data.data[0].dhuhr}</Text>
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
                    <Text fontWeight='400'>{data.data[0].asr}</Text>
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
                    <Text fontWeight='400'>{data.data[0].maghrib}</Text>
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
                    <Text fontWeight='400'>{data.data[0].isha}</Text>
                  </Stack>
                </Box>
              </Box>
            </HStack>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default function Prayertimes({ route, zone }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = () => {
      fetch(`https://api.waktusolat.me/waktusolat/week/${zone}`)
        .then((response) => response.json())
        .then((json) => {
          setData(json);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    };
    fetchData();
  }, []);
  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>Error: {error.message}</Text>;
  }
  return <Box>{data && <Timesdata data={data} zone={zone} />}</Box>;
}
