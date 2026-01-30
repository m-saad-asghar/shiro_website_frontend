import { AuthAxios } from "./AxiosHandler";

type ProjectsParams = {
  search?: string;
  page?: number;
  per_page?: number;
};

class ProjectsServices {
  static endPoint = "fetch_all_projects"; // adjust if your endpoint differs

  static projects(params?: ProjectsParams) {
return AuthAxios.get(ProjectsServices.endPoint, {
params: {
...(params?.search ? { search: params.search } : {}),
...(params?.page ? { page: params.page } : {}),
...(params?.per_page ? { per_page: params.per_page } : {}),
},
});
}

  // static projects(params?: ProjectsParams) {
  //   return AuthAxios.post(ProjectsServices.endPoint, {
  //     ...(params?.search ? { search: params.search } : {}),
  //     ...(params?.page ? { page: params.page } : {}),
  //     ...(params?.per_page ? { per_page: params.per_page } : {}),
  //   });
  // }
}

export default ProjectsServices;
