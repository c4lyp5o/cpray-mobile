import { Box, Spinner } from 'native-base';

export default function Loading() {
  return (
    <Box flex={1} justifyContent='center' alignItems='center'>
      <Spinner size='lg' color='violet.500' />
    </Box>
  );
}
