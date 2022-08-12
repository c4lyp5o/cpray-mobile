import React from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Linking,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Center } from 'native-base';

export default function DrawerContent(props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/*Top Large Image */}
      <Center
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '20%',
        }}
      >
        <Image
          source={{
            uri: 'https://images.cdn4.stockunlimited.net/preview1300/moon-and-stars_1284710.jpg',
          }}
          style={styles.sideMenuProfileIcon}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    alignSelf: 'center',
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
