import { AuthAxios } from "./AxiosHandler";

class PropertiesServices {
  static endPoint = "/properties";

  static PropertiesArea(id: string | undefined) {
    return AuthAxios.get(
      `${PropertiesServices.endPoint}${id ? `?region_id=${id}` : ""}`
    );
  }

  static AllProperties(id: string | undefined) {
    return AuthAxios.get(
      `${PropertiesServices.endPoint}${id ? `?type_id=${id}` : ""}`
    );
  }

  // New method to fetch a limited number of properties for carousel
  static CarouselProperties(id: string | undefined, limit: number = 3) {
    const params = new URLSearchParams();

    if (id) {
      params.append("type_id", id);
    }

    // Add parameter for random properties
    params.append("limit", limit.toString());
    params.append("random", "true");

    return AuthAxios.get(`${PropertiesServices.endPoint}?${params.toString()}`);
  }

  static filters() {
    return AuthAxios.get(`${PropertiesServices.endPoint}/filters`);
  }

  static Search(body: any) {
    return AuthAxios.post(`${PropertiesServices.endPoint}/search`, body);
  }

  static show(id: string | undefined) {
    return AuthAxios.get(`/property/show?property_id=${id}`);
  }

  // API for projects (off-plan properties)
  static showProject(id: string | undefined) {
    return AuthAxios.get(`/property/show?property_id=${id}`);
  }

  // API for properties by slug (works for both regular properties and projects)
  static async showBySlug(slug: string | undefined) {
    if (!slug) {
      throw new Error("Slug is required");
    }
    // Use the slug endpoint directly - no need for ID
    return AuthAxios.get(`/property/slug/${slug}`);
  }

  // API for projects by slug with fallback (kept for backward compatibility)
  static async showProjectBySlug(slug: string | undefined) {
    return PropertiesServices.showBySlug(slug);
  }

  static getAll() {
    return AuthAxios.get(`${PropertiesServices.endPoint}`);
  }
}

export default PropertiesServices;
