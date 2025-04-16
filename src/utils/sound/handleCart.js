import { axiosPost } from "../../api/standardAxios";
// 다운로드 버튼 핸들러
  const handleDownload = async (sound, userId) => {
    const body={
        musicId:sound.musicDTO.musicId,
        userId : userId, // 추가한 유저의 아이디
        title: sound.musicDTO.title,
        filePath:sound.musicDTO.filePath,
        nickname:sound.albumDTO.nickname,
        credit:3,
        status:"READY",
    }

    await axiosPost({endpoint: `/api/cart/add`,body:body});
  };

  export default handleDownload;