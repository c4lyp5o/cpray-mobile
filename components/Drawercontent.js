import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Center, Box, Image, Text } from 'native-base';

export default function DrawerContent(props) {
  return (
    <Box flex={1}>
      {/*Top Large Image */}
      <Center marginTop='15%'>
        <Image
          source={{
            uri: 'https://images.cdn4.stockunlimited.net/preview1300/moon-and-stars_1284710.jpg',
          }}
          alt='image'
          resizeMode='center'
          w={100}
          h={100}
          alignSelf='center'
          borderRadius={50}
        />
      </Center>
      <Center
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
        }}
      >
        <Text>NNWS</Text>
      </Center>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {/* <DrawerItem
          label='Visit Us'
          onPress={() => Linking.openURL('https://aboutreact.com/')}
        />
        <View style={styles.customItem}>
          <Text
            onPress={() => {
              Linking.openURL('https://aboutreact.com/');
            }}
          >
            Rate Us
          </Text>
          <Image
            source={{ uri: BASE_PATH + 'star_filled.png' }}
            style={styles.iconStyle}
          />
        </View> */}
      </DrawerContentScrollView>
    </Box>
  );
}

// const styles = StyleSheet.create({
//   sideMenuProfileIcon: {
//     resizeMode: 'center',
//     width: 100,
//     height: 100,
//     borderRadius: 100 / 2,
//     alignSelf: 'center',
//   },
//   iconStyle: {
//     width: 15,
//     height: 15,
//     marginHorizontal: 5,
//   },
//   customItem: {
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
// });
