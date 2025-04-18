import { useEffect, useMemo, useState } from "react";
import { useCSSLoader } from "hooks/useCSSLoader";
import { axiosGet } from "api/standardAxios";
import { useAuth } from "context/authContext";
import handleDownload from "utils/sound/handleDownload";


const Transaction =()=>{
    const cssFiles = useMemo(() => [
        "/assets/css/sound/music.css",
        "/assets/css/sound/admin-main.css",
        "/assets/css/user/user-admin.css",
    ],[]);
    useCSSLoader(cssFiles);

    // 응답 데이터 초기값은 dtoList 빈 배열
    const [responseData, setResponseData] = useState({ dtoList: [] });
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return; // user 정보가 없으면 API 호출을 진행하지 않음

        const fetchTransactionData = async () => {
            const response = await axiosGet({ endpoint: `/api/cart/transaction/${user.userId}` });
            setResponseData(response);
        };

        fetchTransactionData();
    }, [user]);
    
    const applyDownload= async (filePath)=>{
        // 다운로드 로직
        handleDownload(filePath);
    };

    return (
        <div>
          {/* 선택 음원 일괄 구매 버튼 */}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>타이틀</th>
                  <th>아티스트</th>
                  <th>추가일</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {responseData.dtoList.map((cart, index) => (
                  <tr key={index}>
                    <td>{cart.title}</td>
                    <td>{cart.nickname}</td>
                    <td>{cart.createDate}</td>
                    <td>
                      <button
                        className="apply-button"
                        onClick={() => applyDownload(cart.filePath)}
                      >
                        다운로드
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
}

export default Transaction;