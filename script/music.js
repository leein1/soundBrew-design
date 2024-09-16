    // ** 다운로드순, 이름순, 길이순에 사용되는 정렬 **
     
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

    // ** 태그를 사용한 정렬 기능 **

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

    // 모든 태그 span 요소들을 선택 (태그 필터링 용도)
    const tags = document.querySelectorAll('.music-tag .tag');

    // 각 태그에 클릭 이벤트 추가
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            // 태그 클릭 시 해당 태그 활성화/비활성화 상태를 토글
            this.classList.toggle('active');
            
            // 클릭된 태그의 데이터 속성(data-tag)을 콘솔에 출력
            const tagValue = this.getAttribute('data-tag');
            console.log('클릭된 태그:', tagValue);
        });
    });

    // 태그 관련 드롭다운 메뉴 열기/닫기 이벤트 처리
    document.querySelectorAll('.music-tag-sort-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            // 클릭된 버튼의 data-target 속성으로 어떤 메뉴를 열지 지정
            const targetId = this.getAttribute('data-target');
            const dropdownMenu = document.getElementById(targetId);

            // 모든 드롭다운 메뉴 닫기 (현재 클릭한 메뉴 제외)
            document.querySelectorAll('.music-tag-sort-menu').forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.classList.remove('active'); // 다른 메뉴는 닫기
                }
            });

            // 클릭한 드롭다운 메뉴를 토글 (보이기/숨기기)
            dropdownMenu.classList.toggle('active'); // 현재 메뉴는 토글
        });
    });

    // 드롭다운 메뉴 내 태그 선택 시 이벤트 처리
    document.querySelectorAll('.music-tag-sort-menu .tag').forEach(tag => {
        tag.addEventListener('click', function() {
            // 선택된 태그의 data-tag 값 추출
            const tagValue = this.getAttribute('data-tag');
            console.log('선택된 태그:', tagValue); // 선택된 태그 콘솔 출력

            // 모든 드롭다운 메뉴 닫기
            document.querySelectorAll('.music-tag-sort-menu').forEach(menu => {
                menu.classList.remove('active'); // 모든 메뉴 닫기
            });

            // music-tag 영역에서 동일한 data-tag 값을 가진 태그를 활성화 (active 클래스 추가)
            // 1차 sort에서 태그를 고르면, 해당 태그가 나열된 다른 곳에서도 선택한 태그를 체크 해주기 위함. == 태그를 고르면(활성화하면), 해당 태그는 다른 곳에서도 활성화됨 
            const correspondingTag = document.querySelector(`.music-tag .tag[data-tag="${tagValue}"]`);
            if (correspondingTag) {
                correspondingTag.classList.add('active'); // 해당 태그 활성화
            }
        });
    });

    // 외부 클릭 시 드롭다운 메뉴 닫기
    document.addEventListener('click', function(event) {
        // 클릭된 요소가 드롭다운 내부인지 확인
        const isClickInsideMenu = event.target.closest('.music-tag-sort-toggle, .music-tag-sort-menu');

        // 드롭다운 영역 외부를 클릭한 경우 모든 드롭다운 닫기
        if (!isClickInsideMenu) {
            document.querySelectorAll('.music-tag-sort-menu').forEach(menu => {
                menu.classList.remove('active'); // 드롭다운 닫기
            });
        }
    });

    // ** 이후 태그가 active 된 것을 확인하여 정렬기능을 구현해야함.
