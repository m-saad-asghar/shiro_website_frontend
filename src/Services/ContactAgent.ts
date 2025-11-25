import { AuthAxios } from "./AxiosHandler";

class ContactAgent {
  static endPoint = "contact-agent";
  static Agent(body: any) {
    return AuthAxios.post(`${ContactAgent.endPoint}`, body);
  }
}
export default ContactAgent;
