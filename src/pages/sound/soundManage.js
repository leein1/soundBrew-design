import { router } from "/js/router.js";
import { serializeFormToJSON } from "/js/serialize/formToJson.js";
import { inputHandler } from "/js/check/inputHandler.js";
import { axiosGet, axiosPatch, axiosPost, axiosDelete } from "/js/fetch/standardAxios.js";
import { formatDate } from "/js/formatDate.js";

// -------------------------------------------------------------------
// 1. 편집/업데이트/삭제 관련 전역 함수 (me 버전)
// -------------------------------------------------------------------

window.enableMeEditing = function(button) {
  const row = button.closest('tr');

  // 기존 값 숨기기
  row.querySelectorAll('.current-value').forEach(span => {
    span.style.display = 'none';
  });

  // 수정 필드 보이기
  row.querySelectorAll('.editable-field').forEach(input => {
    input.style.display = 'inline-block';
  });

  // 버튼 상태 변경
  button.style.display = 'none';
  row.querySelector('.apply-button').style.display = 'inline-block';

  // 삭제 및 보기 버튼 (존재하면) 보이기
  const deleteButton = row.querySelector('.delete-button');
  if (deleteButton) deleteButton.style.display = 'inline-block';

  const watchButton = row.querySelector('.watch-button');
  if (watchButton) watchButton.style.display = 'inline-block';

  row.querySelector('.cancel-button').style.display = 'inline-block';
};

window.updateMeUI = function(row, updatedData, button) {
  row.querySelectorAll('.current-value').forEach(span => {
    const field = span.dataset.field;
    span.textContent = updatedData[field];
    span.style.display = 'inline-block';
  });

  row.querySelectorAll('.editable-field').forEach(input => {
    input.style.display = 'none';
  });

  row.querySelector('.edit-button').style.display = 'inline-block';
  button.style.display = 'none';
  row.querySelector('.cancel-button').style.display = 'none';
};

window.createMeFormData = function(row) {
  const form = document.createElement('form');
  form.id = 'myForm';

  row.querySelectorAll('.editable-field').forEach(input => {
    const name = input.dataset.field;
    const value = input.value;
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = name;
    hiddenInput.value = value;
    form.appendChild(hiddenInput);
  });

  return form;
};

window.applyMeAlbumsChanges = async function(button, albumId) {
  const row = button.closest('tr');
  const container = document.getElementById("render-update");
  container.innerHTML = ''; // 기존 폼 비우기
  const formData = createMeFormData(row);
  container.appendChild(formData);
  await sendMeAlbumsUpdateRequest(albumId, formData);
};

window.applyMeTracksChanges = async function(button, musicId) {
  const row = button.closest('tr');
  const container = document.getElementById("render-update");
  container.innerHTML = ''; // 기존 폼 비우기
  const formData = createMeFormData(row);
  container.appendChild(formData);
  await sendMeTracksUpdateRequest(musicId, formData);
};

window.cancelChanges = function(button) {
  const row = button.closest('tr');
  row.querySelectorAll('.editable-field').forEach(input => {
    const field = input.dataset.field;
    const currentValue = row.querySelector(`.current-value[data-field="${field}"]`).textContent;
    input.value = currentValue;
    input.style.display = 'none';
  });
  row.querySelectorAll('.current-value').forEach(span => {
    span.style.display = 'inline-block';
  });
  row.querySelector('.edit-button').style.display = 'inline-block';
  button.style.display = 'none';
  row.querySelector('.apply-button').style.display = 'none';
  const deleteButton = row.querySelector('.delete-button');
  if (deleteButton) deleteButton.style.display = 'none';
  const watchButton = row.querySelector('.watch-button');
  if (watchButton) watchButton.style.display = 'none';
};

// -------------------------------------------------------------------
// 2. API 요청 함수 (me 버전)
// -------------------------------------------------------------------

window.sendMeAlbumsUpdateRequest = async function(albumId, formData) {
  const response = serializeFormToJSON(formData);
  console.log(response);
  const { errors, processedData } = inputHandler(response, formData);
//  const handle = {
//    onBadRequest: () => {
//      alert("입력한 정보에 오류가 있습니다.");
//      router.navigate("/me/sounds/albums");
//    },
//    onSuccess: () => {
//      alert("앨범 정보를 수정했습니다.");
//      router.navigate("/me/sounds/albums");
//    }
//  };
  const handle = {
      success:{
         navigate:"/me/sounds/albums"
      },
  };

  if (!errors) {
    await axiosPatch({ endpoint: '/api/me/albums/' + albumId, body: processedData, handle });
  }
};

window.sendMeTracksUpdateRequest = async function(musicId, formData) {
  const response = serializeFormToJSON(formData);
  const { errors, processedData } = inputHandler(response, formData);
  const handle = {
        success:{
           navigate:"/me/sounds/tracks"
        },
    };
  if (!errors) {
    await axiosPatch({ endpoint: '/api/me/tracks/' + musicId, body: processedData, handle });
  }
};

// -------------------------------------------------------------------
// 3. 정렬 및 드롭다운 메뉴 관련 헬퍼 함수 (me 버전)
// -------------------------------------------------------------------

function getSortIcon(sortOrder) {
  return sortOrder === 'asc' ? '\u25B2' : sortOrder === 'desc' ? '\u25BC' : '';
}

function registerTableHeaderSort() {
  const headerCells = document.querySelectorAll(".table-container thead th");
  const url = new URL(window.location.href);
  headerCells.forEach(th => {
    let sortKey = "";
    const headerText = th.textContent.trim();
    if (headerText === "ID") {
      sortKey = "albumId";
    } else if (headerText === "아티스트") {
      sortKey = "userId";
    } else if (headerText === "업로드일") {
      sortKey = "createDate";
    } else {
      return;
    }
    if (!th.dataset.originalText) {
      th.dataset.originalText = headerText;
    }
    th.style.cursor = "pointer";
    const sortOrder = url.searchParams.get(`more[${sortKey}]`);
    if (sortOrder) {
      th.setAttribute("data-direction", sortOrder);
      th.innerHTML = `${th.dataset.originalText} ${getSortIcon(sortOrder)}`;
    }
    th.addEventListener("click", function() {
      let currentDirection = th.getAttribute("data-direction") || "asc";
      currentDirection = currentDirection === "asc" ? "desc" : "asc";
      th.setAttribute("data-direction", currentDirection);
      th.innerHTML = `${th.dataset.originalText} ${getSortIcon(currentDirection)}`;
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set(`more[${sortKey}]`, currentDirection);
      router.navigate(newUrl.toString());
    });
  });
}

function registerTableHeaderSortForTrack() {
  const headerCells = document.querySelectorAll(".table-container thead th");
  const url = new URL(window.location.href);
  headerCells.forEach(th => {
    let sortKey = "";
    const headerText = th.textContent.trim();
    if (headerText === "ID") {
      sortKey = "musicId";
    } else if (headerText === "업로드일") {
      sortKey = "createDate";
    } else {
      return;
    }
    if (!th.dataset.originalText) {
      th.dataset.originalText = headerText;
    }
    th.style.cursor = "pointer";
    const sortOrder = url.searchParams.get(`more[${sortKey}]`);
    if (sortOrder) {
      th.setAttribute("data-direction", sortOrder);
      th.innerHTML = `${th.dataset.originalText} ${getSortIcon(sortOrder)}`;
    }
    th.addEventListener("click", function() {
      let currentDirection = th.getAttribute("data-direction") || "asc";
      currentDirection = currentDirection === "asc" ? "desc" : "asc";
      th.setAttribute("data-direction", currentDirection);
      th.innerHTML = `${th.dataset.originalText} ${getSortIcon(currentDirection)}`;
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set(`more[${sortKey}]`, currentDirection);
      router.navigate(newUrl.toString());
    });
  });
}

export function renderMeSoundsSort() {
  const container = document.getElementById('chart-selector-container');
  if (!container) return;
  const uniqueSuffix = Date.now() + Math.floor(Math.random() * 1000);
  const sortKeywordId = `sortKeyword_${uniqueSuffix}`;
  const musicSortMenuId = `musicSortMenu_${uniqueSuffix}`;
  const item = document.createElement('div');
  item.classList.add('music-sort');
  item.innerHTML = `
    <div class="sort-01">
      <span class="music-sort-left" id="${sortKeywordId}">
        <img src="/images/swap_vert_48dp_5F6368_FILL0_wght400_GRAD0_opsz48.svg" alt="정보 전환">정보 전환
      </span>
      <div class="music-sort-menu" id="${musicSortMenuId}">
        <ul>
          <li data-category="album">앨범 정보</li>
          <li data-category="music">음원 정보</li>
          <li data-category="tags">태그 정보</li>
        </ul>
      </div>
    </div>
  `;
  container.appendChild(item);
  setupMeSoundsDropdownEvents(sortKeywordId, musicSortMenuId);
}

function setupMeSoundsDropdownEvents(sortKeywordId, musicSortMenuId) {
  const sortKeyword = document.getElementById(sortKeywordId);
  const menu = document.getElementById(musicSortMenuId);
  sortKeyword.addEventListener('click', () => {
    menu.classList.toggle('visible');
  });
  menu.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
      menu.classList.remove('visible');
      menu.querySelectorAll('li').forEach(item => item.classList.remove('active'));
      li.classList.add('active');
      const category = li.getAttribute('data-category');
      switch (category) {
        case 'album':
          router.navigate('/me/sounds/albums');
          break;
        case 'music':
          router.navigate('/me/sounds/tracks');
          break;
        case 'tags':
          router.navigate('/me/sounds/tags');
          break;
        default:
          break;
      }
    });
  });
}

// -------------------------------------------------------------------
// 4. 화면 렌더링 함수 (me 버전)
// -------------------------------------------------------------------

// [앨범 뷰] - 앨범 목록 렌더링 (레코드 클릭 시 모달로 음원 목록 보기)
export async function renderMeAlbums(data) {
  const container = document.getElementById("content-body");
  container.innerHTML = '';
  if (data.dtoList && data.dtoList.length > 0) {
    const manageHTML = `
      <h3>앨범 정보 수정</h3>
      <div id="render-update" class="render-update"></div>
      <div id="chart-selector-container"></div>
      <table class="table-container">
        <thead>
          <tr>
            <th>ID</th>
            <th>회원 ID</th>
            <th>아티스트</th>
            <th>앨범 제목</th>
            <th>앨범 설명</th>
            <th>업로드일</th>
            <th>수정일</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          ${data.dtoList.map(item => `
            <tr data-album-id="${item.albumDTO.albumId}" data-user-id="${item.albumDTO.userId}">
              <td>${item.albumDTO.albumId}</td>
              <td>${item.albumDTO.userId}</td>
              <td>${item.albumDTO.nickname}</td>
              <td>
                <span class="current-value" data-field="albumName">${item.albumDTO.albumName}</span>
                <input type="text" class="editable-field" data-field="albumName" value="${item.albumDTO.albumName}" style="display: none;">
              </td>
              <td>
                <span class="current-value" data-field="description">${item.albumDTO.description}</span>
                <input type="text" class="editable-field" data-field="description" value="${item.albumDTO.description}" style="display: none;">
              </td>
              <td>${formatDate(item.albumDTO.createDate)}</td>
              <td>${formatDate(item.albumDTO.modifyDate)}</td>
              <td>
                <button class="edit-button" onclick="enableMeEditing(this)">수정하기</button>
                <button class="apply-button" style="display: none;" onclick="applyMeAlbumsChanges(this, ${item.albumDTO.albumId})">적용</button>
                <button class="cancel-button" style="display: none;" onclick="cancelChanges(this)">취소</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    container.innerHTML = manageHTML;
    renderMeSoundsSort();
    const tbody = container.querySelector("tbody");
    tbody.addEventListener("click", function(event) {
      const targetTag = event.target.tagName.toLowerCase();
      if (targetTag === "button" || targetTag === "input") return;
      const tr = event.target.closest("tr");
      if (tr && tr.dataset.albumId && tr.dataset.userId) {
        openAlbumModal(tr.dataset.userId, tr.dataset.albumId);
      }
    });
    registerTableHeaderSort();
  } else {
    container.innerHTML = '<p>앨범이 없습니다.</p>';
  }
}

async function openAlbumModal(userId, albumId) {
  const response = await axiosGet({ endpoint: `/api/me/albums/${albumId}/tracks` });
  const modalTitle = document.querySelector('#soundDetailModal h2');
  modalTitle.innerText = `앨범 ${albumId}의 음원 정보 수정`;
  const modalBody = document.getElementById('sound-detail-modal-body');
  if (response.dtoList && response.dtoList.length > 0) {
    modalBody.innerHTML = `
      <h3>음원 정보 수정</h3>
      <div id="render-update" class="render-update"></div>
      <div class="table-wrapper">
        <table class="table-container">
          <thead>
            <tr>
              <th>ID</th>
              <th>아티스트</th>
              <th>음원 제목</th>
              <th>음원 설명</th>
              <th>업로드일</th>
              <th>수정일</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            ${response.dtoList.map(manage => `
              <tr data-track-id="${manage.musicDTO.musicId}">
                <td>${manage.musicDTO.musicId}</td>
                <td>${manage.musicDTO.nickname}</td>
                <td>
                  <span class="current-value" data-field="title">${manage.musicDTO.title}</span>
                  <input type="text" class="editable-field" data-field="title" value="${manage.musicDTO.title}" style="display: none;">
                </td>
                <td>
                  <span class="current-value" data-field="description">${manage.musicDTO.description}</span>
                  <input type="text" class="editable-field" data-field="description" value="${manage.musicDTO.description}" style="display: none;">
                </td>
                <td>${formatDate(manage.musicDTO.createDate)}</td>
                <td>${formatDate(manage.musicDTO.modifyDate)}</td>
                <td>
                  <button class="edit-button" onclick="enableMeEditing(this)">수정하기</button>
                  <button class="apply-button" style="display: none;" onclick="applyMeTracksChanges(this, ${manage.musicDTO.musicId})">적용</button>
                  <button class="delete-button" style="display: none;" onclick="applyMeTrackDelete(this, ${manage.musicDTO.musicId})">삭제</button>
                  <button class="cancel-button" style="display: none;" onclick="cancelChanges(this)">취소</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else {
    modalBody.innerHTML = '<p>음원이 없습니다.</p>';
  }
  document.getElementById('soundDetailModal').style.display = 'block';
}

// [트랙 뷰] - 음원(트랙) 목록 렌더링 (태그 수정 대상)
export async function renderMeTags(data) {
  const container = document.getElementById("content-body");
  container.innerHTML = '';
  if (data.dtoList && data.dtoList.length > 0) {
    const manageHTML = `
      <h3>음원 태그 수정</h3>
      <div id="render-update" class="render-update"></div>
      <div id="chart-selector-container"></div>
      <div class="table-wrapper">
        <table class="table-container">
          <thead>
            <tr>
              <th>ID</th>
              <th>아티스트</th>
              <th>음원 제목</th>
              <th>악기 태그</th>
              <th>무드 태그</th>
              <th>장르 태그</th>
              <th>생성일</th>
              <th>수정일</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            ${data.dtoList.map(manage => `
              <tr data-track-id="${manage.musicDTO.musicId}">
                <td>${manage.musicDTO.musicId}</td>
                <td>${manage.albumDTO.nickname}</td>
                <td>${manage.musicDTO.title}</td>
                <td>
                  <span class="current-value" data-field="instTags">${manage.tagsStreamDTO.instrumentTagName}</span>
                </td>
                <td>
                  <span class="current-value" data-field="moodTags">${manage.tagsStreamDTO.moodTagName}</span>
                </td>
                <td>
                  <span class="current-value" data-field="genreTags">${manage.tagsStreamDTO.genreTagName}</span>
                </td>
                <td>${formatDate(manage.musicDTO.createDate)}</td>
                <td>${formatDate(manage.musicDTO.modifyDate)}</td>
                <td>
                  <button type="button" class="open-tag-modal">태그 찾기</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    container.innerHTML = manageHTML;
    registerTableHeaderSortForTrack();
    renderMeSoundsSort();
    // "태그 찾기" 버튼 이벤트 바인딩
    document.querySelectorAll(".open-tag-modal").forEach(button => {
      button.addEventListener("click", () => {
        const row = button.closest("tr");
        const currentTrackId = row.dataset.trackId;
        openTagModal(currentTrackId);
      });
    });
  } else {
    container.innerHTML = '<p>트랙이 없습니다.</p>';
  }
}

// 트랙 목록 렌더링 (앨범 없이 전체 트랙 보기)
export async function renderMeTracks(data) {
  try {
    const container = document.getElementById("content-body");
    container.innerHTML = '';

    if (data.dtoList && data.dtoList.length > 0) {
      const manageHTML = `
        <h3>음원 정보 수정</h3>
        <div id="render-update" class="render-update"></div>
        <div id="chart-selector-container"></div>
        <div class="table-wrapper">
          <table class="table-container">
            <thead>
              <tr>
                <th>ID</th>
                <th>아티스트</th>
                <th>음원 제목</th>
                <th>음원 설명</th>
                <th>업로드일</th>
                <th>수정일</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              ${data.dtoList.map(manage => `
                <tr>
                  <td>${manage.musicDTO.musicId}</td>
                  <td>${manage.albumDTO.nickname}</td>
                  <td>
                    <span class="current-value" data-field="title">${manage.musicDTO.title}</span>
                    <input type="text" class="editable-field" data-field="title" value="${manage.musicDTO.title}" style="display: none;">
                  </td>
                  <td>
                    <span class="current-value" data-field="description">${manage.musicDTO.description}</span>
                    <input type="text" class="editable-field" data-field="description" value="${manage.musicDTO.description}" style="display: none;">
                  </td>
                  <td>${formatDate(manage.musicDTO.createDate)}</td>
                  <td>${formatDate(manage.musicDTO.modifyDate)}</td>
                  <td>
                    <button class="edit-button" onclick="enableMeEditing(this)">수정하기</button>
                    <button class="apply-button" style="display: none;" onclick="applyMeTracksChanges(this, ${manage.musicDTO.musicId})">적용</button>
                    <button class="delete-button" style="display: none;" onclick="applyMeTrackDelete(this, ${manage.musicDTO.musicId})">삭제</button>
                    <button class="cancel-button" style="display: none;" onclick="cancelChanges(this)">취소</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      container.innerHTML = manageHTML;
    } else {
      container.innerHTML = '<p>트랙이 없습니다.</p>';
    }

    registerTableHeaderSortForTrack();
    renderMeSoundsSort();
  } catch (error) {
    console.error('Error occurred while rendering:', error);
  }
}

// -------------------------------------------------------------------
// 5. 태그 편집 모달 (재사용 가능한 단일 모달 구현)
// -------------------------------------------------------------------
function openTagModal(trackId) {
  // 단일 태그 편집 모달 생성 (없으면 생성)
  let tagModal = document.getElementById("tag-modal");
  if (!tagModal) {
    tagModal = document.createElement("div");
    tagModal.id = "tag-modal";
    tagModal.classList.add("modal", "hidden");
    tagModal.innerHTML = `
      <div class="modal-content">
        <h2>태그 선택</h2>
        <!-- 탭 영역 -->
        <div class="tag-tabs">
          <button type="button" class="tab-button active" data-type="instrument">악기</button>
          <button type="button" class="tab-button" data-type="mood">무드</button>
          <button type="button" class="tab-button" data-type="genre">장르</button>
        </div>
        <!-- 검색 및 목록 영역 -->
        <input type="text" id="tag-search" placeholder="태그 검색" />
        <ul id="tag-list"></ul>
        <button type="button" class="close-modal">닫기</button>
        <button type="button" class="reset-tags">태그 초기화</button>
        <button type="submit" class="apply-tags">수정 확정</button>
      </div>
      <section class="upload-section">
        <form id="tagForm">
          <ul id="selected-tags"></ul>
        </form>
      </section>
    `;
    document.body.appendChild(tagModal);
    // 모달 닫기 버튼 이벤트 (최초 등록)
    tagModal.querySelector(".close-modal").addEventListener("click", () => {
      tagModal.classList.add("hidden");
    });
    // 초기화 완료 플래그 설정
    tagModal.dataset.initialized = "true";
  }

  // 모달 내 요소들 선택 (이미 등록된 이벤트 리스너는 그대로 유지)
  const tagSearchInput = tagModal.querySelector("#tag-search");
  const tagListElement = tagModal.querySelector("#tag-list");
  const selectedTagsElement = tagModal.querySelector("#selected-tags");
  const resetTagsButton = tagModal.querySelector(".reset-tags");
  const tagForm = tagModal.querySelector("#tagForm");
  const tabButtons = tagModal.querySelectorAll(".tab-button");
  const applyTagsButton = tagModal.querySelector(".apply-tags");

  // 초기화: 값, 목록, 선택된 항목, hidden inputs 초기화
  tagSearchInput.value = "";
  tagListElement.innerHTML = "";
  selectedTagsElement.innerHTML = "";
  tagForm.querySelectorAll("input[type='hidden']").forEach(input => input.remove());

  let allTags = [];
  let currentTab = "instrument"; // 초기 탭 설정

  // (이미 이벤트가 등록되어 있다면 중복 등록하지 않음)
  if (!tagModal.dataset.eventsRegistered) {
    // 탭 버튼 클릭 이벤트 등록
    tabButtons.forEach(button => {
      button.addEventListener("click", () => {
        tabButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        currentTab = button.getAttribute("data-type");
        renderTagList(filterTagsByType(allTags, currentTab));
      });
    });

    // 태그 검색 이벤트 등록
    tagSearchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filtered = filterTagsByType(allTags, currentTab).filter(({ tag }) =>
        tag.toLowerCase().includes(searchTerm)
      );
      renderTagList(filtered);
    });

    // 리셋 버튼 이벤트 등록
    resetTagsButton.addEventListener("click", () => {
      selectedTagsElement.innerHTML = "";
      tagForm.querySelectorAll("input[type='hidden']").forEach(input => input.remove());
    });

    // 폼 제출 이벤트 등록
    tagForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      // 검증: 각 카테고리에서 최소한 하나 이상의 태그가 선택되어야 함 (배열 형태로 수집)
      const selectedInputs = Array.from(tagForm.elements).filter(el => el.type === "hidden");
      const selectedByType = { instrument: [], mood: [], genre: [] };
      selectedInputs.forEach(input => {
        if (input.name === "instrument") {
          selectedByType.instrument.push(input.value);
        } else if (input.name === "mood") {
          selectedByType.mood.push(input.value);
        } else if (input.name === "genre") {
          selectedByType.genre.push(input.value);
        }
      });
      if (selectedByType.instrument.length === 0 || selectedByType.mood.length === 0 || selectedByType.genre.length === 0) {
        alert("모든 태그 종류(악기, 무드, 장르)에서 하나 이상 선택해주세요.");
        return;
      }
      const jsonData = serializeFormToJSON(tagForm);
      console.log("Tag form data:", jsonData); // 디버깅 출력
      const { errors, processedData } = inputHandler(jsonData, tagForm);
      const handle = {
            success:{
               navigate:"/me/sounds/tags"
            },
        };
      if (!errors) {
        await axiosPost({ endpoint: `/api/me/tracks/${trackId}/tags`, body: processedData, handle });
        tagModal.classList.add("hidden");
      }
    });

    // "수정 확정" 버튼 클릭 시 폼 submit 이벤트 강제 발생
    applyTagsButton.addEventListener("click", () => {
      tagForm.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });

    // 마감: 이벤트 등록 완료 플래그
    tagModal.dataset.eventsRegistered = "true";
  }

  // 내부 헬퍼 함수: 현재 탭에 해당하는 태그만 반환
  function filterTagsByType(tags, type) {
    return tags.filter(tagObj => tagObj.type === type);
  }

  // 내부 헬퍼 함수: 태그 목록 렌더링
  function renderTagList(tags) {
    tagListElement.innerHTML = "";
    tags.forEach(({ tag, type }) => {
      const li = document.createElement("li");
      li.textContent = tag;
      li.addEventListener("click", () => {
        // 여러 개 선택 허용: 중복 선택은 막기
        const alreadySelected = Array.from(selectedTagsElement.children)
          .some(item => item.textContent === tag && item.getAttribute("data-type") === type);
        if (!alreadySelected) {
          const selectedLi = document.createElement("li");
          selectedLi.textContent = tag;
          selectedLi.setAttribute("data-type", type);
          selectedTagsElement.appendChild(selectedLi);
          // hidden input 추가 (이름 단순하게 지정)
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = type;
          input.value = tag;
          tagForm.appendChild(input);
        }
      });
      tagListElement.appendChild(li);
    });
  }

  // 태그 불러오기 (axiosGet가 응답 데이터를 바로 반환한다고 가정)
  async function fetchTags() {
    try {
      const response = await axiosGet({ endpoint: '/api/sounds/tags' });
      if (!response || !response.dtoList) {
        throw new Error("dtoList가 응답 데이터에 없습니다.");
      }
      const { dtoList } = response;
      allTags = [
        ...dtoList[0].instrument.map(tag => ({ tag, type: 'instrument' })),
        ...dtoList[0].mood.map(tag => ({ tag, type: 'mood' })),
        ...dtoList[0].genre.map(tag => ({ tag, type: 'genre' }))
      ].filter(item => item.tag);
      // 초기 탭에 맞게 렌더링
      renderTagList(filterTagsByType(allTags, currentTab));
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }
  fetchTags();
  tagModal.classList.remove("hidden");
}
