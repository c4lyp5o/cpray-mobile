import { Box, Text } from 'native-base';

export default function Error({ func }) {
  return (
    <Box flex={1} justifyContent='center' alignItems='center'>
      <Button position='absolute' top={0} right={0} onPress={func}>
        Refresh
      </Button>
      <Text>We encountered an error. Please try again 😢</Text>
    </Box>
  );
}
