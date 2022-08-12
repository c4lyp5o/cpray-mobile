import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from './pages/Home';
import About from './pages/About';
import Settings from './pages/Settings';
import Devpage from './pages/Dev';
import BackgroundFetchScreen from './pages/Fetch';
import DrawerContent from './components/Drawercontent';
import 'react-native-gesture-handler';

const Drawer = createDrawerNavigator();

const config = {
  dependencies: {
    'linear-gradient': LinearGradient,
  },
};

export default function App() {
  return (
    <NavigationContainer>
      <NativeBaseProvider config={config}>
        <Drawer.Navigator
          initialRouteName='Waktu Solat'
          drawerContent={(props) => <DrawerContent {...props} />}
        >
          <Drawer.Screen name='Waktu Solat' component={Home} />
          <Drawer.Screen name='Settings' component={Settings} />
          <Drawer.Screen name='About' component={About} />
          <Drawer.Screen name='Dev Page' component={Devpage} />
          <Drawer.Screen name='Test Fetch' component={BackgroundFetchScreen} />
        </Drawer.Navigator>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
