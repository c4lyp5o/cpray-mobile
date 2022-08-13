import React, { useState, useEffect } from 'react';
import { getData, storeData, removeValue } from '../lib/Helper';
import { Box, Checkbox, Button, Text, Stack, HStack } from 'native-base';

export default function Settings() {
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
                Play the azan on all prayer times
              </Text>
              <Checkbox
                aria-label='No azan on prayer times'
                checked={true}
                color='primary'
                onChange={() => {
                  console.log('checked');
                }}
                _dark={{
                  color: 'primary.500',
                }}
              />
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
                size='sm'
                color='gray.600'
                _dark={{
                  color: 'gray.400',
                }}
                onPress={() => {
                  removeValue();
                }}
              >
                Reset
              </Button>
            </HStack>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
