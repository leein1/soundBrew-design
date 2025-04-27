import { axiosGet } from "../../api/standardAxios";

const handleDownload = async (filePath) => {
  try {
    alert(filePath);
    const response = await axiosGet({endpoint: `/api/files/${filePath}`,useToken: true,responseType: "blob",});
    console.log(response);

    const blobData = response.data ?? response;

    const url = window.URL.createObjectURL(new Blob([blobData]));

    const a = document.createElement("a");
    a.href = url;
    a.download = filePath.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("다운로드 오류:", error);
  }
};

export default handleDownload;