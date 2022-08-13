import React, { useState, useEffect, useCallback } from 'react';
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
} from 'native-base';
import { getProfile } from '../lib/Profile';
import { getData, storeData } from '../lib/Helper';

export default function Prayertimes({
  zoneData,
  setLoading,
  setShowZonePicker,
}) {
  const [times, setTimes] = useState([]);
  const [timesError, setTimesError] = useState(null);
  const [timesLoading, setTimesLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getData('yourZone').then((res) => {
        console.log('Prayertimes focuseffect checking if zone if valid', res);
        if (!res) {
          setTimesLoading(true);
          setLoading(true);
          setShowZonePicker(true);
          setTimeout(() => {
            setLoading(false);
          }, 200);
        }
        return true;
      });
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        console.log('Prayertimes NOT IN FOCUS');
      };
    }, [])
  );

  useEffect(() => {
    console.log('Prayertimes MOUNTED');
    const fetchTimes = async () => {
      console.log('Fetching data in Prayertimes');
      fetch(`https://api.waktusolat.me/waktusolat/today/${zoneData}`)
        .then((response) => response.json())
        .then((json) => {
          storeData('yourTimes', json);
          setTimes(json);
          setTimesLoading(false);
        })
        .catch((error) => {
          setTimesError(error);
          setTimesLoading(false);
        });
    };
    const cacheService = async () => {
      console.log(
        '-------------Validating zone in Prayertimes-----------------'
      );
      const timesData = await getData('yourTimes');
      if (timesData) {
        console.log('Using stored times data');
        setTimes(timesData);
        setTimesLoading(false);
      } else {
        console.log('No times data');
        fetchTimes();
      }
    };
    cacheService();
    return () => {
      console.log('Prayertimes UNMOUNTED');
    };
  }, []);

  if (timesLoading) {
    return <Text>Loading...</Text>;
  }

  if (timesError) {
    return <Text>Error: {error.message}</Text>;
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
                  uri: getProfile(zoneData).picture,
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
                {times.zone}
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
                {times.negeri}
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
                {times.today.day.split(' / ')[0]},{' '}
                {times.today.hijri.split(' / ')[1]},{' '}
                {times.today.date.split(' / ')[1]}
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
                      {times.today.time}
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
                    Solat seterusnya dalam {times.nextSolat.hours} jam,{' '}
                    {times.nextSolat.minutes} minit
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
                    <Text fontWeight='400'>{times.data[0].fajr}</Text>
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
                    <Text fontWeight='400'>{times.data[0].syuruk}</Text>
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
                    <Text fontWeight='400'>{times.data[0].dhuhr}</Text>
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
                    <Text fontWeight='400'>{times.data[0].asr}</Text>
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
                    <Text fontWeight='400'>{times.data[0].maghrib}</Text>
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
                    <Text fontWeight='400'>{times.data[0].isha}</Text>
                  </Stack>
                </Box>
              </Box>
            </HStack>
          </Stack>
        </Box>
      </Box>
    </>
  );
}
