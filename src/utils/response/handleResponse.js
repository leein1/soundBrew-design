  // src/utils/handleResponse.js
  export const handleResponse = async (status, data, handle, navigateFunc) => {
    switch (status) {
      // 200: 성공 응답
      case 200: {
        const { message, navigate, location, callback } = handle?.success || {};
  
        if (handle?.success) {
          if (message) alert(message);
          else alert(data.message);
  
          if (typeof callback === 'function') {
            await callback(data);
          }
  
          if (location) {
            // 전체 페이지 새로고침 방식
            window.location.href = location;
          } else if (navigate && typeof navigateFunc === 'function') {
            // SPA 방식 리다이렉션
            navigateFunc(navigate);
          } else {
            // 기본 경로 이동
            if (typeof navigateFunc === 'function') navigateFunc('/sounds/tracks');
            else window.location.href = '/sounds/tracks';
          }
        } else if (data.message) {
          alert(data.message + "!!");
        }
        return data;
      }
  
      // 실패 응답 처리 (400, 401, 404, 405, 500, 503, 504)
      case 400:
      case 401:
      case 404:
      case 405:
      case 500:
      case 503:
      case 504: {
        const { message, navigate, location, callback } = handle?.failure || {};
        if (handle?.failure) {
          if (message) alert(message);
          else alert(data.message);
  
          if (typeof callback === 'function') {
            await callback(data);
          }
  
          if (location) {
            window.location.href = location;
          } else if (navigate && typeof navigateFunc === 'function') {
            navigateFunc(navigate);
          } else {
            window.history.back();
          }
        } else {
          alert(data.message);
          window.history.back();
        }
        break;
      }
  
      // 403 Forbidden 처리
      case 403:
        alert(data.message);
        window.location.href = '/login';
        break;
  
      // 그 외 예상하지 못한 상태 코드
      default:
        alert("예기치 않은 오류가 발생했습니다.");
        console.error(`알 수 없는 상태 코드 (${status}):`, data);
        break;
    }
  };
  