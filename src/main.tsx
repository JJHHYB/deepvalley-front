import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/global.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './pages/HomePage/index.tsx';
import { ChangePassword, ErrorPage, ReviewPage } from './pages/index.tsx';
import { fetchReview, fetchReviews } from './api/Review/index.ts';
import MyPage from './pages/MyPage/index.tsx';
import Login from './pages/Auth/Login';
import theme from './theme';
import PrivateRoute from './routes/PrivateRoute';
import Register from './pages/Auth/Register';
import SocialKakaoRedirectPage from './pages/Auth/SocialLogin/KaKao/SocialKakaoRedirectPage/index.tsx';
import MapPage from './pages/Map/MapPage/index.tsx';
import Logout from './pages/Auth/Logout/index.tsx';
import { ChangeProfile } from './pages/index.tsx';
import ReviewWritingPage from './pages/ReviewWritingPage/index.tsx';
import ReviewFixpage from './pages/ReviewFixPage/index.tsx';
import { useMe } from './stores/meStore.ts';
import WithdrawalSuccessPage from './pages/MyPage/WithdrawalSuccessPage';
import ValleyPage from './pages/ValleyPage';
import SearchPage from './pages/SearchPage/index.tsx';
import { fetchValleysByFilter } from './api/ValleyApi/index.ts';
import LoadingPage from './components/Common/LoadingPage/index.tsx';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  fetchValleyDetailInfo,
  fetchValleyDetailReview,
  fetchValleyDetailImage,
} from './api/Valley/index.ts';
import ErrorBoundary from './components/Common/ErrorBoundary/index.tsx';
import { IDFind, PasswordFind } from './pages/Auth/index.tsx';
import SuggestPage from './pages/SuggestPage/index.tsx';
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log(
          'Service Worker registered with scope:',
          registration.scope,
        );
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

const queryClient = new QueryClient();
const router = createBrowserRouter([
  //EX: loader, errorElement 예시
  // 데이터 패칭 및 로더 가능
  // loader: rootLoader,

  //에러처리 페이지 ex)404
  // errorElement: <ErrorPage />
  { path: '/register', element: <Register /> },
  {
    path: '/login',
    element: <Login />,
  },
  { path: '/auth', element: <SocialKakaoRedirectPage /> },
  { path: '/register', element: <Register /> },
  { path: '/logout', element: <Logout /> },
  { path: '/id_find', element: <IDFind /> },
  { path: '/password_find', element: <PasswordFind /> },
  { path: '/logout', element: <Logout /> },
  {
    path: '/WithdrawalSuccessPage',
    element: <WithdrawalSuccessPage />,
  },

  {
    path: '/',

    element: (
      <PrivateRoute>
        <HomePage />
      </PrivateRoute>
    ),
  },
  {
    path: '/ChangePassword',
    element: (
      <PrivateRoute>
        <ChangePassword />
      </PrivateRoute>
    ),
  },
  {
    path: '/ChangeProfile',
    element: (
      <PrivateRoute>
        <ChangeProfile />
      </PrivateRoute>
    ),
  },

  {
    path: '/mappage',
    element: (
      <PrivateRoute>
        <MapPage />
      </PrivateRoute>
    ),
  },
  {
    path: 'review/:reviewId',
    element: (
      <PrivateRoute>
        <ReviewPage />
      </PrivateRoute>
    ),
    loader: async ({ params }) => {
      const reviewId = params.reviewId as string;
      const data = await fetchReview(reviewId);
      queryClient.setQueryData(['reviewDetail', reviewId], data);
      return { reviewId: reviewId, initialData: data };
    },
  },
  {
    path: 'myPage',
    element: (
      <PrivateRoute>
        <MyPage />
      </PrivateRoute>
    ),
    loader: async () => {
      const { me } = useMe.getState();
      const memberId = me.login_email;
      const reviewsData = await fetchReviews(memberId);
      queryClient.setQueryData(['reviews', memberId], reviewsData);
      return reviewsData;
    },
  },
  {
    path: 'reviewWriting',
    element: (
      <PrivateRoute>
        <ReviewWritingPage />
      </PrivateRoute>
    ),
  },

  {
    path: '/reviewUpdate/:reviewId',
    element: (
      <PrivateRoute>
        <ReviewFixpage />
      </PrivateRoute>
    ),
    loader: async ({ params }) => {
      const { reviewId } = params;
      if (!reviewId) throw new Error('Review ID is required');
      const review = await fetchReview(reviewId);
      return { review, reviewId };
    },
  },

  {
    path: '/suggest/:place_id/:name',
    element: (
      <PrivateRoute>
        <SuggestPage />
      </PrivateRoute>
    ),
  },

  {
    path: '/search/:tag?',
    element: (
      <PrivateRoute>
        <SearchPage />
      </PrivateRoute>
    ),
    loader: async ({ params }) => {
      const { tag } = params;
      const filters = tag ? { tag_names: [tag] } : {};
      const valleys = await fetchValleysByFilter(filters);
      return { valleys, tag };
    },
  },

  {
    path: '/valley/:valleyId/detail',
    element: (
      <PrivateRoute>
        <ValleyPage />
      </PrivateRoute>
    ),
    loader: async ({ params }) => {
      const valleyId = params.valleyId as string;
      const valleyData = await fetchValleyDetailInfo(valleyId);
      const reviewData = await fetchValleyDetailReview(valleyId);
      const imageData = await fetchValleyDetailImage(valleyId);
      queryClient.setQueryData(['valleyDetail', valleyId], valleyData);
      queryClient.setQueryData(['reviews', valleyId], reviewData);
      queryClient.setQueryData(['images', valleyId], imageData);
      return {
        valley: valleyData,
        reviews: reviewData.reviews,
        images: imageData,
      };
    },
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ErrorBoundary>
          <RouterProvider router={router} fallbackElement={<LoadingPage />} />
        </ErrorBoundary>
      </QueryClientProvider>
    </ChakraProvider>
    ,
  </React.StrictMode>,
);
