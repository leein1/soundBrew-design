// src/components/AdminDashboard.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { axiosGet } from 'api/standardAxios';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend,} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import icons from 'assets/images/imageBarrel';
import { useCSSLoader } from 'hooks/useCSSLoader';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashBoard = () => {
  const cssFiles = useMemo(()=>[
    "/assets/css/sound/admin-main.css",
  ],[])

  useCSSLoader(cssFiles);

  // 1) 상태 훅
  const [stats, setStats] = useState(null);
  const [tagStats, setTagStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [subscriptionStats, setSubscriptionStats] = useState(null);

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
        case 'sound-users':
          navigate('/admin/albums');
          break;
        case 'info-users':
          navigate('/admin/users');
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
        const statsRes = await axiosGet({endpoint : '/api/statistic/sounds/stats'});
        const tagsRes = await axiosGet({endpoint:'/api/statistic/tags/stats'}); 
        const userRes = await axiosGet({endpoint:'/api/statistic/users/stats'}) ;
        const subscriptionRes = await axiosGet({endpoint:'/api/statistic/subscription/stats'});
         
        setStats(statsRes);
        setTagStats(tagsRes);
        setUserStats(userRes);
        setSubscriptionStats(subscriptionRes);
      } catch (err) {
        console.error('대시보드 통계 불러오기 실패', err);
      }
    }

    fetchData();
  }, []);

  // 5) 로딩 상태 처리 (훅 호출 이후)
  if (!stats || !tagStats || !userStats || !subscriptionStats) {
    return <p>데이터가 없습니다.</p>
  }

  // 6) stats ( sound )를 쓰는 데이타
  const doughnutData = {
    labels: ['앨범', '음원'],
    datasets: [{
      data: [stats.dto.totalAlbums, stats.dto.totalMusics],
      backgroundColor: ['rgba(255,159,64,0.6)', 'rgba(54,162,235,0.6)'],
      borderWidth: 1,
    }],
  };
  const barOptions = { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } };

  const topSellingMusicData={
    labels: stats.dto.topSellingMusic.map(item => item.title),
    datasets:[{
        label: '음원 판매',
        data: stats.dto.topSellingMusic.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
    }]
  }

  const topArtistsBySalesData={
    labels: stats.dto.topArtistsBySales.map(item => item.nickname),
    datasets:[{
        label: '음원 판매',
        data: stats.dto.topArtistsBySales.map(item => item.count),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
    }]
  }

  const topArtistsByUploadsData ={
    labels: stats.dto.topArtistsByUploads.map(item => item.nickname),
    datasets:[{
        label: '음원 등록',
        data: stats.dto.topArtistsByUploads.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
    }]
  }

  // tag stat를 쓰는 데이타 통계
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

  // user stat 를 쓰는 데이타 통계
  const userData ={
    labels : ['전체', '신규(today)', '신규(week)', '신규(month)', '구독 회원', '이메일 인증 회원'],
    datasets:[{
        data: [
            userStats.dto.totalUsers,
            userStats.dto.newUsersToday,
            userStats.dto.nwUsersWeek,
            userStats.dto.newUsersMonth,
            userStats.dto.subscribedUsers,
            userStats.dto.verifiedUsers
        ],
        backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
    }]
  }

  // subscription stat 를 쓰는 데이타 통꼐
//   const subscriptionData ={
//     labels:'예상 수익',
//     data: {
//         labels: subscriptionStats.dto.map(item => item.subscriptionName),
//         datasets: [{
//             label: '예상 월간 수익',
//             data: subscriptionStats.dto.map(item => item.monthlyRevenue),
//             backgroundColor: 'rgba(255, 205, 86, 0.6)',
//             borderColor: 'rgba(255, 205, 86, 1)',
//             borderWidth: 1
//         }]
//     }

  // 7) 렌더링
  return (
    <div className="in-body">
      {/* 드롭다운 */}
      <div id="chart-selector-container" className="music-sort">
        <div className="sort-01">
          <span className="music-sort-left" onClick={toggleDropdown}>
            <img src={icons.changeSection} style={{width: 20, height:20}} alt="정보 전환" />
            {showEditMenu ? '수정페이지' : activeGroup === 'group1' ? '업로드/다운로드 통계' : '사용 태그 통계'}
          </span>
          <div className={`music-sort-menu${dropdownOpen ? ' visible' : ''}`}>
            <ul>
              <li onClick={() => handleSelect({ category:'group1' })}>업로드/다운로드 통계</li>
              <li onClick={() => handleSelect({ category:'group2' })}>사용 태그 통계</li>
              <li onClick={()=> handleSelect({category:'group3'})}>유저 관련 통계</li>
              <li onClick={() => handleSelect({ chartType:'editPage' })}>수정페이지</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 통계 영역 */}
      {!showEditMenu ? (
        <div className="question-list">
          {activeGroup === 'group1' && (
            <div className="statistics-section">
              <div className="chart-group-container">
                <div className="chart-container"><Doughnut data={doughnutData} /></div>
                <div className="chart-container"><Bar data={topSellingMusicData} options={barOptions} /></div>
                <div className="chart-container"><Bar data={topArtistsBySalesData} options={barOptions} /></div>
                <div className="chart-container"><Bar data={topArtistsByUploadsData} options={barOptions} /></div>
              </div>
            </div>
          )}
          {activeGroup === 'group2' && (
            <div className="statistics-section">
              <div className="chart-group-container">
                <div className="chart-container"><Bar data={instrumentData} options={barOptions} /></div>
                <div className="chart-container"><Bar data={moodData} options={barOptions} /></div>
                <div className="chart-container"><Bar data={genreData} options={barOptions} /></div>
              </div>
            </div>
          )}
          {activeGroup === 'group3' && (
            <div className="statistics-section">
              <div className="chart-group-container">
                <div className="chart-container"><Doughnut data={userData} options={barOptions} /></div>
                {/* <div className="chart-container"><Bar data={subscriptionData} options={barOptions} /></div> */}
              </div>
            </div>
          )}
        </div>
      ) : (
        <ul className="dashboard-section">
          <li onClick={()=>handleEditClick('sound-users')}>
            <span className="main-text">음원 정보 확인</span><br/>
            <span className="sub-text">Manage Albums, Tracks, Tags</span>
            <img src={icons.nextIcon} alt="chevron"/>
          </li>
          <li onClick={()=>handleEditClick('info-users')}>
            <span className="main-text">유저 정보 수정</span><br/>
            <span className="sub-text">Manage My Info</span>
            <img src={icons.nextIcon} alt="chevron"/>
          </li>
        </ul>
      )}
    </div>
  );
}
export default AdminDashBoard;
