import Onboarding from "@/screens/Onboarding";
import Splash from "@/screens/Splash";
import Profile from "@/screens/Profile";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const Stack = createNativeStackNavigator();

export default function App() {
  const [authState, setAuthState] = useState('loading');

  const storage = AsyncStorage;

  useEffect(() => {
    checkOnboardingCompleted();    
  }, []);

  async function checkOnboardingCompleted() {
    const onboardingCompleted = await storage.getItem('onboardingCompleted');
    if (onboardingCompleted) {
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
      <Stack.Navigator>
        {authState === 'onboarding-completed' ? (
          <Stack.Screen name="Profile" component={Profile}/>
        ) : (
          <Stack.Screen name="Onboarding" component={Onboarding}/>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
