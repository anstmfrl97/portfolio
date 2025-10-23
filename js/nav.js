document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.nav');
    const menuOpen = document.querySelector('.nav_open'); // 열기 버튼
    const menuClose = document.querySelector('.nav_close'); // 닫기 버튼

    // 메뉴 열기
    menuOpen.addEventListener('click', function(e) {
        e.preventDefault();
        nav.classList.add('open');
        menuOpen.style.display = 'none';
        menuClose.style.display = 'inline-block';
    });

    // 메뉴 닫기
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

    // nav 닫는 함수
    function closeNav() {
        nav.classList.remove('open');
        menuClose.style.display = 'none';
        menuOpen.style.display = 'inline-block';
    }
});