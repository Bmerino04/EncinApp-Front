import React from 'react';
import { HStack, IconButton, Icon, Text, Box } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  onDelete?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, onDelete }) => (
  <Box safeAreaTop bg="background">
    <HStack alignItems="center" justifyContent="space-between" px={2} py={2}>
      {onBack ? (
        <IconButton
          icon={<Icon as={MaterialIcons} name="arrow-back" size={6} color="text" />}
          onPress={onBack}
          variant="ghost"
        />
      ) : <Box w={10} />}
      <Text fontSize="lg" fontWeight="bold" color="text" flex={1} textAlign="center">
        {title}
      </Text>
      {onDelete ? (
        <IconButton
          icon={<Icon as={MaterialIcons} name="delete" size={6} color="error.600" />}
          onPress={onDelete}
          variant="ghost"
        />
      ) : <Box w={10} />}
    </HStack>
  </Box>
);

export default Header; 