import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Box,
  Switch,
  Checkbox,
  Button,
  FlatList,
  Center,
  NativeBaseProvider,
  Text,
  Menu,
  Pressable,
  HamburgerIcon,
  AspectRatio,
  Image,
  Stack,
  Heading,
  HStack,
  Select,
  FormControl,
  CheckIcon,
  WarningOutlineIcon,
} from 'native-base';
export default function Settings() {
  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('playSound', value);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Box alignItems='center'>
      <Box
        maxW='full'
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
        {/* <Box>
          <AspectRatio w='100%' ratio={16 / 9}>
            <Image
              source={{
                uri: 'https://avatars.githubusercontent.com/u/87253997?v=4',
              }}
              alt='image'
            />
          </AspectRatio>
        </Box> */}
        <Stack p='4' space={3}>
          <Stack space={2}>
            {/* <Heading size='md' ml='-1'>
              Use sound?
            </Heading> */}
            {/* <HStack alignItems='center' space={4}>
              <Text>Mainkan azan pada masuk waktu</Text>
              <Switch
                size='md'
                // onToggle={() => {
                //   console.log('checked');
                // }}
              />
            </HStack> */}
            <HStack space={6}>
              <Text
                fontWeight='bold'
                fontSize='lg'
                color='gray.800'
                _dark={{
                  color: 'gray.400',
                }}
              >
                Mainkan azan pada masuk waktu
              </Text>
              <Checkbox
                value='test'
                accessibilityLabel='This is a dummy checkbox'
                onChange={() => {
                  console.log('checked');
                  storeData('true');
                }}
              />
            </HStack>
            {/* <Text
              fontSize='xs'
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
              Created with ❤
            </Text> */}
          </Stack>
          {/* <Text fontWeight='400'>
            Contact us at Github:{' '}
            <Text
              fontWeight='500'
              color='violet.500'
              onPress={() => Linking.openURL('https://github.com/c4lyp5o')}
            >
              c4lyp5o
            </Text>
          </Text> */}
        </Stack>
      </Box>
    </Box>
  );
}
