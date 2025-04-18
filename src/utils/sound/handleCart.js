import { axiosPost } from "../../api/standardAxios";
// 다운로드 버튼 핸들러
  const handleCart = async (sound, userId) => {
    const body={
        musicId:sound.musicDTO.musicId,
        userId : userId, // 추가한 유저의 아이디
        title: sound.musicDTO.title,
        filePath:sound.musicDTO.filePath,
        nickname:sound.albumDTO.nickname,
        credit:3,
        status:"READY",
    }

    try{
      await axiosPost({endpoint: `/api/cart/add`,body:body});
    } catch (error) {
      console.error("결제 중 오류:", error);
      alert("결제 실패");
    }
  };

  export default handleCart;