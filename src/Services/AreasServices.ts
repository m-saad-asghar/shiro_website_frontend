import { AuthAxios } from "./AxiosHandler";

type AreasParams = {
  search?: string;
  page?: number;
  per_page?: number;
};

class AreasServices {
  static endPoint = "areas";

  static areas(params?: AreasParams) {
    return AuthAxios.get(AreasServices.endPoint, {
      params: {
        ...(params?.search ? { search: params.search } : {}),
        ...(params?.page ? { page: params.page } : {}),
        ...(params?.per_page ? { per_page: params.per_page } : {}),
      },
    });
  }
}

export default AreasServices;