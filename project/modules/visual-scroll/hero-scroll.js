// heroScroll.js
import { initGSAP } from '../gsapUtils.js';

const heroScroll = {
    options: {
        FRAME_COUNT: 125,
        FRAME_BASE_URL: 'https://raw.githubusercontent.com/restarea92/ju/main/media/webp_frames',
    },

    elements: {},

    frameManager: {
        images: [],
        currentFrame: 1,
        targetFrame: 1,
        rafId: null,

        getFrameUrl(index) {
            return `${heroScroll.options.FRAME_BASE_URL}/rdframe_${index.toString().padStart(4, '0')}.jpg`;
        },

        setCanvasSize(img) {
            heroScroll.elements.canvas.width = img.naturalWidth;
            heroScroll.elements.canvas.height = img.naturalHeight;
        },

        drawImage(index) {
            const img = this.images[index];
            if (img && img.complete) {
                heroScroll.elements.context.clearRect(0, 0, heroScroll.elements.canvas.width, heroScroll.elements.canvas.height);
                heroScroll.elements.context.drawImage(img, 0, 0);
            }
        },

        preloadImages(onComplete) {
            let loaded = 0;
            for (let i = 0; i < heroScroll.options.FRAME_COUNT; i++) {
                const img = new Image();
                img.src = this.getFrameUrl(i + 1);
                img.onload = () => {
                    loaded++;
                    if (loaded === heroScroll.options.FRAME_COUNT && onComplete) {
                        onComplete();
                    }
                };
                this.images.push(img);
            }
        },

        
        animateFrames() {
            if (this.currentFrame !== this.targetFrame) {
                this.currentFrame = this.targetFrame;
                this.drawImage(this.currentFrame);
            }
        },

        init() {
            if (!initGSAP()) return;

            const firstFrame = new Image();
            firstFrame.src = this.getFrameUrl(1);
            firstFrame.onload = () => {
                this.setCanvasSize(firstFrame);
                this.drawImage(0);
            };

            this.preloadImages(() => {
                this.setupScrollAnimation();
            });
        },

        setupScrollAnimation() {
            // frame 값을 객체 프로퍼티로 둔다고 가정 (예: this.currentFrame)
            this.currentFrame = 0;

            this.timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: heroScroll.elements.canvasWrapper,
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.5,  // 0.5초 정도 스크럽 딜레이 줌 (부드럽게 따라감)
                }
            });
            this.timeline.to(this, {
                onUpdate: (self) => {
                const progress = this.timeline.progress();
                   const frame = Math.min(heroScroll.options.FRAME_COUNT, Math.max(1, Math.ceil(progress * this.images.length)));
                    if (frame !== this.targetFrame) {
                        this.targetFrame = frame;
                        this.animateFrames();
                    }
                }
            });
        }
    },

    initElements() {
        this.elements = {
            canvas: document.getElementById('hero-lightpass'),
            context: document.getElementById('hero-lightpass').getContext('2d'),
            centerSvg: document.getElementById('center-svg'),
            centerText: document.getElementById('center-text'),
            canvasWrapper: document.getElementById('canvas-wrapper'),
            trigger: document.getElementById('canvas-wrapper'),
            maskLayer: document.querySelector('#maskLayer'),
        };
    },

    // ========== Mask Scroll ==========
    /**
     * Initialize Mask scroll animations
     */
    initMaskScroll() {
        const maskLayer = this.elements.maskLayer;
        const endSize = this.getInitialSize();
        const centerText = this.elements.centerText;
        const centerSvg = this.elements.centerSvg;
        const canvas = this.elements.canvas;
        // 초기 위치 세팅
        if (maskLayer) {
            const timeline = this.createTimeline();

            gsap.set(maskLayer, { 
                "--hero-scroll-inverted-progress": 1,
                "--hero-scroll-progress": 0,
                "--hero-scroll-brightness": 0.8,
            });  


            gsap.set(maskLayer, { 
                "--clip-path-end-size": `${50 - endSize / 2}%`,
                clipPath: `inset(
                    calc( (var(--fs-primary-title) + var(--header-height)) * var(--hero-scroll-progress) )
                    calc( var(--clip-path-end-size) * var(--hero-scroll-progress) )
                    calc( var(--fs-primary-title) * var(--hero-scroll-progress) )
                    calc( var(--clip-path-end-size) * var(--hero-scroll-progress) )
                    round calc( max(calc(var(--lvh) * 5), 5lvw) * var(--hero-scroll-progress) )
                )`,
            });

            // resize X
            let lastWidth = window.innerWidth;
            document.addEventListener('resize', () => { 
                const newWidth = window.innerWidth;
                if (newWidth !== lastWidth) {
                    lastWidth = newWidth;
                    const endSize = this.getInitialSize();
                    gsap.to(maskLayer, {
                        "--clip-path-end-size": `${50 - endSize / 2}%`,
                    });
                }
            });

            gsap.set(canvas, {
                filter: "brightness(var(--hero-scroll-brightness))",
            });

            this.createTimeline({
                start: "top -10%",
                end: "bottom 110%",
            }).to(maskLayer, {
                "--hero-scroll-inverted-progress": 0,
                 "--hero-scroll-progress": 1,
            }, 0);


            this.createTimeline().to(maskLayer, {
                ease: "power2.in",
                "--hero-scroll-brightness": 0.25,
            }, 0);
        } 

        if (centerSvg) {
            gsap.set(centerSvg, {
                "--center-svg-scale": 0.04,
            })

            this.createTimeline(
                {
                    start: "top top",
                    end: "bottom top",
                }
            ).to(centerSvg, {
                ease: "power3.in",
                "--center-svg-scale": 1,
            }, 0);
            
            
            this.createTimeline().to(centerSvg, {
                ease:"power3.out",
                opacity:1,
            }, 0);
        }
    },

    getInitialSize() {
        const content = document.querySelector('.sticky-element-content .content');
        const background = document.querySelector('.sticky-element-background');
        if (!content || !background) {
            return 50
        };

        const contentWidth = content.getBoundingClientRect().width;
        const containerWidth = background.getBoundingClientRect().width;
        const effectiveWidth = Math.min(contentWidth, window.innerWidth);
        
        const result = (effectiveWidth / containerWidth) * 100;
        return result;
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

    init() {
        this.initElements();
        this.frameManager.init();
        this.initMaskScroll();
    }
};


export default heroScroll;
