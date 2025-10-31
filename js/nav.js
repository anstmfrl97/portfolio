// document.addEventListener('DOMContentLoaded', function() {
//     const nav = document.querySelector('.nav');
//     const menuOpen = document.querySelector('.nav_open'); // 열기 버튼
//     const menuClose = document.querySelector('.nav_close'); // 닫기 버튼

//     // 메뉴 열기
//     menuOpen.addEventListener('click', function(e) {
//         e.preventDefault();
//         nav.classList.add('open');
//         menuOpen.style.display = 'none';
//         menuClose.style.display = 'inline-block';
//     });

//     // 메뉴 닫기
//     menuClose.addEventListener('click', function(e) {
//         e.preventDefault();
//         closeNav();
//     });

//     // nav 영역 외부 클릭 시 닫기
//     document.addEventListener('click', function(e) {
//         if (nav.classList.contains('open') && !nav.contains(e.target) && !menuOpen.contains(e.target)) {
//             closeNav();
//         }
//     });

//     // nav 닫는 함수
//     function closeNav() {
//         nav.classList.remove('open');
//         menuClose.style.display = 'none';
//         menuOpen.style.display = 'inline-block';
//     }
// });

document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.nav');
    const menuOpen = document.querySelector('.nav_open'); // 열기 버튼
    const menuClose = document.querySelector('.nav_close'); // 닫기 버튼
    // 📌 추가: 내비게이션 내부의 모든 링크 요소를 선택합니다.
    const navLinks = nav.querySelectorAll('a');

    // nav 닫는 함수
    function closeNav() {
        nav.classList.remove('open');
        menuClose.style.display = 'none';
        menuOpen.style.display = 'inline-block';
    }

    // 메뉴 열기
    menuOpen.addEventListener('click', function(e) {
        e.preventDefault();
        nav.classList.add('open');
        menuOpen.style.display = 'none';
        menuClose.style.display = 'inline-block';
    });

    // 메뉴 닫기 (닫기 버튼 클릭 시)
    menuClose.addEventListener('click', function(e) {
        e.preventDefault();
        closeNav();
    });

    // nav 영역 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        if (nav.classList.contains('open') && !nav.contains(e.target) && !menuOpen.contains(e.target)) {
            closeNav();
        }
    });

    // 📌 핵심 수정/추가: 내비게이션 링크 클릭 시 메뉴 닫기
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 스크롤이 발생할 수 있도록 기본 동작(페이지 이동)은 유지합니다.
            // e.preventDefault()를 제거하거나, 주석 처리된 상태로 둡니다 (만약 원래 코드에서 #을 이용해 스크롤을 구현했다면).
            // 만약 JS로 스크롤을 직접 처리하고 있다면, 스크롤 로직 다음에 closeNav()를 호출하세요.
            
            // 링크 클릭 후 바로 메뉴 닫기
            closeNav();
        });
    });
});