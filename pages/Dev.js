import React from 'react';
import { View } from 'react-native';
import LocationService from '../components/Location';
import NotificationService from '../components/Notifications';
import BackgroundFetchService from '../components/Fetch';

export default function Devpage() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      <BackgroundFetchService />
      <NotificationService />
      <LocationService />
    </View>
  );
}
