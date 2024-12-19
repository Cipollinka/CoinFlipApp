// StackNavigator.js
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Platform, ImageBackground } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { TailwindProvider } from 'tailwind-rn';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import utilities from './tailwind.json';
import HomeScreen from './src/screens/HomeScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { loadUserData } from './src/redux/userSlice';

const Stack = createNativeStackNavigator();

const StackStructure = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
            <TailwindProvider utilities={utilities}>
              <SafeAreaProvider>
                <AppNavigator />
              </SafeAreaProvider>
            </TailwindProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {
  const { user, setUser } = useContext(UserContext);
  const [initializing, setInitializing] = useState(true);
  const [onboardingVisible, setOnboardingVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedUser = await AsyncStorage.getItem(storageKey);

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setOnboardingVisible(false);
        } else {
          setOnboardingVisible(true);
        }
      } catch (error) {
        console.error('Помилка завантаження даних користувача:', error);
      } finally {
        setInitializing(false);
      }
    };
    loadUser();
  }, [setUser]);

  if (initializing) {
    return (
      <ImageBackground
      source={require('./src/assets/backGroundImage/BackgroundFlipApp.png')}
      style={{ flex: 1, alignItems: 'center', }}
      resizeMode="cover"
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4a56ba" />
      </View>
      </ImageBackground>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Home'}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default StackStructure;
