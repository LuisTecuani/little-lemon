import Onboarding from "@/screens/Onboarding";
import Splash from "@/screens/Splash";
import Profile from "@/screens/Profile";
import Home from "@/screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();

export default function App() {
  const [authState, setAuthState] = useState('loading');
  const [fontsLoaded] = useFonts({
    'Karla-Regular': require('./assets/fonts/Karla-Regular.ttf'),
    'MarkaziText-Regular': require('./assets/fonts/MarkaziText-Regular.ttf'),
  });

  useEffect(() => {
    checkOnboardingCompleted();
  }, []);

  async function checkOnboardingCompleted() {
    const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
    if (onboardingCompleted === 'true') {
      setAuthState('onboarding-completed');
    } else {
      setAuthState('onboarding');
    }
  }

  if (authState === 'loading') {
    return <Splash />
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={authState === 'onboarding-completed' ? 'Home' : 'Onboarding'}>
        {authState === 'onboarding-completed' &&
          <Stack.Screen name="Profile" options={{ headerShown: false }}>
            {(props) => <Profile {...props} checkOnboardingCompleted={checkOnboardingCompleted} />}
          </Stack.Screen>}
        {authState === 'onboarding-completed' &&
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {(props) => <Home {...props} checkOnboardingCompleted={checkOnboardingCompleted} />}
          </Stack.Screen>}
        {authState !== 'onboarding-completed' && (
          <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
            {(props) => <Onboarding {...props} checkOnboardingCompleted={checkOnboardingCompleted} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
