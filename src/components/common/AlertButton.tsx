import React from 'react';
import { Pressable, Box, Text, VStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

interface AlertButtonProps {
  onPress: () => void;
}

export function AlertButton({ onPress }: AlertButtonProps) {
  return (
    <Pressable onPress={onPress} alignSelf="center" mt={6}>
      <Box
        borderRadius={999}
        borderWidth={8}
        borderColor="#FF6A00"
        bg="white"
        w={36}
        h={36}
        alignItems="center"
        justifyContent="center"
        shadow={4}
      >
        <VStack alignItems="center" space={1}>
          <MaterialIcons name="warning" size={40} color="#FF2D55" />
          <Text fontFamily="Geist" fontWeight="700" fontSize="lg" color="#FF2D55" textAlign="center">
            Emitir
          </Text>
          <Text fontFamily="Geist" fontWeight="700" fontSize="lg" color="#FF2D55" textAlign="center">
            Alerta
          </Text>
        </VStack>
      </Box>
    </Pressable>
  );
} 