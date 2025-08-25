const common = {
    elements: {
        root: document.documentElement,
        get header() {
            return this.root.querySelector('header#doz_header_wrap');
        },

    },
    
    state: {
        headerHeight: 0,
        lvh: 0,
        events: {
            onScroll: false,
            onTouch: false,
            onTouchScroll: false,
            onResize: false,
            resizeTimeout: null,
        }
    },

    refreshDimensions() {
        clearTimeout(this.state.events.resizeTimeout);
        this.state.events.resizeTimeout = setTimeout(() => {
            this.updateViewportHeight();
            this.state.events.onResize = false;
        }, 100);
        this.updateHeaderHeight();
    },

    // state
    updateViewportHeight() {
        const newLvh = this.toPx('1lvh');

        if (this.state.events.onScroll || this.state.events.onTouchScroll) {
            lvhel.textContent = `onscroll상태에서 state.lvh: ${this.state.lvh} / newLvh: ${newLvh}`;
            if (this.state.lvh < newLvh) {
                this.state.events.onResize = true;
                this.elements.root.style.setProperty('--lvh', `${newLvh}px`);
                this.state.lvh = newLvh;
            }
        } else {
            lvhel.textContent = `onscroll아닌 상태 state.lvh: ${this.state.lvh} / newLvh: ${newLvh}`;
            this.state.events.onResize = true;
            this.elements.root.style.setProperty('--lvh', `${newLvh}px`);
            this.state.lvh = newLvh;
        }
    },
    
    updateHeaderHeight() {
        const newHeight = this.elements.header?.getBoundingClientRect().height || 0;
        
        if (this.state.headerHeight !== newHeight) {
            this.elements.root.style.setProperty('--header-height', `${newHeight}px`);
            this.state.headerHeight = newHeight;
        }
    },
    
    // utility
    toPx(cssValue) {
        if (!document.body) return 0;
        
        const temp = document.createElement('div');
        temp.style.height = cssValue;
        document.body.appendChild(temp);
        
        const pixels = parseFloat(getComputedStyle(temp).height);
        temp.remove();
        
        return pixels;
    },


    initEventListener() {
        let scrollTimeout,
            touchScrollTimeout;

        window.addEventListener('scroll', (event) => {
            clearTimeout(scrollTimeout);
            clearTimeout(touchScrollTimeout);
            this.state.events.onScroll = true;
            if (this.state.events.onTouch) {
                this.state.events.onTouchScroll = true;
            } else {
                touchScrollTimeout = setTimeout(() => {
                    this.state.events.onTouchScroll = false;
                }, 200);
            }
   
            scrollTimeout = setTimeout(() => {
                this.state.events.onScroll = false;
            }, 200);
        });

        window.addEventListener('touchstart', () => {
            clearTimeout(touchScrollTimeout);
            this.state.events.onTouch = true;
        });

        window.addEventListener('touchend', () => {
            clearTimeout(touchScrollTimeout);
            this.state.events.onTouch = false;
            touchScrollTimeout = setTimeout(() => {
                this.state.events.onTouchScroll = false;
            }, 200);
        });

        window.addEventListener('resize', () => {
            this.refreshDimensions();
        });
    },
    
    init() {

        this.refreshDimensions();

        this.initEventListener();
    },
};

document.addEventListener('DOMContentLoaded', () => common.init());


