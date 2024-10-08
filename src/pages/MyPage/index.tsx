import { useLoaderData, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  useToast,
  SimpleGrid,
  Divider,
  Icon,
} from '@chakra-ui/react';
import { useMe } from '../../stores/meStore';
import Layout from '../../components/Common/Layout';
import InstaImage from '../../components/Common/Image/InstaImage';
import { fetchReviews } from '../../api/Review';
import { Link } from 'react-router-dom';
import { ReviewType } from '../../types/ReviewType';
import ProfileImage from '../../components/Common/Image/ProfileImage';
import TapBar from '../../components/Common/TapBar';
import Header from '../../components/Common/Header';
import 산잉 from '../../assets/images/산잉.png';
import { 잘못된요청, 에러404, 서버오류 } from '../../constant/constant';
import { logout } from '../../api/Auth/AuthService';
import useErrorToast from '../../hooks/useErrorToast';
import axios from 'axios';
import { MdLocationOn } from 'react-icons/md';

const DEFAULT_IMAGE_URL =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvQNXE66kR9nlnWK3Lv_ZBsMYJYDpiqs7eyVw_tZFY2OZpaNU0vTSpLVhNfTGNdoOxOVk&usqp=CAU';

const MyPage: React.FC = () => {
  const { me } = useMe();
  const reviewsData = useLoaderData() as { reviews: ReviewType[] };
  const navigate = useNavigate();
  const toast = useToast();
  const { errorToast } = useErrorToast();

  const login_email = me.login_email;
  const nickname = me.name;
  const profile_image_url = me.profile_image_url;

  const { data, error, isLoading } = useQuery<{ reviews: ReviewType[] }>({
    queryKey: ['reviews', login_email],
    queryFn: () => fetchReviews(login_email),
    initialData: reviewsData,
  });

  useEffect(() => {
    if (error) {
      if (axios.isAxiosError(error) && error.response) {
        const statusCode = error.response.status;

        switch (statusCode) {
          case 400:
            errorToast(잘못된요청);
            break;
          case 403:
            logout();
            navigate('/errorpage');
            break;
          case 404:
            errorToast(에러404);
            break;
          case 500:
            errorToast(서버오류);
            break;
          default:
            toast({
              title: '리뷰를 불러오는 중 오류가 발생했습니다.',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
            break;
        }
      } else {
        toast({
          title: '알 수 없는 오류가 발생했습니다.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }, [error, toast, errorToast, navigate]);

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  const reviews = data?.reviews || [];

  const sortedReviews = [...reviews].reverse();

  return (
    <Layout>
      <Header
        title="마이페이지"
        showMenuButton={true}
        showBorderBottom={false}
      />
      <Box p="4" pt="20" pb="20">
        <Flex alignItems="center" mb="4">
          <Box>
            <ProfileImage
              src={profile_image_url || 산잉}
              width="80px"
              height="80px"
            />
          </Box>
          <Box mt={2} pl={2}>
            <Text
              fontSize="24px"
              fontWeight="medium"
              fontFamily="Gmarket Sans TTF"
              color="black"
            >
              {nickname}님
            </Text>
            <Text
              mt={-2}
              ml={0.5}
              fontSize="15px"
              fontWeight="light"
              fontFamily="Gmarket Sans TTF"
              color="black"
            >
              {login_email}
            </Text>
          </Box>
        </Flex>
        <Divider
          borderColor="#EFEFEF"
          my="4"
          borderWidth="1px"
          width="107.5%"
          ml={-4}
        />
        <Text
          fontSize="15px"
          fontWeight="medium"
          fontFamily="Gmarket Sans TTF"
          color="black"
          mb="2"
          mt={5}
        >
          최근 리뷰들
        </Text>
        <Box width="108%" ml={-4}>
          <SimpleGrid columns={3} spacing={1}>
            {sortedReviews.map((review) => (
              <Link to={`/review/${review.review_id}`} key={review.review_id}>
                <Box mb="0.2">
                  <Box width="100%" position="relative">
                    <InstaImage
                      src={
                        review.image_urls.length > 0
                          ? review.image_urls[0]
                          : DEFAULT_IMAGE_URL
                      }
                    />
                    <Box
                      position="absolute"
                      top="0"
                      left="0"
                      width="100%"
                      height="100%"
                      boxShadow="inset 0px 0px 10px 5px rgba(0, 0, 0, 0.25)"
                    />
                    <Box
                      position="absolute"
                      top="5px"
                      left="10px"
                      right="10px"
                      color="white"
                    >
                      <Text
                        fontSize="15px"
                        fontWeight="bold"
                        fontFamily="Gmarket Sans TTF"
                        style={{ WebkitTextStroke: '0.5px black' }}
                      >
                        {review.title}
                      </Text>
                    </Box>
                    <Box
                      position="absolute"
                      bottom="4px"
                      left="5px"
                      color="white"
                    >
                      <Text
                        fontSize="11px"
                        fontWeight="bold"
                        fontFamily="Gmarket Sans TTF"
                        style={{ WebkitTextStroke: '0.5px black' }}
                      >
                        <Icon
                          as={MdLocationOn}
                          mb={0.5}
                          mr={0.5}
                          color={'black'}
                        />
                        {review.valley_name}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </Link>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
      <TapBar />
    </Layout>
  );
};

export default MyPage;
