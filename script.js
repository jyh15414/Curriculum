// DOM 요소
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const revealElements = document.querySelectorAll('.reveal-on-scroll');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

// 모바일 메뉴 토글
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('flex');
});

// 모바일 메뉴 링크 클릭 시 메뉴 닫기
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
    });
});

// 스크롤 시 요소 나타나기 애니메이션
const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    revealElements.forEach((element, index) => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - revealPoint) {
            // 순차적 딜레이 적용
            setTimeout(() => {
                element.classList.add('revealed');
            }, index * 50);
        }
    });
};

// 스크롤 이벤트 리스너 (throttle 적용)
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            revealOnScroll();
            ticking = false;
        });
        ticking = true;
    }
});

// 초기 로드 시 실행
window.addEventListener('load', () => {
    revealOnScroll();
    
    // 페이지 로드 애니메이션
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 스무스 스크롤 (추가 보정)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// 커리큘럼 스텝 호버 효과
const curriculumSteps = document.querySelectorAll('.curriculum-step');

curriculumSteps.forEach(step => {
    const stepNumber = step.querySelector('.step-number');
    
    step.addEventListener('mouseenter', () => {
        stepNumber.style.transform = 'translateX(-50%) scale(1.2)';
        stepNumber.style.boxShadow = '0 0 50px rgba(99, 102, 241, 0.8)';
    });
    
    step.addEventListener('mouseleave', () => {
        stepNumber.style.transform = 'translateX(-50%) scale(1)';
        stepNumber.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.5)';
    });
});

// 타이핑 효과 (선택적)
const typeWriter = (element, text, speed = 50) => {
    let i = 0;
    element.textContent = '';
    
    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
};

// Parallax 효과 (배경 orb)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orbs = document.querySelectorAll('.floating-orb');
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.05;
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// 네비게이션 스크롤 효과
const nav = document.querySelector('nav');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        nav.style.background = 'rgba(2, 6, 23, 0.9)';
    } else {
        nav.style.background = 'rgba(2, 6, 23, 0.7)';
    }
    
    lastScrollY = currentScrollY;
});

// 인터섹션 옵저버 (더 정교한 스크롤 애니메이션)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// 모든 reveal 요소 관찰
revealElements.forEach(element => {
    observer.observe(element);
});

// 카운터 애니메이션
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
};

// 통계 카드 애니메이션 트리거
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const animateStats = () => {
    if (statsAnimated) return;
    
    const statsSection = document.querySelector('#message');
    if (!statsSection) return;
    
    const rect = statsSection.getBoundingClientRect();
    
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        statsAnimated = true;
        
        statNumbers.forEach(stat => {
            const value = stat.textContent;
            if (!isNaN(parseInt(value))) {
                stat.textContent = '0';
                animateCounter(stat, parseInt(value), 1500);
            }
        });
    }
};

window.addEventListener('scroll', animateStats);

console.log('🎓 똘주 영어교실 웹사이트가 로드되었습니다!');

