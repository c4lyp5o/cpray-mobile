import {
  Box,
  Center,
  Text,
  AspectRatio,
  Image,
  Stack,
  Heading,
} from 'native-base';

export default function Intro({ children }) {
  return (
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
        <AspectRatio w='100%' ratio={16 / 9}>
          <Image
            source={{
              uri: 'https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg',
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
          PHOTOS
        </Center>
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
            Solat adalah tiang agama.
          </Text>
        </Stack>
        <Text fontWeight='400'>Waktu Solat bagi semua daerah di Malaysia</Text>
        {children}
      </Stack>
    </Box>
  );
}
