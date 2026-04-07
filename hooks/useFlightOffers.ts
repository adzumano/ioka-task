import { generateOffers } from '@/constants/mock'
import { Offer } from '@/types/search'
import { useQuery } from '@tanstack/react-query'

import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
const mock = new AxiosMockAdapter(axios);

 mock.onGet('/api/travel/search/flight').reply(() =>
  new Promise((res) => setTimeout(() => res([200, generateOffers({ count: 200 })]), 1200))
);

async function fetchOffers(): Promise<Offer[]> {
  const response = await axios.get('/api/travel/search/flight');
  
  return response.data;
}

export function useFlightOffers(
) {
  return useQuery({
    queryKey: ['flight-offers'],
    queryFn: () => fetchOffers(),
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,    
  });
}