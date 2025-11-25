import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
type keysType =
  | number
  | string
  | boolean
  | null
  | undefined
  | AxiosResponse<any, any>;
type endpointType = (data?: any) => Promise<AxiosResponse<any, any>>;
const useQueryGet = (
  keys: keysType[],
  endpoint: endpointType,
  onSuccess?: (response?: AxiosResponse) => void,
  enabled: boolean = true
) => {
  const { data, isFetching, status } = useQuery({
    queryKey: keys,
    queryFn: async () => {
      try {
        const response = await endpoint();
        if (onSuccess && response.status == 200) {
          onSuccess(response);
        }
        return response.data?.data;
      } catch (err) {
        throw err;
      }
    },
    enabled: enabled,
    retry: false,
    // staleTime :10000*10
  });
  return { data, isFetching, status };
};
export default useQueryGet;
