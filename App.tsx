import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
import { theme } from './theme/catppuccinLatte';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </NativeBaseProvider>
  );
} 