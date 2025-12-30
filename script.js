// ==========================================
// 똘주 영어교실 - 인터랙티브 스크립트
// ==========================================

// DOM 요소
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const revealElements = document.querySelectorAll('.reveal-on-scroll');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
const cursorGlow = document.getElementById('cursorGlow');
const cursorTrail = document.getElementById('cursorTrail');
const particleCanvas = document.getElementById('particleCanvas');
const confettiContainer = document.getElementById('confettiContainer');

// ==========================================
// 커스텀 커서 효과
// ==========================================
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // 트레일 즉시 이동
    if (cursorTrail) {
        cursorTrail.style.left = mouseX + 'px';
        cursorTrail.style.top = mouseY + 'px';
    }
});

// 부드러운 커서 따라가기
function animateCursor() {
    const ease = 0.15;
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;
    
    if (cursorGlow) {
        cursorGlow.style.left = cursorX + 'px';
        cursorGlow.style.top = cursorY + 'px';
    }
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// 호버 시 커서 확대
document.querySelectorAll('a, button, .tilt-card, .word-chip').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursorGlow) {
            cursorGlow.style.width = '80px';
            cursorGlow.style.height = '80px';
            cursorGlow.style.background = 'radial-gradient(circle, rgba(234, 88, 12, 0.6), transparent)';
        }
    });
    
    el.addEventListener('mouseleave', () => {
        if (cursorGlow) {
            cursorGlow.style.width = '40px';
            cursorGlow.style.height = '40px';
            cursorGlow.style.background = 'radial-gradient(circle, rgba(251, 146, 60, 0.6), transparent)';
        }
    });
});

// ==========================================
// 파티클 배경 애니메이션
// ==========================================
if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.hue = Math.random() * 40 + 20; // 오렌지-노랑 계열
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // 마우스와의 상호작용
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                this.x -= dx * force * 0.02;
                this.y -= dy * force * 0.02;
                this.opacity = Math.min(1, this.opacity + 0.1);
            }
            
            // 경계 체크
            if (this.x < 0 || this.x > particleCanvas.width ||
                this.y < 0 || this.y > particleCanvas.height) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // 파티클 생성
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }
    
    // 파티클 간 연결선
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(251, 146, 60, ${0.15 * (1 - distance / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// ==========================================
// 3D 틸트 카드 효과
// ==========================================
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.setProperty('--rotateX', `${rotateX}deg`);
        card.style.setProperty('--rotateY', `${rotateY}deg`);
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rotateX', '0deg');
        card.style.setProperty('--rotateY', '0deg');
    });
});

// ==========================================
// 마그네틱 버튼 효과
// ==========================================
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ==========================================
// 리플 버튼 효과
// ==========================================
document.querySelectorAll('.ripple-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            transform: translate(-50%, -50%);
            left: ${x}px;
            top: ${y}px;
            animation: rippleEffect 0.6s ease-out forwards;
            pointer-events: none;
        `;
        
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// 리플 애니메이션 스타일 추가
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        to {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ==========================================
// 모바일 메뉴 토글
// ==========================================
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('flex');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
    });
});

// ==========================================
// 스크롤 시 요소 나타나기 애니메이션
// ==========================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('revealed');
                
                // 워드칩 팝인 애니메이션 트리거
                const chips = entry.target.querySelectorAll('.word-chip.pop-in');
                chips.forEach((chip, i) => {
                    setTimeout(() => {
                        chip.style.animation = 'popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
                    }, i * 100);
                });
            }, index * 100);
        }
    });
}, observerOptions);

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// ==========================================
// Confetti 효과
// ==========================================
function createConfetti() {
    const colors = ['#f97316', '#fb923c', '#fbbf24', '#facc15', '#22c55e', '#ea580c'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                left: ${Math.random() * 100}vw;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation-duration: ${Math.random() * 2 + 2}s;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            confettiContainer.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 20);
    }
}

// 파이널 카드 관찰
const finalCard = document.querySelector('.final-card');
if (finalCard) {
    const finalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(createConfetti, 500);
                finalObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    finalObserver.observe(finalCard);
}

// ==========================================
// 스무스 스크롤
// ==========================================
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

// ==========================================
// 네비게이션 스크롤 효과
// ==========================================
const nav = document.querySelector('nav');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.8)';
        nav.style.boxShadow = 'none';
    }
    
    lastScrollY = currentScrollY;
});

// ==========================================
// 카운터 애니메이션
// ==========================================
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
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            
            statNumbers.forEach((stat, index) => {
                const target = parseInt(stat.dataset.target);
                if (!isNaN(target)) {
                    stat.textContent = '0';
                    setTimeout(() => {
                        animateCounter(stat, target, 1500);
                    }, index * 200);
                }
            });
        }
    });
}, { threshold: 0.5 });

const messageSection = document.querySelector('#message');
if (messageSection) {
    statsObserver.observe(messageSection);
}

// ==========================================
// Parallax 효과
// ==========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // 배경 오브 패럴랙스
    document.querySelectorAll('.floating-orb').forEach((orb, index) => {
        const speed = (index + 1) * 0.03;
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    // 이모지 패럴랙스
    document.querySelectorAll('.floating-emoji').forEach((emoji, index) => {
        const speed = (index + 1) * 0.02;
        emoji.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ==========================================
// 타이핑 효과 (히어로 텍스트)
// ==========================================
const typewriterText = document.querySelector('.typewriter-text');
if (typewriterText && window.innerWidth > 768) {
    const text = typewriterText.textContent;
    typewriterText.textContent = '';
    typewriterText.style.width = 'auto';
    typewriterText.style.animation = 'none';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            typewriterText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        } else {
            typewriterText.style.borderRight = 'none';
        }
    }
    
    setTimeout(typeWriter, 1500);
}

// ==========================================
// 이미지 로딩 에러 핸들링 (placeholder 적용)
// ==========================================
document.querySelectorAll('.card-image img').forEach((img, index) => {
    img.onerror = function() {
        // Unsplash 교육 관련 이미지로 대체
        const placeholders = [
            'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop', // 알파벳
            'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400&h=300&fit=crop', // 칠판
            'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop', // 책
            'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop', // 학교
            'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop', // 공부
            'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop', // 노트
            'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=300&fit=crop', // 펜
            'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=300&fit=crop', // 독서
            'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop', // 대학
            'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop'  // 졸업
        ];
        this.src = placeholders[index] || placeholders[0];
    };
});

// ==========================================
// 초기 로드 애니메이션
// ==========================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
});

// ==========================================
// 푸터 파티클 효과
// ==========================================
const footerParticles = document.querySelector('.footer-particles');
if (footerParticles) {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(251, 146, 60, ${Math.random() * 0.2 + 0.1});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 5 + 5}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        footerParticles.appendChild(particle);
    }
}

// 푸터 파티클 애니메이션 스타일
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes floatParticle {
        0%, 100% { transform: translateY(0) translateX(0); }
        25% { transform: translateY(-20px) translateX(10px); }
        50% { transform: translateY(-10px) translateX(-10px); }
        75% { transform: translateY(-30px) translateX(5px); }
    }
`;
document.head.appendChild(particleStyle);

// ==========================================
// 이미지 라이트박스 기능
// ==========================================
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');

// 모든 카드 이미지에 클릭 이벤트 추가
document.querySelectorAll('.card-image').forEach(cardImage => {
    cardImage.addEventListener('click', (e) => {
        const img = cardImage.querySelector('img');
        if (img) {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// 닫기 버튼 클릭
lightboxClose.addEventListener('click', closeLightbox);

// 모달 배경 클릭 시 닫기
lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
        closeLightbox();
    }
});

// ESC 키로 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
    }
});

function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
        lightboxImage.src = '';
    }, 400);
}

console.log('🎓 일등학원 영어교실 웹사이트가 로드되었습니다! ✨');
console.log('🚀 화려한 애니메이션이 적용되었습니다!');
