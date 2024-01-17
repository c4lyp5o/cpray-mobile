import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { NNWSStoreProvider } from './lib/Context';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Devpage from './pages/Dev';
import About from './pages/About';
import DrawerContent from './components/Drawercontent';
import 'react-native-gesture-handler';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NNWSStoreProvider>
      <NavigationContainer>
        <NativeBaseProvider>
          <Drawer.Navigator
            initialRouteName='Waktu Solat'
            screenOptions={{
              headerStyle: {
                backgroundColor: '#803790',
              },
              headerTintColor: '#fff',
            }}
            drawerContent={(props) => <DrawerContent {...props} />}
          >
            <Drawer.Screen name='Waktu Solat' component={Home} />
            <Drawer.Screen name='Settings' component={Settings} />
            <Drawer.Screen name='Dev Page' component={Devpage} />
            <Drawer.Screen name='About' component={About} />
          </Drawer.Navigator>
        </NativeBaseProvider>
      </NavigationContainer>
    </NNWSStoreProvider>
  );
}
