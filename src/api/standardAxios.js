// src/api/standardAxios.js
import axios from "axios";
import { handleResponse } from "../utils/response/handleResponse"; // 상대경로로 import

const BASE_URL = "https://localhost:8443";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const callRefresh = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");

  if (!refreshToken || !accessToken) {
    throw new Error("저장된 토큰이 없습니다. 다시 로그인해주세요.");
  }

  try {
    const response = await axiosInstance.post("/refreshToken", {
      accessToken,
      refreshToken,
    });

    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);

    return response.data.accessToken;
  } catch (error) {
    window.location.href = "/login";
    throw new Error("로그인이 필요합니다.");
  }
};

const addAuthHeader = async (options, handle = {}) => {
  let accessToken = localStorage.getItem("accessToken");

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const response = await axiosInstance(options);
    return handleResponse(response.status, response.data, handle);
  } catch (error) {
    if (error.response?.status === 401) {
      try {
        const newAccessToken = await callRefresh();
        options.headers.Authorization = `Bearer ${newAccessToken}`;
        const retryResponse = await axiosInstance(options);
        return handleResponse(retryResponse.status, retryResponse.data, handle);
      } catch (refreshError) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
        throw refreshError;
      }
    } else {
      const errorResponse = error.response;
      if (errorResponse) {
        return handleResponse(errorResponse.status, errorResponse.data, handle);
      }
      console.error("Unhandled error:", error.message);
      throw error;
    }
  }
};

const fetchData = async ({
  endpoint,
  body = null,
  useToken = false,
  params = {},
  method = "GET",
  handle = null,
  uniqueToken = false,
  responseType = "json",
}) => {
  const options = {
    headers: { "Content-Type": "application/json" },
    method,
    url: endpoint,
    params,
    data: body,
    responseType,
  };

  if (body instanceof FormData) {
    delete options.headers["Content-Type"];
  }

  if (uniqueToken) {
    const token = localStorage.getItem("resetToken");
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (useToken) {
    return await addAuthHeader(options, handle);
  }

  try {
    const response = await axiosInstance(options);
    return handleResponse(response.status, response.data, handle);
  } catch (error) {
    if (error.response) {
      return handleResponse(error.response.status, error.response.data, handle);
    } else {
      console.error("네트워크 오류:", error.message);
      throw error;
    }
  }
};

// HTTP 메서드 래퍼들
export const axiosGet = (args) => fetchData({ ...args, method: "GET" });
export const axiosPost = (args) => fetchData({ ...args, method: "POST" });
export const axiosDelete = (args) => fetchData({ ...args, method: "DELETE" });
export const axiosPatch = (args) => fetchData({ ...args, method: "PATCH" });
export const axiosPut = (args) => fetchData({ ...args, method: "PUT" });
