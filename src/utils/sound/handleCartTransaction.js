// utils/sound/handleCartTransaction.js
import { axiosPost } from "../../api/standardAxios";
import handleDownload from "./handleDownload";

const handleCartTransaction = async (userId, musicIds) => {
  // 단일 값은 배열로 변환
  const ids = Array.isArray(musicIds) ? musicIds : [musicIds];

  try {
    // 결제 API 호출
    const response = await axiosPost({
      endpoint: `/api/cart/transaction/${userId}`,
      body: ids,
    });

    // 서버에서 반환하는 파일 경로 목록
    const filePaths = response.data.filePaths || [];

    // 순차 다운로드 처리
    for (const path of filePaths) {
      await handleDownload(path);
    }

    return { success: true, filePaths };
  } catch (error) {
    console.error("handleCartTransaction 오류:", error);
    throw error;
  }
};

export default handleCartTransaction;