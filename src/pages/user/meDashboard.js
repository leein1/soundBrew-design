// src/components/MeDashboard.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { axiosGet } from '../../api/standardAxios';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend,} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

import icons from '../../assets/images/imageBarrel';
import { useCSSLoader } from '../../hooks/useCSSLoader';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MeDashboard = () => {
  const cssFiles = useMemo(()=>[
    "/assets/css/sound/admin-main.css",
  ],[])

  useCSSLoader(cssFiles);

  // 1) 상태 훅
  const [stats, setStats] = useState(null);
  const [tagStats, setTagStats] = useState(null);
  const [activeGroup, setActiveGroup] = useState('group1');
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 2) 라우터
  const navigate = useNavigate();

  // 3) 이벤트 핸들러 훅들 (항상 로딩 리턴보다 위에)
  const toggleDropdown = useCallback(
    () => setDropdownOpen(o => !o),
    []
  );

  const handleSelect = useCallback(
    ({ category, chartType }) => {
      setDropdownOpen(false);
      if (chartType === 'editPage') {
        setShowEditMenu(true);
      } else {
        setShowEditMenu(false);
        setActiveGroup(category);
      }
    },
    []
  );

  const handleEditClick = useCallback(
    id => {
      switch (id) {
        case 'upload-sound':
          navigate('/me/sounds/upload');
          break;
        case 'sound-users':
          navigate('/me/sounds/albums');
          break;
        case 'info-users':
          navigate('/me/info');
          break;
        case 'subscription-users':
          navigate('/me/subscription');
          break;
        default:
          break;
      }
    },
    [navigate]
  );

  // 4) 데이터 패칭 훅
  useEffect(() => {
    async function fetchData() {
      try {
        const statsRes = await axiosGet({ endpoint: '/api/statistic/sounds/stats/me' });
        const tagsRes  = await axiosGet({ endpoint: '/api/statistic/tags/stats/me' });
        setStats(statsRes);
        setTagStats(tagsRes);
      } catch (err) {
        console.error('대시보드 통계 불러오기 실패', err);
      }
    }
    fetchData();
  }, []);

  // 5) 로딩 상태 처리 (훅 호출 이후)
  if (!stats || !tagStats) {
    return <div>로딩 중...</div>;
  }

  // 6) 차트 데이터 준비
  const doughnutData = {
    labels: ['앨범', '음원'],
    datasets: [{
      data: [stats.dto.albumCountTotal, stats.dto.musicCountTotal],
      backgroundColor: ['rgba(255,159,64,0.6)', 'rgba(54,162,235,0.6)'],
      borderWidth: 1,
    }],
  };
  const barOptions = { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } };

  const uploadBarData = {
    labels: ['일','주','월','총'],
    datasets:[{
      label:'업로드 통계',
      data:[
        stats.dto.musicCountDay,
        stats.dto.musicCountWeek,
        stats.dto.musicCountMonth,
        stats.dto.musicCountTotal
      ],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth:1
    }]
  };
  const downloadBarData = {
    labels: ['일','주','월','총'],
    datasets:[{
      label:'다운로드 통계',
      data:[
        stats.dto.downloadsDay,
        stats.dto.downloadsWeek,
        stats.dto.downloadsMonth,
        stats.dto.totalDownloads
      ],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };
  const topTrackBarData = {
    labels: stats.dto.topTrackTitles,
    datasets:[{
      label:'인기곡 통계',
      data: stats.dto.topTrackDownloadCounts,
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  };

  const instrumentData = {
    labels: tagStats.dto.instrumentUsageCount.map(i=>i.tagName),
    datasets:[{
      label:'악기 태그 사용 통계',
      data: tagStats.dto.instrumentUsageCount.map(i=>i.count),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth:1
    }]
  };
  const moodData = {
    labels: tagStats.dto.moodUsageCount.map(i=>i.tagName),
    datasets:[{
      label:'무드 태그 사용 통계',
      data: tagStats.dto.moodUsageCount.map(i=>i.count),
      backgroundColor: 'rgba(104, 72, 47, 0.6)',
      borderColor: 'rgb(82, 77, 146)',
      borderWidth:1
    }]
  };
  const genreData = {
    labels: tagStats.dto.genreUsageCount.map(i=>i.tagName),
    datasets:[{
      label:'장르 태그 사용 통계',
      data: tagStats.dto.genreUsageCount.map(i=>i.count),
      backgroundColor: 'rgba(109, 158, 77, 0.6)',
      borderColor: 'rgb(62, 132, 135)',
      borderWidth:1
    }]
  };

  // 7) 렌더링
  return (
    <div className="in-body">
      {/* 드롭다운 */}
      <div id="chart-selector-container" className="music-sort">
        <div className="sort-01">
          <span className="music-sort-left" onClick={toggleDropdown}>
            <img src={icons.changeSection} style={{width: 20, height:20}} alt="정보 전환" />
            {showEditMenu
              ? '수정페이지'
              : activeGroup === 'group1'
                ? '업로드/다운로드 통계'
                : '사용 태그 통계'}
          </span>
          <div className={`music-sort-menu${dropdownOpen ? ' visible' : ''}`}>
            <ul>
              <li onClick={() => handleSelect({ category:'group1' })}>업로드/다운로드 통계</li>
              <li onClick={() => handleSelect({ category:'group2' })}>사용 태그 통계</li>
              <li onClick={() => handleSelect({ chartType:'editPage' })}>수정페이지</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 통계 영역 */}
      {!showEditMenu ? (
        <div className="question-list">
          {activeGroup === 'group1' && (
            <div className="chart-category-section">
              <div className="chart-group-container">
                <div className="chart-container"><Doughnut data={doughnutData} /></div>
                <div className="chart-container"><Bar data={uploadBarData} options={barOptions} /></div>
                <div className="chart-container"><Bar data={downloadBarData} options={barOptions} /></div>
                <div className="chart-container"><Bar data={topTrackBarData} options={barOptions} /></div>
              </div>
            </div>
          )}
          {activeGroup === 'group2' && (
            <div className="chart-category-section">
              <div className="chart-group-container">
                <div className="chart-container"><Bar data={instrumentData} options={barOptions} /></div>
                <div className="chart-container"><Bar data={moodData} options={barOptions} /></div>
                <div className="chart-container"><Bar data={genreData} options={barOptions} /></div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <ul className="dashboard-section">
          <li onClick={()=>handleEditClick('upload-sound')}>
            <span className="main-text">음원 업로드</span><br/>
            <span className="sub-text">Upload Albums, Tracks, Tags</span>
            <img src={icons.nextIcon} alt="chevron"/>
          </li>
          <li onClick={()=>handleEditClick('sound-users')}>
            <span className="main-text">내 음원 정보 수정</span><br/>
            <span className="sub-text">Manage Albums, Tracks, Tags</span>
            <img src={icons.nextIcon} alt="chevron"/>
          </li>
          <li onClick={()=>handleEditClick('info-users')}>
            <span className="main-text">내 정보 수정</span><br/>
            <span className="sub-text">Manage My Info</span>
            <img src={icons.nextIcon} alt="chevron"/>
          </li>
          <li onClick={()=>handleEditClick('subscription-users')}>
            <span className="main-text">내 구독제 조회</span><br/>
            <span className="sub-text">Manage Subscription</span>
            <img src={icons.nextIcon} alt="chevron"/>
          </li>
        </ul>
      )}
    </div>
  );
};

export default MeDashboard;
