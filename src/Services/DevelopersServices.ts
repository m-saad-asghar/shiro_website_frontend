import { AuthAxios } from "./AxiosHandler";

class DevelopersServices {
  static endPoint = "developers";
  static developer(search: any) {
    return AuthAxios.get(
      `${DevelopersServices.endPoint}${
        search != undefined ? `?search=${search}` : ""
      }`
    );
  }
}
export default DevelopersServices;
