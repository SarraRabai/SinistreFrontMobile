import { create } from "apisauce";
import cache from "../utility/cache";
import authStorage from "../auth/storage";

const apiClient = create({
  baseURL: "http://192.168.1.103:9000/api",
  timeout: 90000,
});

const get = apiClient.get;

apiClient.addAsyncRequestTransform(async (request) => {
  const authToken = await authStorage.getToken();

  if (!authToken) return;
  request.headers["x-auth-token"] = authToken;
});

apiClient.get = async (url, params, axiosConfig) => {
  //before

  const response = await get(url, params, axiosConfig); //this fct return a promise

  if (response.ok) {
    return response;
  }
  //the call of server failed
  const data = await cache.get(url);
  return data ? { ok: true, data } : response; //return object with 2 properties
  //original response object of why the server is failed
};

export default apiClient;
