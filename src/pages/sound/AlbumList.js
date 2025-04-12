import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosGet } from "../../api/standardAxios";

import Pagination from "../../components/Pagination";
import icons from "../../assets/images/imageBarrel";

const AlbumList = ({ data: propData, onPlay })=>{
    const navigate = useNavigate();
    const location = useLocation();

    const [responseData, setResponseData] = useState(null);

    useEffect(() => {
        if (propData) {
            setResponseData(propData);
            return;
        }
        const fetchTracks = async () => {
            try {
            const response = await axiosGet({ endpoint: `/api/sounds/albums${location.search}` });
            if (response && response.dtoList) {
                setResponseData(response);
            } else {
                setResponseData({ dtoList: [] });
            }
            } catch (error) {
            console.error("Error fetching albums:", error);
            setResponseData({ dtoList: [] });
            }
        };
        fetchTracks();
    }, [propData, location.search]);

    if (!responseData || !responseData.dtoList || responseData.dtoList.length === 0) {
        return <span>검색결과가 없습니다</span>;
    }

    return(
        <div className="list-albums">
            <h2 className="list-albums-title">
            {responseData.dtoList.length}개의 검색결과
            </h2>
            <h1 className="list-albums-title">Album Pack Search</h1>
            <div className="list-albums-list">
            {responseData.dtoList.map((album, idx) => (
                <div
                    key={`${album.albumDTO.albumName}-${album.albumDTO.nickname}-${idx}`}
                    className="list-album-item"
                    onClick={() =>
                        navigate(`/sounds/albums/one?nickname=${album.albumDTO.nickname}&albumName=${(album.albumDTO.albumName)}`)
                    }
                >
                    <img
                        className="list-album-image"
                        src={`https://d1lq7t3sqkotey.cloudfront.net/${album.albumDTO.albumArtPath}`}
                        alt="Album-Image"
                        onError={(e) => {
                            e.target.src = icons.defaultSoundImg;
                        }}
                    />
                    <div className="list-album-name">{album.albumDTO.albumName}</div>
                    <div className="list-album-artist">{album.albumDTO.nickname}</div>
                </div>
            ))}
            </div>
            <Pagination responseDTO={responseData} />
        </div>
    )
}

export default AlbumList;