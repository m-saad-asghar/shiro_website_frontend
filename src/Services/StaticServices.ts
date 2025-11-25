import { AuthAxios } from "./AxiosHandler";

class StaticServices {
  static endPiont = "static";
  static region() {
    return AuthAxios.get(`${StaticServices.endPiont}/region`);
  }
  static aboutUs() {
    return AuthAxios.get(`${StaticServices.endPiont}/about-us`);
  }
  static contact() {
    return AuthAxios.get(`${StaticServices.endPiont}/contact-info`);
  }
  static currency() {
    return AuthAxios.get(`${StaticServices.endPiont}/currency`);
  }
  static Area(search: string | undefined) {
    return AuthAxios.get(
      `${StaticServices.endPiont}/region${
        search != undefined ? `?search=${search}` : ""
      }`
    );
  }
  static Reviews() {
    return AuthAxios.get(`${StaticServices.endPiont}/reviews`);
  }
  static OurTeam(params?: {
    paginate?: boolean;
    per_page?: number;
    page?: number;
    team_type?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.paginate) queryParams.append("paginate", "true");
    if (params?.per_page)
      queryParams.append("per_page", params.per_page.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.team_type) queryParams.append("team_type", params.team_type);

    const queryString = queryParams.toString();
    return AuthAxios.get(
      `${StaticServices.endPiont}/team${queryString ? `?${queryString}` : ""}`
    );
  }
  static TeamMember(teamId: string) {
    return AuthAxios.get(
      `${StaticServices.endPiont}/show/team?team_id=${teamId}`
    );
  }
  static privacy() {
    return AuthAxios.get(`${StaticServices.endPiont}/privacy`);
  }
  static terms() {
    return AuthAxios.get(`${StaticServices.endPiont}/terms-condition`);
  }
  static FAQs() {
    return AuthAxios.get(`${StaticServices.endPiont}/faqs`);
  }
  static FAQ(id: string | number) {
    return AuthAxios.get(`${StaticServices.endPiont}/faqs/show?faq_id=${id}`);
  }
  static service(id: string | number) {
    return AuthAxios.get(
      `${StaticServices.endPiont}/services/show?service_id=${id}`
    );
  }
  static Services() {
    return AuthAxios.get(`${StaticServices.endPiont}/services`);
  }
}
export default StaticServices;
