import basicClient from '../../api/Auth/basicClient';
import { ValleysType } from '../../types';
import { logout } from '../Auth/AuthService';

export const fetchfacilities = async (latitude: number, longitude: number) => {
  try {
    const response = await basicClient.get(
      `/api/valley?position=${longitude}, ${latitude}&radius=1000000`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    logout();
    window.location.href = '/errorpage';
    await new Promise((resolve) => setTimeout(resolve, 100));
    throw new Error('Failed to fetch facility');
  }
};

export const fetchValleys = async (): Promise<ValleysType[]> => {
  try {
    const response = await basicClient.get('/api/valley', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    logout();
    window.location.href = '/errorpage';
    await new Promise((resolve) => setTimeout(resolve, 100));
    throw new Error('Failed to fetch valleys');
  }
};

export const fetchValleysByFilter = async (
  filters: any = {},
): Promise<ValleysType[]> => {
  const {
    position,
    radius,
    tag_names,
    rating,
    offset,
    region,
    keyword,
    sort_type,
  } = filters;

  let queryParams = '';
  if (position) queryParams += `position=${position}&`;
  if (radius) queryParams += `radius=${radius}&`;
  if (tag_names) queryParams += `tag_names=${tag_names.join(',')}&`;
  if (rating) queryParams += `rating=${rating}&`;
  if (offset) queryParams += `offset=${offset}&`;
  if (region) queryParams += `region=${region}&`;
  if (keyword) queryParams += `keyword=${keyword}&`;
  if (sort_type) queryParams += `sort_type=${sort_type}&`;

  try {
    const response = await basicClient.get(`/api/valley?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    logout();
    window.location.href = '/errorpage';
    await new Promise((resolve) => setTimeout(resolve, 100));
    throw new Error('Failed to fetch valleys by filter');
  }
};

export const fetchRegions = async (): Promise<string[]> => {
  try {
    const response = await basicClient.get('/api/region', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.regions;
  } catch (error) {
    logout();
    window.location.href = '/errorpage';
    await new Promise((resolve) => setTimeout(resolve, 100));
    throw new Error('Failed to fetch regions');
  }
};
