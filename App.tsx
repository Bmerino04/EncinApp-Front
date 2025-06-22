import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { RootNavigator } from 'src/navigation/RootNavigator';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

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
    <PaperProvider>
      <NavigationContainer>
        <RootNavigator
          isAuthenticated={isAuthenticated}
          onLogin={handleLogin}
          onLogout={handleLogout} 
        />
      </NavigationContainer>
    </PaperProvider>
  );
}