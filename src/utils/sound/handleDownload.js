import { axiosGet } from "../../api/standardAxios";
// 다운로드 버튼 핸들러
  const handleDownload = async (sound) => {
    const filePath = sound.musicDTO.filePath;
    try {
      const response = await axiosGet({
        endpoint: `/api/files/${filePath}`,
        useToken: true,
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response]));
      const a = document.createElement("a");
      a.href = url;
      a.download = filePath;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("다운로드 오류:", error);
    }
  };

  export default handleDownload;