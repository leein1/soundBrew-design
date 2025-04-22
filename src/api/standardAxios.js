import {handleResponse}  from "utils/response/handleResponse"
import axios from "axios";

//  const BASE_URL = "https://localhost:8443";
// const BASE_URL = "http://Soundvbrew-env.eba-gpmigkef.ap-northeast-2.elasticbeanstalk.com";
 const BASE_URL = "https://soundbrew.art";

// Axios 기본 설정
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    // headers: { 'Content-Type': 'application/json' },
});

// 토큰 재발급 함수
export const callRefresh = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');

    if (!refreshToken || !accessToken) {
        throw new Error("저장된 토큰이 없습니다. 다시 로그인해주세요.");
    }

    const tokens = { accessToken, refreshToken };

    try {
        const response = await axiosInstance.post('/refreshToken', tokens);
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        return response.data.accessToken;
    } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // alert("토큰 재발급 과정 중 오류, 로그인이 필요합니다.");
        window.location.href = '/login';
        throw new Error("로그인이 필요합니다.");
    }
};

// 토큰 포함된 요청 처리 유틸리티
const addAuthHeader = async (options, handle = {}) => {
    let accessToken = localStorage.getItem("accessToken");

    options.headers = {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`
    };

    try {
        const response = await axiosInstance(options);
        return handleResponse(response.status, response.data, handle);
    } catch (error) {
        if (error.response?.status === 401) {
            // alert("만료되었거나 인증 실패된 토큰, 재발급 시도 중...");
            // alert(error.response.data.message);
            try {
                const newAccessToken = await callRefresh();
                options.headers = { Authorization: `Bearer ${newAccessToken}` };

                // alert("재요청");
                const retryResponse = await axiosInstance(options); // 재요청
                return handleResponse(retryResponse.status, retryResponse.data, handle);
            } catch (refreshError) {
                // alert("재요청 실패");
                alert("로그인이 필요합니다.");
                window.location.href = "/login"; // 로그인 페이지로 리다이렉트
                throw refreshError;
            }
        } else if (error.response?.status === 403) {
            const redirectUrl = error.response.data?.redirectUrl;
            const message = error.response.response?.message;
            return handleResponse(error.response.status, error.response.data, handle);
        } else {
            const errorResponse = error.response;
            if (errorResponse) {
                return handleResponse(errorResponse.status, errorResponse.data, handle);
            }
            console.error("핸들링 외 오류:", error.message);
            throw error;
        }
    }
};

// API 요청 처리 함수 (responseType 파라미터 추가)
const fetchData = async ({
    endpoint,
    body = null,
    useToken = false,
    params = {},
    method = "GET",
    handle = null,
    uniqueToken = false,
    responseType = 'json' // 기본 responseType은 'json'
}) => {
    const options = {
        headers: { "Content-Type": "application/json" },
        method,
        url: endpoint,
        params,
        data: body,
        responseType, // responseType 옵션 추가
    };

    // FormData인 경우 Content-Type 삭제
    if (body instanceof FormData) {
        delete options.headers["Content-Type"];
    }

    if (uniqueToken) {
        let token = localStorage.getItem("resetToken");
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`
        };
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

// 각 HTTP 메서드별 래퍼 함수
export const axiosGet = async ({ endpoint, useToken = true, params = {}, handle = null, responseType = 'json' }) =>
    fetchData({ endpoint, useToken, params, method: 'GET', handle, responseType });

export const axiosPost = async ({ endpoint, body = {}, useToken = true, params = {}, handle = null, uniqueToken = false }) =>
    fetchData({ endpoint, body, useToken, params, method: 'POST', handle, uniqueToken });

export const axiosDelete = async ({ endpoint, body = {}, useToken = true, params = {}, handle = null }) =>
    fetchData({ endpoint, body, useToken, params, method: 'DELETE', handle });

export const axiosPatch = async ({ endpoint, body = {}, useToken = true, params = {}, handle = null }) =>
    fetchData({ endpoint, body, useToken, params, method: 'PATCH', handle });

export const axiosPut = async ({ endpoint, body = {}, useToken = true, params = {}, handle = null }) =>
    fetchData({ endpoint, body, useToken, params, method: 'PUT', handle });


let setGlobalLoading = null;

export const registerLoadingHandler = (setLoadingFn) => {
  setGlobalLoading = setLoadingFn;
};

// 요청 인터셉터
axiosInstance.interceptors.request.use(
    (config) => {
      try {
        if (typeof setGlobalLoading === "function") {
          setGlobalLoading(true);
        }
      } catch (e) {
        console.error("로딩 상태 설정 중 오류 (요청):", e);
      }
      return config;
    },
    (error) => {
      try {
        if (typeof setGlobalLoading === "function") {
          setGlobalLoading(false);
        }
      } catch (e) {
        console.error("로딩 상태 설정 중 오류 (요청 에러):", e);
      }
      return Promise.reject(error);
    }
  );
  
  // 응답 인터셉터
  axiosInstance.interceptors.response.use(
    (response) => {
      try {
        if (typeof setGlobalLoading === "function") {
          setGlobalLoading(false);
        }
      } catch (e) {
        console.error("로딩 상태 설정 중 오류 (응답):", e);
      }
      return response;
    },
    (error) => {
      try {
        if (typeof setGlobalLoading === "function") {
          setGlobalLoading(false);
        }
      } catch (e) {
        console.error("로딩 상태 설정 중 오류 (응답 에러):", e);
      }
      return Promise.reject(error);
    }
  );
  
