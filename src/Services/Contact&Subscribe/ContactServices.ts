import { PublicAxios } from "../AxiosHandler";

class ContactServices {
  static endPoint = "contact/submit";
  static contact(body: any) {
    return PublicAxios.post(`${ContactServices.endPoint}`, body);
  }
}
export default ContactServices;
