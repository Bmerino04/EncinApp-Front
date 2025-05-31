import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { theme } from './theme/catppuccinLatte';
import { RootNavigator } from 'src/navigation/RootNavigator';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        'Geist': require('./assets/fonts/Geist-Regular.ttf'),
        'Geist-Medium': require('./assets/fonts/Geist-Medium.ttf'),
        'Geist-SemiBold': require('./assets/fonts/Geist-SemiBold.ttf'),
        'Geist-Bold': require('./assets/fonts/Geist-Bold.ttf'),
      });
      setFontsLoaded(true);
    })();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </NativeBaseProvider>
  );
} 