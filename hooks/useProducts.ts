import { Iproduct } from '<@davsua>/interfaces';
import useSWR, { SWRConfiguration } from 'swr';

const fetcher = (...args: [key: string]) => fetch(...args).then((res) => res.json());

export const useProducts = (url: string, config: SWRConfiguration = {}) => {
  //const { data, error, isLoading } = useSWR<Iproduct[]>(`/api${url}`, fetcher);
  // ---> el fetcher ya se esta usando en el estado global (_app)
  // peticion a api con sonfig swr
  const { data, error, isLoading } = useSWR<Iproduct[]>(`/api${url}`, config);

  return {
    products: data || [], // lo que recibimos e la peticion
    isLoading: !error && !data, // si no hay error ni tampoco data
    isError: error, // cuando hay error
  };
};
