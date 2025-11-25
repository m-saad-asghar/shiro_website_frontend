import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
type keysType = string | number | boolean;
type endPointType = (data?: any) => Promise<AxiosResponse<any, any>>;

const UseQueryPost = (
  keys: keysType[],
  endPoint: endPointType,
  onSuccess?: (res?: AxiosResponse) => void,
  invalidate?: any,
  statusObject?: {
    success: string;
  }
) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutateAsync, data, status } = useMutation({
    mutationKey: keys,
    mutationFn: endPoint,
    onSuccess: async (res) => {
      if (onSuccess) {
        onSuccess(res);
      }
      if (invalidate) {
        queryClient.invalidateQueries(invalidate);
      }
      if (statusObject?.success) {
        toast(statusObject?.success, {
          style: {
            fontSize: "17px",
            color: "#094834",
            backgroundColor: "#ffffff",
          },
          duration: 2000,
        });
      }
    },
    onMutate: (_) => {
      //data that i passed to the function
      //before calling the api
      if (statusObject?.success) {
        toast(t("Loading..."), {
          style: {
            fontSize: "17px",
            color: "#094834",
            backgroundColor: "#ffffff",
          },
          duration: 1500,
        });
      }
    },
    onError: (err: any) => {
      if (statusObject?.success) {
        if (
          err?.response?.status == 401 ||
          err?.response?.status == 422 ||
          err?.response?.status == 400
        ) {
          // Try to get error message from different possible locations
          const errorMessage =
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            err?.message ||
            "An error occurred";

          toast(errorMessage, {
            style: {
              fontSize: "17px",
              color: "#094834",
              backgroundColor: "#ffffff",
            },
          });
        } else {
          // Handle other error status codes
          toast(t("An unexpected error occurred"), {
            style: {
              fontSize: "17px",
              color: "#094834",
              backgroundColor: "#ffffff",
            },
          });
        }
      }
    },
  });
  return { mutateAsync, data, status };
};

export default UseQueryPost;
