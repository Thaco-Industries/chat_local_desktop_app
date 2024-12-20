import { useFetchApi } from '../context/ApiContext';

export const useConfigSystemService = () => {
  const { apiRequest } = useFetchApi();
  const getConfigSystem = async () => {
    const response = apiRequest('GET', 'settings/config-system');
    return response;
  };
  return { getConfigSystem };
};
