import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { axiosGet } from "../../api/standardAxios";
import { useEditableItem } from "../../hooks/useEditableItem";


const AdminUser = ()=>{
    const cssFiles = useMemo(() => [
        "/assets/css/sound/music.css",
        "/assets/css/sound/admin-main.css",
        "/assets/css/user/user-admin.css",
    ], []);

    useCSSLoader(cssFiles);

    const {
        editModeId,
        editedData,
        isEditing,
        startEdit,
        cancelEdit,
        handleChange,
    } = useEditableItem();

    const [user, setUser] = useState([]);
    const [responseData, setResponseData] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const location = useLocation();

    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(()=>{
        const fetch= async()=>{
            const params = new URLSearchParams(location.search);
            const response = await axiosGet({endpoint:``});

            if(response && response.dtoList){
                setResponseData(response);
            }else{
                setResponseData({dtoList:[]});
            }

            setUser(response.dtoList || []);
        }

        fetch();
    }, [location.search]);

    const handleApply = async () => {
        const { errors, processedData } = inputHandler(editedData, editedData);
        if (errors) {
          alert("입력값 오류: " + JSON.stringify(errors));
          return;
        }
        try {
          await axiosPatch({
            endpoint: `/api/me/albums/${editModeId}`,
            body: processedData,
          });
          cancelEdit();
        } catch (err) {
          console.error(err);
          alert("수정 실패");
        }
      };

    return(
        <></>
    );
}

export default AdminUser;