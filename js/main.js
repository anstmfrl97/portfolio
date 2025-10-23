document.addEventListener('DOMContentLoaded', function () {
  const allSnapSections = gsap.utils.toArray(".snap");
  const mainSnapTargets = [
    document.querySelector("#intro_wrap"),
    document.querySelector("#profile_wrap"),
    document.querySelector("#skill_wrap"),
    document.querySelector("#work_wrap"),
    document.querySelector("#solving_wrap"),
    document.querySelector("#contact_wrap")
  ];
  const numSections = mainSnapTargets.length;
  const navButtons = document.querySelectorAll('.nav a[href^="#"]');
  const workWrap = document.querySelector("#work_wrap");
  const workGroup = document.querySelector("#work_wrap .work_group");
  const workSections = gsap.utils.toArray("#work_wrap .work");
  const totalWorkSections = workSections.length;

  // 2. active 클래스를 토글하는 함수 정의
  function setActive(link) {
    navButtons.forEach(el => el.classList.remove("active"));
    link.classList.add("active");
  }


  if (window.innerWidth >= 768) {
    // 여기에 768px 이상일 때만 실행할 자바스크립트 코드 작성
    // 2. 워크 섹션 가로 스크롤링 설정
    gsap.to(workSections, {
      // 마지막 섹션이 보이도록 전체 섹션을 왼쪽으로 이동 (-100% * (섹션 개수 - 1))
      xPercent: -100 * (totalWorkSections - 1),
      ease: "none",
      scrollTrigger: {
        trigger: workWrap,
        start: "top top", // #work_wrap이 뷰포트 상단에 닿을 때 시작
        // 스크롤 종료 지점: 모든 콘텐츠 폭 - 뷰포트 폭
        end: () => "+=" + (workGroup.scrollWidth - innerWidth + 1),
        pin: true,        // 스크롤하는 동안 #work_wrap 섹션을 고정
        scrub: 0.3,         // 스크롤과 애니메이션을 부드럽게 연결
        // 가로 스크롤 내부 스냅 설정 (각 work 슬라이드에 정확히 멈춤)
        snap: {
          snapTo: (value) => {
            return Math.round(value * (totalWorkSections - 1)) / (totalWorkSections - 1);
          },
          inertia: false
        },
        // 뷰포트 크기 변경 시 스크롤 위치 재계산
        invalidateOnRefresh: true
      }
    });


    //스크롤 스냅 + 네비 버튼 동기화
    mainSnapTargets.forEach((section, index) => {
      if (!section) return;
      const navLink = navButtons[index];
      const sectionId = section.id;

      // 1. 네비게이션 Active 상태 동기화
      ScrollTrigger.create({
        trigger: section,
        start: "top center", // 섹션이 뷰포트 중앙에 도달할 때 활성화
        end: "bottom center", // 섹션이 뷰포트 중앙을 벗어날 때 비활성화
        onToggle: self => {
          if (self.isActive) {
            setActive(navLink);

          }
        },
      });

      // 2. 세로 스크롤 스냅 적용 (work_wrap 제외)
      if (sectionId !== "work_wrap") {
        let snapEnd = "bottom top";
        // contact_wrap (마지막 섹션)의 경우, 문서 끝까지 스냅을 유지하도록 설정
        if (sectionId === "contact_wrap") {
          snapEnd = "max";
        }
        ScrollTrigger.create({
          trigger: section,
          start: "top top", // 시작 지점
          end: snapEnd, // 종료 지점
          snap: {
            snapTo: (progress) => {
              // 스크롤 진행률이 0.5 (절반) 이상일 때만 다음 섹션 (1)으로 스냅합니다.
              // 0.5 미만이면 현재 섹션 (0)으로 스냅됩니다.
              return progress > 0.5 ? 1 : 0;
            },
            duration: 0.6,
            ease: "power2.inOut",
            delay: 0.05,
            inertia: false
          }
        });
      }
    });

    // 3. 클릭 이벤트와 GSAP 스크롤 연동
    navButtons.forEach((button, index) => {
      button.addEventListener('click', (e) => {
        e.preventDefault(); // 기본 앵커 이동 동작 방지

        // 목표 섹션: mainSnapTargets 배열의 해당 인덱스 요소
        const targetSection = mainSnapTargets[index];
        if (!targetSection) return;
        // GSAP 스크롤 이동 애니메이션 실행
        gsap.to(window, {
          duration: 0.8,
          ease: "power2.inOut",
          scrollTo: targetSection, // 목표 섹션의 Y 위치로 스크롤

          // 💡 [핵심] 스크롤 애니메이션 완료 시 setActive 함수 호출
          onComplete: () => {
            setActive(button);
          }
        });
      });
    });


    //원형 움직임
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll(".sphere").forEach((sphere, i) => {
      let vx = gsap.utils.random(-3, 3); // x 속도
      let vy = gsap.utils.random(-3, 3); // y 속도
      let radius = sphere.offsetWidth / 2;

      // ScrollTrigger를 이용해 스크롤할 때마다 업데이트
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: self => {
          let progress = self.progress; // 스크롤 진행도 (0~1)

          // 현재 좌표
          let x = gsap.getProperty(sphere, "x") || 0;
          let y = gsap.getProperty(sphere, "y") || 0;

          let rect = sphere.getBoundingClientRect();
          let w = window.innerWidth;
          let h = window.innerHeight;

          // 좌우 충돌 감지
          if (rect.left + radius < 0 || rect.right - radius > w) {
            vx *= -1;
          }
          // 상하 충돌 감지
          if (rect.top + radius < 0 || rect.bottom - radius > h) {
            vy *= -1;
          }

          // 위치 업데이트
          gsap.set(sphere, {
            x: x + vx * 10, // 스크롤 움직임에 따라 조금씩 이동
            y: y + vy * 10
          });
        }
      });
    });

    // 네비 클릭 → 부드럽게 이동
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          gsap.to(window, {
            duration: 0.6,
            scrollTo: {
              y: target,
              autoKill: true
            },
            ease: "power2.out"
          });
        }
      });
    });
    //intro title
    const hide = (item) => {
      gsap.set(item, {
        autoAlpha: 0
      });
    }

    const animate = (item) => {
      let x = 0;
      let y = 0;
      let delay = item.dataset.delay;

      if (item.classList.contains("reveal_LTR")) {
        x = -100,
          y = 0
      } else if (item.classList.contains("reveal_BTT")) {
        x = 0,
          y = 100
      } else if (item.classList.contains("reveal_TTB")) {
        x = 0,
          y = -100
      } else {
        x = 100,
          y = 0;
      }

      gsap.fromTo(item, {
        autoAlpha: 0,
        x: x,
        y: y
      }, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        delay: delay,
        duration: 1.25,
        overwrite: "auto",
        ease: "expo"
      });
    };

    gsap.utils.toArray(".reveal").forEach(item => {
      hide(item);

      ScrollTrigger.create({
        trigger: item,
        start: "top bottom",
        end: "bottom top",
        markers: false,
        onEnter: () => {
          animate(item)
        }
      });
    });

    // 프로필 아이콘
    gsap.registerPlugin(ScrollTrigger);

    const icons = gsap.utils.toArray('.icon');

    // 떨어지기 + 바운스
    let tl = gsap.timeline({ paused: true });
    tl.to(icons, {
      y: 200, // 내려오는 위치
      duration: 1,
      ease: "bounce.out",
      stagger: 0.1
    });
    // 둥둥 떠다니기
    icons.forEach((el, i) => {
      tl.to(el, {
        y: "+=15",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      }, "-=0.5"); // 동시에 시작
    });

    // 스크롤 트리거
    ScrollTrigger.create({
      trigger: "#iconsSection",
      start: "top 80%",
      onEnter: () => tl.play(),
      onLeaveBack: () => tl.pause(0) // 위로 돌아가면 초기화
    });
    //스킬
    const runeswiper = new Swiper(".swiper-container", {
      effect: "slide",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 5
    });

    //skill back
    document.querySelectorAll('.skill_box').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('is-flipped');
      });
    });
  }


  if (window.innerWidth <= 767) {

    // 관찰할 요소들을 선택합니다.
    const fadeElements = document.querySelectorAll('.fade_in');

    // Observer 옵션 설정
    const observerOptions = {
      root: null, // 뷰포트를 기준으로 관찰 (기본값)
      rootMargin: '0px',
      // threshold: 0.5 (50%)를 의미하며, 요소의 50%가 보일 때 콜백 실행
      threshold: 0.1
    };

    // 콜백 함수 정의
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        // 요소가 50% 이상 보이면 (isIntersecting이 true)
        if (entry.isIntersecting) {
          // 'in-view' 클래스를 추가하여 페이드인 애니메이션을 활성화합니다.
          entry.target.classList.add('in-view');

          // 한 번만 페이드인 되게 하려면, 관찰을 중지합니다.
          observer.unobserve(entry.target);
        }
        /* 만약 스크롤을 올렸을 때 다시 사라지게 하고 싶다면:
        else {
            entry.target.classList.remove('in-view');
        }
        */
      });
    };

    // Intersection Observer 인스턴스 생성
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // 모든 요소를 관찰하도록 등록
    fadeElements.forEach(element => {
      observer.observe(element);
    });


    //스킬
    const runeswiper = new Swiper(".swiper-container", {
      effect: "slide",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 2,
      spaceBetween: 200
    });

    //skill back
    document.querySelectorAll('.skill_box').forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('is-flipped');
      });
    });

    // 네비 클릭 → 부드럽게 이동
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          gsap.to(window, {
            duration: 0.6,
            scrollTo: {
              y: target,
              autoKill: true
            },
            ease: "power2.out"
          });
        }
      });
    });

    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll(".sphere").forEach((sphere, i) => {
      let vx = gsap.utils.random(-3, 3); // x 속도
      let vy = gsap.utils.random(-3, 3); // y 속도
      let radius = sphere.offsetWidth / 2;

      // ScrollTrigger를 이용해 스크롤할 때마다 업데이트
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: self => {
          let progress = self.progress; // 스크롤 진행도 (0~1)

          // 현재 좌표
          let x = gsap.getProperty(sphere, "x") || 0;
          let y = gsap.getProperty(sphere, "y") || 0;

          let rect = sphere.getBoundingClientRect();
          let w = window.innerWidth;
          let h = window.innerHeight;

          // 좌우 충돌 감지
          if (rect.left + radius < 0 || rect.right - radius > w) {
            vx *= -1;
          }
          // 상하 충돌 감지
          if (rect.top + radius < 0 || rect.bottom - radius > h) {
            vy *= -1;
          }

          // 위치 업데이트
          gsap.set(sphere, {
            x: x + vx * 10, // 스크롤 움직임에 따라 조금씩 이동
            y: y + vy * 10
          });
        }
      });
    });


    // 모든 '더보기' 버튼을 선택합니다.
    const toggleButtons = document.querySelectorAll('.text_btn');

    toggleButtons.forEach(button => {
      button.addEventListener('click', () => {
        // 1. 텍스트 요소 찾기 (버튼의 형제 요소)
        const longText = button.previousElementSibling;

        // 2. CSS 'active' 클래스를 토글합니다.
        longText.classList.toggle('active');

        // 3. 버튼 텍스트를 '더보기'와 '접기'로 변경합니다.
        if (longText.classList.contains('active')) {
          button.textContent = '접기';
        } else {
          button.textContent = '+ 더보기';
        }
      });
    });

    // 2. 워크 섹션 가로 스크롤링 설정
    // gsap.to(workSections, {
    //   // 마지막 섹션이 보이도록 전체 섹션을 왼쪽으로 이동 (-100% * (섹션 개수 - 1))
    //   xPercent: -100 * (totalWorkSections - 1),
    //   ease: "none",
    //   scrollTrigger: {
    //     trigger: workWrap,
    //     start: "top top", // #work_wrap이 뷰포트 상단에 닿을 때 시작
    //     // 스크롤 종료 지점: 모든 콘텐츠 폭 - 뷰포트 폭
    //     end: () => "+=" + (workGroup.scrollWidth - innerWidth + 1),
    //     pin: true,        // 스크롤하는 동안 #work_wrap 섹션을 고정
    //     scrub: 0.3,         // 스크롤과 애니메이션을 부드럽게 연결
    //     // 가로 스크롤 내부 스냅 설정 (각 work 슬라이드에 정확히 멈춤)
    //     snap: {
    //       snapTo: (value) => {
    //         return Math.round(value * (totalWorkSections - 1)) / (totalWorkSections - 1);
    //       },
    //       inertia: false
    //     },
    //     // 뷰포트 크기 변경 시 스크롤 위치 재계산
    //     invalidateOnRefresh: true
    //   }
    // });
  }

})