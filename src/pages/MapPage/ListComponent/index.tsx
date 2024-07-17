import { useState } from 'react';
import {
  Box,
  Text,
  Center,
  VStack,
  Image,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { LocationOn, People, Star, Water } from '@mui/icons-material';
import { Valley } from '../../../api/ValleyApi/ValleyMockData';

const ListComponent = ({ valleys }: { valleys: Valley[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState('13%');

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setHeight(isOpen ? '13%' : '80%');
  };

  return (
    <Box
      position="absolute"
      bottom="0"
      left="0"
      width="100%"
      height={height}
      bg="white"
      transition="height 0.3s ease-in-out"
      borderTopRadius="lg"
      boxShadow="0 -2px 10px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.2)"
      onClick={handleToggle}
      zIndex="20"
    >
      <Center>
        <Box
          width="60px"
          height="5px"
          bg="gray.400"
          borderRadius="full"
          mt={2}
        />
      </Center>
      {isOpen && (
        <VStack p={4} spacing={2}>
          {valleys.map((valley, index) => (
            <Box
              key={index}
              p={2}
              borderWidth="1px"
              borderRadius="lg"
              w="100%"
              boxShadow="md"
            >
              <HStack spacing={4}>
                <Image
                  src={valley.thumbnail}
                  alt={valley.name}
                  borderRadius="lg"
                  boxSize="140px"
                  objectFit="cover"
                />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold" fontSize="lg">
                    {valley.name}
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    {valley.address}
                  </Text>
                  <HStack spacing={2}>
                    <Icon as={Water} color="blue.500" />
                    <Text fontSize="sm">{valley.max_depth}m</Text>
                    <Icon
                      as={People}
                      color={valley.busy ? 'red.500' : 'green.500'}
                    />
                    <Text fontSize="sm">{valley.busy ? '혼잡' : '여유'}</Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Icon as={Star} color="yellow.500" />
                    <Text fontSize="sm">{valley.rating}</Text>
                    <Text fontSize="sm" color="gray.500">
                      리뷰 {valley.post_count}개
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default ListComponent;