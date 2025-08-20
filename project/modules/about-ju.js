
/**
 * about ju Scroll Animation Module
 * Handles scroll-triggered visual effects with GSAP and ScrollTrigger
 * @version 1.0.2
 */

import { initGSAP } from './gsapUtils.js';

const aboutJuScroll = {
    // ========== Configuration ==========
    CONFIG: {
        VERSION: '1.0.0',
    },

    // ========== DOM Elements Cache ==========
    elements: {
        spacer: document.querySelector('.hero-spacer'),
		container: document.querySelector('#about-ju.common-container'),
		get trigger() { return this.spacer },
		get fixedWrapper() { return this.trigger?.querySelector('.fixed-wrapper'); },
		get content() { return this.trigger?.querySelector('.content')},
		get contentWrapper() { return this.trigger?.querySelector('.content-wrapper')},
		get contentTitle() {return this.trigger?.querySelector('.content-title')},
		get contentTitleText() { return this.trigger?.querySelector('.content-title-text')},
		get overlay() { return this.trigger?.querySelector('.overlay-background'); },
        get contentTitleOverlay() { return this.trigger?.querySelector('.content-title-text .overlay-text-wrapper'); },
		get hiddenText() { return this.contentTitleOverlay?.querySelector('.hidden-text'); },
		get offsetText() { return this.contentTitleOverlay?.querySelector('.offset-text'); },
    },
	
    // ========== Initialization ==========
	init() {
		console.log(this.CONFIG.VERSION);
		if (!initGSAP()) return;

		this.setHeaderHeightVariable();
		this.initHeroScroll();

		let resizeTimer;
		let isTouching = false;

		// 모바일 터치 감지 (pinch zoom 포함)
		window.addEventListener("touchstart", () => {
			isTouching = true;
		});

		window.addEventListener("touchend", () => {
			setTimeout(() => { // 약간의 딜레이 후 터치 종료 처리
				isTouching = false;
			}, 500);
		});

		// 리사이즈 종료 감지 (디바운스)
		window.addEventListener("resize", () => {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => {
				if (!isTouching) {
					this.setHeaderHeightVariable();
					this.initHeroScroll();
				}
			}, 300); // 300ms 동안 추가 resize 이벤트 없을 때 실행
		});
	},


    // ========== Hero Scroll Animation Setup ==========
    initHeroScroll() {
        // 기존 타임라인 kill
        if (this.tl) {
            this.tl.kill();
            this.tl = null;
        }

		const trigger = this.elements.trigger;
		const container = this.elements.container;
		const fixedWrapper = this.elements.fixedWrapper;
		const overlay = this.elements.overlay;
		const overlayImage = overlay?.querySelector('img');
		const content = this.elements.content;
		const contentWrapper = this.elements.contentWrapper;
		const contentTitle = this.elements.contentTitle;
		const contentTitleText = this.elements.contentTitleText;

		const hiddenText = this.elements.hiddenText;
		const offsetText = this.elements.offsetText;
		const contentTitleOverlay = this.elements.contentTitleOverlay;

        if (trigger && contentTitleOverlay) {
			gsap.set(trigger, { 
				"--hero-scroll-inverted-progress": 1,
                "--hero-scroll-progress": 0,
				height: "clamp(3000px, calc(var(--lvh) * 200), 5000px)",
			});

			gsap.set(container, { 
				marginTop: "calc(-1 * var(--header-height))",
			});
		
			gsap.set(fixedWrapper, { 
				width:"100%",
				minHeight:"calc(var(--lvh) * 100)",
				position: "sticky",
			});

			gsap.set(contentTitle, {
				paddingTop:0,
			});

			const rect = contentTitleText.getBoundingClientRect();
			const centerX = window.innerWidth / 2;
			const centerY = window.innerHeight / 2;

			const offsetX = rect.left + rect.width / 2 - centerX;
			const offsetY = content.offsetTop - centerY;
			const fixedTop = parseFloat(getComputedStyle(container)
				.getPropertyValue('--fixed-wrapper-top')) || 0;
			
			const willChangeOverflow = document.querySelector('.will-change-overflow');
			const willChangeOverflowWidth = willChangeOverflow?.clientWidth || 0;
			gsap.set(fixedWrapper, { 
				"--will-change-overflow-width": `${willChangeOverflowWidth}px`,
			});

			gsap.set(contentTitleOverlay, {
				transformOrigin: "center",
				zIndex: 1,
				x: -offsetX,
				y: -offsetY - fixedTop,
				scale: "var(--title-overlay-scale)",
			});
			
			gsap.set(overlay, {
				willChange: "filter",
				filter: "blur(0)",
			});
			gsap.set(overlayImage, {
				willChange: "filter",
				filter: "brightness(0.9)",
			});

			this.tl = this.createTimeline({
				start: "top top",
				end: "center center",
				onUpdate: self => {
					if (self.progress >= 1) {
						this.elements.container.classList.add('scroll-end');
					} else {
						this.elements.container.classList.remove('scroll-end');
					}
				}
			});

			this.tl.to(contentTitleOverlay, {
				ease: "power3.inOut",
				y: 0,
			}, 0)
			.to(contentTitleOverlay, {
				ease: "power3.out", 
				x: 0,
				scale: 1,
			}, 0)
			.to(contentTitle, {
				ease: "power3.out", 
			}, 0)
			.to(overlay, {
				ease: "power3.out", 
				filter: "blur(32px)"
			}, 0) 
			.to(overlayImage, {
				ease: "power3.inOut", 
				filter: "brightness(0.33)",
			}, 0);
		} 
	},

    // ========== 상태 관리 ==========
    setHeaderHeightVariable() {
        const header = document.getElementById('doz_header_wrap');
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    },

    createTimeline(options = {}) {
        return gsap.timeline({
            scrollTrigger: {
                trigger: this.elements.trigger, 
                start: "top bottom",
                end: "bottom bottom",
                scrub: 1,
                onUpdate: self => {
                    // 필요한 경우 progress 활용 가능
                },
                ...options,
            }
        });
    },
}

export default aboutJuScroll;