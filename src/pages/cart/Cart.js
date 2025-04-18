import { useEffect, useMemo, useState } from "react";
import { axiosDelete, axiosGet, axiosPost } from "api/standardAxios";
import { useAuth } from "context/authContext";
import { useCSSLoader } from "hooks/useCSSLoader";
import handleDownload from "utils/sound/handleDownload";

const Cart = () => {
  const cssFiles = useMemo(() => [
    "/assets/css/sound/music.css",
    "/assets/css/sound/admin-main.css",
    "/assets/css/user/user-admin.css",
  ], []);
  useCSSLoader(cssFiles);

  const [responseData, setResponseData] = useState({ dtoList: [] });
  const [selectedMusicIds, setSelectedMusicIds] = useState([]);
  const { user, initializing } = useAuth();

  useEffect(() => {
    if (initializing) return;

    const fetchCartData = async () => {
      const response = await axiosGet({ endpoint: `/api/cart/${user.userId}` });
      setResponseData(response);
    };

    fetchCartData();
  }, [user, initializing]);

  // 단일 결제 처리
  const applyCart = async (userId, musicId, filePath) => {
    try {
      const response = await axiosPost({ endpoint: `/api/cart/transaction/${userId}`, body: [musicId] });
      if (response.message.includes("결제가 완료되었습니다")) {
        await handleDownload(filePath);
        // 단일 결제 후 UI 갱신
        setResponseData(prev => ({
          dtoList: prev.dtoList.filter(item => item.musicId !== musicId)
        }));
      }
    } catch (error) {
      console.error("결제 중 오류:", error);
      alert("결제 실패");
    }
  };

  // 일괄 결제 처리 (선택된 음원들)
  const applySelectButton = async () => {
    if (!user) return;
    if (selectedMusicIds.length === 0) {
      alert("구매할 음원을 선택해주세요.");
      return;
    }

    try {
      // 결제 요청 및 파일 경로 배열 수신
      const response = await axiosPost({endpoint: `/api/cart/transaction/${user.userId}`,body: selectedMusicIds,});
      const filePaths = response.data.filePaths || [];

      if (response.message.includes("결제가 완료되었습니다")) {
        // 각 파일 다운로드
        for (const path of filePaths) {
          await handleDownload(path);
        }
  
        // 다운로드 완료 후 UI 업데이트
        setResponseData(prev => ({
          dtoList: prev.dtoList.filter(item => !selectedMusicIds.includes(item.musicId))
        }));
        setSelectedMusicIds([]);
      }
    } catch (error) {
      console.error("일괄 결제 중 오류:", error);
      alert("일괄 결제 또는 다운로드에 실패했습니다.");
    }
  };

  const deleteCart = async (userId, musicId) => {
    try {
      await axiosDelete({ endpoint: `/api/cart/${userId}/${musicId}` });
      setResponseData(prev => ({
        dtoList: prev.dtoList.filter(item => item.musicId !== musicId)
      }));
      setSelectedMusicIds(prev => prev.filter(id => id !== musicId));
    } catch (error) {
      console.error("카트 삭제 중 오류:", error);
      alert("삭제 실패");
    }
  };

  const toggleSelection = (musicId) => {
    setSelectedMusicIds(prev =>
      prev.includes(musicId)
        ? prev.filter(id => id !== musicId)
        : [...prev, musicId]
    );
  };

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button className="apply-button" onClick={applySelectButton}>
          선택 음원 일괄 구매
        </button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>선택</th>
              <th>타이틀</th>
              <th>아티스트</th>
              <th>추가일</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {responseData.dtoList.map((cart, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedMusicIds.includes(cart.musicId)}
                    onChange={() => toggleSelection(cart.musicId)}
                  />
                </td>
                <td>{cart.title}</td>
                <td>{cart.nickname}</td>
                <td>{cart.createDate}</td>
                <td>
                  <button
                    className="apply-button"
                    onClick={() => applyCart(cart.userId, cart.musicId, cart.filePath)}
                  >
                    결제
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => deleteCart(cart.userId, cart.musicId)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cart;
