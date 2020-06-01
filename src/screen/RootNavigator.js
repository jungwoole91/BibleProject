import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './login/LoginScreen';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import  MainBottomTabNavigator  from './main/MainBottomNavigator';

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName = "Login">
        <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen}/>
        <Stack.Screen name="Main" options={{ headerShown: false }} component={MainBottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  )
};

export default App;

