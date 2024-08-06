import React, { useState } from 'react';
import ItemsCarousel from 'react-items-carousel';
import { Flex, Box, Image, Text, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@chakra-ui/react';
import { fetchRecommendReview } from '../../../api/Review';
const noOfCards = 1;
const chevronWidth = 40;

const RecommendReview: React.FC = () => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['recommendReview'],
    queryFn: fetchRecommendReview,
  });

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <VStack align="start" spacing={4} p={4} m={2}>
      <Text fontSize="xl" fontWeight="bold">
        오늘의 추천 계곡
      </Text>
      {isPending ? (
        <Flex
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="20vh"
        >
          <Spinner
            thickness="4px"
            speed="2s"
            emptyColor="gray.200"
            color="teal.500"
            size="xl"
          />
        </Flex>
      ) : (
        <Box position="relative" width="100%">
          <ItemsCarousel
            infiniteLoop
            gutter={0}
            activePosition={'center'}
            disableSwipe={false}
            alwaysShowChevrons={false}
            numberOfCards={noOfCards}
            activeItemIndex={activeItemIndex}
            outsideChevron={false}
            showSlither={true}
            requestToChangeActive={setActiveItemIndex}
            chevronWidth={chevronWidth}
          >
            {data.data.map((item: any, index: any) => (
              <Box
                key={index}
                position="relative"
                boxShadow=""
                borderRadius="lg"
                overflow="hidden"
                height="34vh"
                backgroundColor={'white'}
                p={2}
              >
                <Image
                  src={item.image_url}
                  alt={item.valley_name}
                  style={{ height: '90%', width: '100%', objectFit: 'cover' }}
                />
                <Box
                  position="absolute"
                  bottom="40px"
                  width={'95%'}
                  height={'20%'}
                  bg="rgba(0, 0, 0, 0.6)"
                  color="white"
                  p={2}
                  borderRadius="md"
                >
                  <Text fontSize="lg" fontWeight="bold">
                    {item.valley_name}
                  </Text>
                  <Text fontSize="sm">{item.address}</Text>
                </Box>
                <Text p={3} fontSize="sm" color="teal.500">
                  {item.tag_names.join(' ')}
                </Text>
                <Box p={4}></Box>
              </Box>
            ))}
          </ItemsCarousel>
        </Box>
      )}
    </VStack>
  );
};

export default RecommendReview;