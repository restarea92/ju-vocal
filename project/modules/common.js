const common = {
    elements: {
        root: document.documentElement,
        get header() {
            return this.root.querySelector('header#doz_header_wrap');
        },
        get debugElement() {
            return this.root.querySelector('#debugElement');
        }
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
        this.updateViewportHeight();
        this.updateHeaderHeight();
    },

    // state
    updateViewportHeight() {
        clearTimeout(this.state.events.resizeTimeout);
        const newLvh = this.toPx('1lvh');
        const debugElement = this.elements.debugElement;
        const lvhel = debugElement.querySelector('#lvh span');

        if (this.state.events.onScroll || this.state.events.onTouchScroll) {
            if (this.state.lvh < newLvh) {
                this.state.events.onResize = true;
                this.elements.root.style.setProperty('--lvh', `${newLvh}px`);
                this.state.lvh = newLvh;
                lvhel.textContent = `state.lvh: ${this.state.lvh} / newLvh: ${newLvh}`;
            }
        } else {
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

    // debug
    debugScrolling() {
        const elementHtml = `
            <div id="debugElement" style="display:flex; flex-direction:column; gap:0.5rem; z-index:99999; position: fixed; bottom:1rem; font-size:0.75rem; font-weight:900; left:1rem; background: blue; color:white; padding: 0.5rem; border: 4px solid red;">
                <span data-debug="onScroll">onScroll: false</span>
                <span data-debug="onTouch">onTouch: false</span>
                <span data-debug="onTouchScroll">onTouchScroll: false</span>
                <span data-debug="onResize">onResize: false</span>
                <div id="lvh">
                    <span>lvh: 0</span>
                </div>
            </div>

            <style>
                #debugElement span {
                    color: orange;
                }
                #debugElement span.true {
                    color: lime;
                }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', elementHtml);
    },

    initProxy() {
        this.state.events = new Proxy(this.state.events, {
            set: (target, prop, value) => {
                target[prop] = value;
                const debugElement = this.elements.debugElement;
                if (debugElement) {
                    // Use data attributes for mapping
                    const span = debugElement.querySelector(`[data-debug="${prop}"]`);
                    if (span) {
                        span.textContent = `${prop}: ${value}`;
                        span.className = `${value}`;
                    }
                }
                return true;
            }
        });
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
        this.initProxy();
        this.debugScrolling();

        this.refreshDimensions();

        this.initEventListener();
    },
};

document.addEventListener('DOMContentLoaded', () => common.init());


