import React from 'react';
import { Box, Text, AspectRatio, Image, Stack, Heading } from 'native-base';
import { Linking } from 'react-native';

export default function About() {
  return (
    <Box safeArea>
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
        <Box>
          <AspectRatio w='100%' ratio={16 / 9}>
            <Image
              source={{
                uri: 'https://avatars.githubusercontent.com/u/87253997?v=4',
              }}
              alt='image'
            />
          </AspectRatio>
        </Box>
        <Stack p='4' space={3}>
          <Stack space={2}>
            <Heading size='md' ml='-1'>
              No Nonsense Waktu Solat
            </Heading>
            <Text
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
            </Text>
          </Stack>
          <Text fontWeight='400'>
            Contact us at Github:{' '}
            <Text
              fontWeight='500'
              color='violet.500'
              onPress={() => Linking.openURL('https://github.com/c4lyp5o')}
            >
              c4lyp5o
            </Text>
          </Text>
        </Stack>
      </Box>
    </Box>
  );
}
