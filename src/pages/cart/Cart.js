import { useEffect, useMemo, useState } from "react";
import { axiosDelete, axiosGet, axiosPost } from "../../api/standardAxios";
import { useAuth } from "../../context/authContext";
import { useCSSLoader } from "../../hooks/useCSSLoader";

const Cart = () => {
  const cssFiles = useMemo(() => [
      "/assets/css/sound/music.css",
      "/assets/css/sound/admin-main.css",
      "/assets/css/user/user-admin.css",
  ],[]);
  useCSSLoader(cssFiles);

  // 응답 데이터 초기값은 dtoList 빈 배열
  const [responseData, setResponseData] = useState({ dtoList: [] });
  // 선택된 음원의 musicId를 저장하는 state
  const [selectedMusicIds, setSelectedMusicIds] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return; // user 정보가 없으면 API 호출을 진행하지 않음

    const fetchCartData = async () => {
      const response = await axiosGet({ endpoint: `/api/cart/${user.userId}` });
      setResponseData(response);
    };

    fetchCartData();
  }, [user]);

  // 단일 결제 처리
  const applyCart = async (userId, musicId) => {
    try {
      await axiosPost({
        endpoint: `/api/cart/${userId}`,
        body: [musicId],
      });
      alert("결제가 완료되었습니다!");
      // 결제 후 필요한 UI 업데이트 로직을 추가
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
      await axiosPost({
        endpoint: `/api/cart/transactions/${user.userId}`,
        body: selectedMusicIds,
      });
      alert("선택 음원 결제가 완료되었습니다!");
      // 결제 후 선택된 음원 상태 초기화 및 UI 업데이트 로직 추가
      setSelectedMusicIds([]);
    } catch (error) {
      console.error("일괄 결제 중 오류:", error);
      alert("결제 실패");
    }
  };

  // 개별 삭제 처리
  const deleteCart = async (userId, musicId) => {
    try {
      await axiosDelete({ endpoint: `/api/cart/${userId}/${musicId}` });
      // 삭제 후 UI 업데이트: 응답 데이터에서 해당 항목 제거
      setResponseData((prev) => ({
        dtoList: prev.dtoList.filter((item) => item.musicId !== musicId),
      }));
      // 만약 삭제된 아이템이 선택되어 있다면 목록에서 제거
      setSelectedMusicIds((prev) => prev.filter((id) => id !== musicId));
    } catch (error) {
      console.error("카트 삭제 중 오류:", error);
      alert("삭제 실패");
    }
  };

  // 체크박스 선택 상태 토글 함수
  const toggleSelection = (musicId) => {
    if (selectedMusicIds.includes(musicId)) {
      setSelectedMusicIds(selectedMusicIds.filter((id) => id !== musicId));
    } else {
      setSelectedMusicIds([...selectedMusicIds, musicId]);
    }
  };

  return (
    <div>
      {/* 선택 음원 일괄 구매 버튼 */}
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
                    onClick={() => applyCart(cart.userId, cart.musicId)}
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
