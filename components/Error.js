import { Box, Button, Text } from 'native-base';

export default function Error({ func }) {
  return (
    <Box flex={1} justifyContent='center' alignItems='center'>
      <Text>We encountered an error. Please try again 😢</Text>
      <Button mt={2} bg='purple.600' onPress={func}>
        Refresh
      </Button>
    </Box>
  );
}
