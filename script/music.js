// ** 다운로드순, 이름순, 길이순에 사용되는 정렬 **

// 정렬 버튼 클릭 시 드롭다운 메뉴 표시/숨기기
// #sortIcon과 #sortKeyword 둘 다 클릭 시 동일한 동작 적용
// #sortIcon : "정렬" 옆 이모티콘 의미 / sortKeyword : "정렬" 단어 부분 의미
document.querySelectorAll('#sortIcon, #sortKeyword').forEach(function(element) {
    // #sortIcon과 #sortKeyword 클릭 이벤트 리스너 추가
    element.addEventListener('click', function() {
        var dropdown = document.getElementById('musicSortMenu');
        
        // 드롭다운 메뉴의 현재 상태에 따라 보이거나 숨기기
        // 드롭다운이 보이지 않으면 보이게, 보이면 숨기게 변경
        if (dropdown.style.display === "none" || dropdown.style.display === "") {
            dropdown.style.display = "block";  // 드롭다운 보이기
        } else {
            dropdown.style.display = "none";   // 드롭다운 숨기기
        }
    });
});
     
// 드롭다운의 옵션 선택 시 정렬 작업을 수행할 수 있도록 설정
document.querySelectorAll('#musicSortMenu li').forEach(function(item) {
    // 드롭다운 메뉴 내 각 리스트 아이템에 클릭 이벤트 리스너 추가
    item.addEventListener('click', function() {
        // data-sort 속성 값으로 어떤 정렬을 선택했는지 확인
        var sortType = this.getAttribute('data-sort');
        console.log(sortType + " 정렬 선택됨"); // 선택된 정렬 타입을 콘솔에 출력

        // 선택된 정렬 타입에 맞는 작업을 여기에 추가할 수 있음
        // 예를 들어 리스트를 정렬하는 로직을 작성 가능

        // 정렬 옵션 선택 후 드롭다운 메뉴 닫기
        document.getElementById('musicSortMenu').style.display = 'none';
    });
});

// 외부 클릭 시 드롭다운 메뉴 닫기
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('musicSortMenu');
    
    // 클릭된 요소가 #musicSortMenu 또는 #sortIcon, #sortKeyword 내부인지 확인
    const isClickInsideMenu = event.target.closest('#musicSortMenu, #sortIcon, #sortKeyword');
    
    // 드롭다운 영역 외부를 클릭한 경우 드롭다운 닫기
    if (!isClickInsideMenu && dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
    }
}); 

// --------------------------------------------------------------------------------
// ** 태그를 사용한 정렬 기능 **

document.addEventListener('DOMContentLoaded', function() {
    function createTagSection(target) {
        let sectionHTML = '';
        // 'target' 값에 따라 HTML 문자열을 설정합니다.
        if (target === 'instrument') {
            sectionHTML = `
                <div class="tag-section" id="instrument-section">
                    <span data-tag="piano" class="tag ${tagStates.piano ? 'active' : ''}">피아노</span>
                    <span data-tag="violin" class="tag ${tagStates.violin ? 'active' : ''}">바이올린</span>
                </div>
            `;
        } else if (target === 'mood') {
            sectionHTML = `
                <div class="tag-section" id="mood-section">
                    <span data-tag="happy" class="tag ${tagStates.happy ? 'active' : ''}">행복한</span>
                    <span data-tag="sad" class="tag ${tagStates.sad ? 'active' : ''}">슬픈</span>
                    <span data-tag="exciting" class="tag ${tagStates.exciting ? 'active' : ''}">즐거운</span>
                </div>
            `;
        } else if (target === 'genre') {
            sectionHTML = `
                <div class="tag-section" id="genre-section">
                    <span data-tag="classic" class="tag ${tagStates.classic ? 'active' : ''}">클래식</span>
                    <span data-tag="jazz" class="tag ${tagStates.jazz ? 'active' : ''}">재즈</span>
                    <span data-tag="rock" class="tag ${tagStates.rock ? 'active' : ''}">록</span>
                </div>
            `;
        }
        return sectionHTML;
    }

    document.querySelectorAll('.music-tag-sort-toggle').forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            const sectionId = `${target}-section`;
            const displayArea = document.querySelector('.music-tag-display');
            const existingSection = document.getElementById(sectionId);

            if (existingSection) {
            // fade-out 애니메이션 추가
            existingSection.classList.add('fade-out');

            // 애니메이션이 끝난 뒤에 요소 삭제
            existingSection.addEventListener('animationend', function() {
                existingSection.remove();
            });
            } else {
                const newSection = document.createElement('div');
                newSection.innerHTML = createTagSection(target);
                displayArea.appendChild(newSection);
            }
        });
    });

    document.querySelector('.music-tag-display').addEventListener('click', function(event) {
        if (event.target.classList.contains('tag')) {
            event.target.classList.toggle('active');
            const tagValue = event.target.getAttribute('data-tag');
            toggleTagState(tagValue);
            console.log(`클릭된 태그: ${tagValue}, 활성화 상태: ${tagStates[tagValue]}`);
        }
    });
});
