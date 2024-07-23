import config from '../../config/index';

export const fetchReviews = async (memberId: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(
    `${config.API_URL}api/member/${memberId}/review`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error('Error Fetch ReviewsApi');
  }
  return response.json();
};
