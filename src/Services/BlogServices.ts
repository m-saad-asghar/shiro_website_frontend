import { AuthAxios } from "./AxiosHandler";

class BlogServices {
  static endPoint = "blogs";
  static AllBlogs() {
    return AuthAxios.get(`${BlogServices.endPoint}`);
  }
  static SingleBlog(id: string | number) {
    return AuthAxios.get(`${BlogServices.endPoint}/show?blog_id=${id}`);
  }
  static BlogCategories() {
    return AuthAxios.get(`blog-categories`);
  }
}
export default BlogServices;
