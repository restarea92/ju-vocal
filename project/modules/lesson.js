

import { initGSAP } from './gsapUtils.js';
const lessonApp = {

    // ========== Configuration ==========
    CONFIG: {
        VERSION: '1.0.0',
    },

    // ========== DOM Elements Cache ==========
    elements: {
        // Base element for the courses section
        baseElement: document.querySelector('#courses'),

        // Elements within the courses section
        get contentWrapper() { return this.baseElement?.querySelector('.content-wrapper')},
        get stickyElement() { return this.baseElement?.querySelector('.sticky-element')},
        get spacer() { return this.baseElement?.querySelector('.scroll-spacer')},
        get trigger() { return this.baseElement?.querySelector('.scroll-spacer')},

        // Grid elements
        get gridBox() { return this.baseElement?.querySelector('.courses-grid')},
        get gridCards() { 
            return gsap.utils.toArray(this.gridBox?.querySelectorAll('.course-card'));
        },
    },


    init() {
        // Initialize GSAP
        if (!initGSAP()) {
            console.error('GSAP initialization failed.');
            return;
        }
        this.initScroll();
    },

    // ========== Init Scroll ==========
    /**
     * Initialize scroll
     */
    initScroll() {
        const contentWrapper = this.elements.contentWrapper;
        const stickyElement = this.elements.stickyElement;

        const trigger = this.elements.trigger;
        const spacer = this.elements.spacer;

        const gridBox = this.elements.gridBox;
        const gridCards = this.elements.gridCards;
        const gridCardCount = gridCards.length;
        // 100 / gridCardCount;
        const gridCardRatio = 100 / (gridCardCount + 1);
        const gridCardHeight = parseFloat(getComputedStyle(gridCards[0]).height);

        gsap.set(gridCards, {
            force3D: true,
            z: 0,
            yPercent: (i) => { return 90 + (i * 5); },
            opacity: 0,
            scale: 1.1,
            filter: "brightness(1)",
        });
        
        gsap.set(contentWrapper, {
            paddingTop: "calc(var(--header-height) + var(--card-padding-vertical))",
        });

        gsap.set(stickyElement, {
            position: "sticky",
            top: "0",
            zIndex: 1,
        });

        gsap.set(spacer, {
            height: `calc(var(--lvh) * 200)`,
        });

        gridCards.forEach((card, i) => {
            const timelineReady = this.createTimeline({
                scrub: true,
                ease: "none",
                start:  `top+=${(i - 1) * gridCardRatio}% top+=20%`,
                end: `top+=${(i -1) * gridCardRatio }% 10%`,
            });

            const timeline1 = this.createTimeline({
                start:  `top+=${i * gridCardRatio}% top+=20%`,
                end: `top+=${(i) * gridCardRatio }% 10%`,
            });
            const timeline2 = this.createTimeline({
                start:  `top+=${(i + 1) * gridCardRatio}% top+=25%`,
                end: `top+=${(i + 1) * gridCardRatio }% 10%`,
            });
            const timeline3 = this.createTimeline({
                start:  `top+=${(i + 2) * gridCardRatio}% top+=30%`,
                end: `top+=${(i + 2) * gridCardRatio }% 10%`,
            });
            const timeline4 = this.createTimeline({
                start:  `top+=${(i + 3) * gridCardRatio}% top+=35%`,
                end: `top+=${(i + 3) * gridCardRatio }% 10%`,
            });

            if (i === 0) {
                gsap.set(card, {
                    force3D: true,
                    yPercent: 0,
                    opacity: 1,
                    scale: 1,
                    filter: "brightness(1)",
                    overflowY: "hidden",
                    border: "8px solid blue",
                });

                ScrollTrigger.create({
                    trigger: this.elements.trigger,
                    start: `top+=${i * gridCardRatio}% top`,
                    end: `top+=${(i + 1) * gridCardRatio}% top+=40%`,
                    onEnter: () => {
                        gsap.set(card, {
                            border: "8px solid red",
                        });
                    },
                    onUpdate: () => {
                        gsap.set(card, {
                            border: "8px solid yellow",
                        });
                    },
                    onLeave: () => {
                        gsap.set(card, {
                            border: "8px solid blue",
                        });
                    },
                    onLeaveBack: () => {
                        gsap.set(card, {
                            border: "8px solid blue",
                        });
                    }
                });
            }

            if (i > 0) {
                timelineReady.to(card, {
                    ease: "power1.inOut",
                    yPercent: 120,
                    scale: 1.1,
                    filter: "brightness(1)",
                }, 0);

                
                timeline1.to(card, {
                    ease: "power1.inOut",
                    yPercent: 0,
                    scale: 1,
                    filter: "brightness(1)",
                }, 0);

                timeline1.to(card, {
                    ease: "expo.out",
                    opacity: 1,
                }, 0);
            }


            if (i < gridCardCount - 1) {
                timeline2.to(card, {
                ease: "expo.inOut",
                    yPercent: -2,
                    opacity: 1,
                    scale: 0.95,
                    filter: "brightness(0.95)",
                }, 0);
            }

            if (i < gridCardCount - 2) {
                timeline3.to(card, {
                ease: "expo.inOut",
                    opacity: 0.5,
                    scale: 0.9,
                    yPercent: -3,
                    filter: "brightness(0.6)",
                }, 0);
            }
            if (i < gridCardCount - 3) {
                timeline4.to(card, {
                ease: "expo.inOut",
                    opacity: 0,
                    scale: 0.8,
                    yPercent: -5,
                    filter: "brightness(0.9)",
                }, 0);
            } 


        });
        
    },
    


    createTimeline(options = {}) {
        return gsap.timeline({
            scrollTrigger: {
                trigger: this.elements.trigger,
                start: "top top",
                end: "bottom bottom",
                scrub: 1, 
                ...options,
            }
        });
    },

};

export default lessonApp;
