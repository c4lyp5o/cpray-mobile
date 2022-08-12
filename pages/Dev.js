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

export default function Devpage() {
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
          <Stack space={2}>
            <HStack space={6}>
              <Text
                fontWeight='bold'
                fontSize='lg'
                color='gray.800'
                _dark={{
                  color: 'gray.400',
                }}
              >
                Dev Page
              </Text>
              <Button
                size='sm'
                variant='ghost'
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
