import axios from "axios";
import Cookies from "js-cookie";
const config = {
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Accept-Language": "en",
  },
};

export const PublicAxios = axios.create(config);
export const AuthAxios = axios.create(config);

AuthAxios.interceptors.request.use(async (req) => {
  const token = Cookies.get("token");
  const cu = Cookies.get("cu") || "AED"; // Default to AED
  const Language = window.localStorage.getItem("lang");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  req.headers["X-Currency"] = `${cu}`;
  if (Language) req.headers["Accept-Language"] = `${Language}`;

  return req;
});
