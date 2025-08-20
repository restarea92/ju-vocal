
/**
 * Visual Scroll Animation Module
 * Handles scroll-triggered visual effects with GSAP and ScrollTrigger
 * @version 1.0.0
 */

import { initGSAP } from './gsapUtils.js';

const franchiseApp = {
    // ========== Configuration ==========
    CONFIG: {
        VERSION: '1.0.0',
    },

    // ========== DOM Elements Cache ==========
    elements: {
        spacer: document.querySelector('.hero-spacer'),
		container: document.querySelector('.business.common-container'),
		get trigger() { return this.spacer },
		get fixedWrapper() { return this.trigger?.querySelector('.fixed-wrapper'); },
		get content() { return this.trigger?.querySelector('.content')},
		get contentWrapper() { return this.trigger?.querySelector('.content-wrapper')},

		get contentTitle() {return this.trigger?.querySelector('.content-title')},
		get contentTitleText() { return this.trigger?.querySelector('.content-title-text')},

        get heroIntroCopyWrapper() { return this.trigger?.querySelector('.hero-intro-copy-wrapper'); },
        get heroIntroCopy() { return this.heroIntroCopyWrapper?.querySelector('.hero-intro-copy'); },
        get heroIntroCopyInner() { return this.heroIntroCopy?.querySelector('.hero-intro-copy-inner'); },

        get overlayBackground() { return this.trigger?.querySelector('.overlay-background'); },
    },
	
    // ========== Initialization ==========
	init() {
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
			}, 300); 
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
		const content = this.elements.content;
		const contentWrapper = this.elements.contentWrapper;
		const contentTitle = this.elements.contentTitle;
        const heroIntroCopyWrapper = this.elements.heroIntroCopyWrapper;
        const heroIntroCopy = this.elements.heroIntroCopy;
        const heroIntroCopyInner = this.elements.heroIntroCopyInner;
        const overlayBackground = this.elements.overlayBackground;
        
        if (trigger) {
			gsap.set(trigger, { 
				"--hero-scroll-inverted-progress": 1,
                "--hero-scroll-progress": 0,
				height: "clamp(2000pcalc(var(--lvh, 1lvh) * 200), 3000px)",
			});

			gsap.set(container, { 
				marginTop: "calc(-1 * var(--header-height))",
			});
		
			gsap.set(fixedWrapper, { 
				width:"100%",
				minHeight:"100lvh",
				position: "sticky",
			});

            gsap.set(contentTitle, {
                opacity: 1,
                filter: "blur(0px)",
            });

            gsap.set(overlayBackground, {
                filter: "blur(0px) brightness(1)",
            });

            gsap.set(heroIntroCopyInner, {
                opacity:0,
                yPercent: 100,
            });

			const fixedTop = parseFloat(getComputedStyle(container)
				.getPropertyValue('--fixed-wrapper-top')) || 0;


			this.tl = this.createTimeline({
				start: "top top",
				end: "bottom bottom+=10%",
                scrub: 0.3,
				onUpdate: self => {
					if (self.progress >= 1) {
						this.elements.container.classList.add('scroll-end');
					} else {
						this.elements.container.classList.remove('scroll-end');
					}
				}
			});

            this.tl.to(heroIntroCopyInner, {
				yPercent: 0,
			});

            this.createTimeline({
				start: "top top",
				end: "center top",
                scrub: 0.3,
			}).to(contentTitle, {
                ease: "expo.out",
                filter: "blur(16px)",
				opacity: 0,
			});

            this.createTimeline({
				start: "1% top",
				end: "center center",
                scrub: true,
			}).to(heroIntroCopyInner, {
                ease: "expo.out",
				opacity: 1,
			});

            this.createTimeline({
				start: "top top",
				end: "center top",
                scrub: 0.3,
			}).to(overlayBackground, {
                ease: "expo.out",
				filter: "blur(16px) brightness(0.25)",
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

export default franchiseApp;