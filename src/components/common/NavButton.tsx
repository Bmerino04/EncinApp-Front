import React from 'react';
import { Box, Pressable, Text, VStack, Badge } from 'native-base';
import { ReactNode } from 'react';

interface NavButtonProps {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  notificationDot?: boolean;
}

export function NavButton({ icon, label, onPress, notificationDot }: NavButtonProps) {
  return (
    <Pressable onPress={onPress} w={"44%"} mb={4}>
      <Box
        bg="white"
        borderRadius={16}
        borderWidth={2}
        borderColor="primary"
        alignItems="center"
        justifyContent="center"
        h={28}
        position="relative"
        shadow={2}
      >
        {notificationDot && (
          <Badge
            colorScheme="danger"
            rounded="full"
            position="absolute"
            top={2}
            right={2}
            w={3}
            h={3}
            p={0}
          />
        )}
        <VStack alignItems="center" space={2}>
          {icon}
          <Text fontFamily="Geist" fontWeight="500" fontSize="md" color="primary">
            {label}
          </Text>
        </VStack>
      </Box>
    </Pressable>
  );
} 