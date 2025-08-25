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
            onResize: false,
            needResize: false,
        }
    },
    
    init() {
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
        
        this.refreshDimensions();
        this.debugScrolling();

        let resizeTimeout,
            scrollTimeout;

        window.addEventListener('scroll', (event) => {
                        clearTimeout(resizeTimeout);
            this.updateResizeState(true);
            resizeTimeout = setTimeout(() => {
                this.updateResizeState(false);
            }, 100);
            
        });
        window.addEventListener('scrollend', (event) => {
            this.updateScrollingState(false);
        });

        window.addEventListener('resize', (event) => {
            this.refreshDimensions();            
        });

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            this.updateResizeState(true);
            resizeTimeout = setTimeout(() => {
                this.updateResizeState(false);
            }, 100);
        });
        
    },
    
    refreshDimensions() {
        this.updateViewportHeight();
        this.updateHeaderHeight();
    },
    
    updateViewportHeight() {
        const newLvh = this.toPx('1lvh');
        
        this.elements.root.style.setProperty('--lvh', `${newLvh}px`);
        this.state.lvh = newLvh;
    },
    
    updateHeaderHeight() {
        const newHeight = this.elements.header?.getBoundingClientRect().height || 0;
        
        if (this.state.headerHeight !== newHeight) {
            this.elements.root.style.setProperty('--header-height', `${newHeight}px`);
            this.state.headerHeight = newHeight;
        }
    },

    updateScrollingState(isScrolling = true) {
        this.state.events.onScroll = isScrolling;
    },

    updateResizeState(isResizing = true) {
        this.state.events.onResize = isResizing;
    },
    
    toPx(cssValue) {
        if (!document.body) return 0;
        
        const temp = document.createElement('div');
        temp.style.height = cssValue;
        document.body.appendChild(temp);
        
        const pixels = parseFloat(getComputedStyle(temp).height);
        temp.remove();
        
        return pixels;
    },

    debugScrolling() {
        const elementHtml = `
            <div id="debugElement" style="display:flex; flex-direction:column; gap:0.5rem; z-index:99999; position: fixed; bottom:1rem; font-size:0.75rem; font-weight:900; left:1rem; background: blue; color:white; padding: 0.5rem; border: 4px solid red;">
                <span data-debug="onScroll">onScroll: false</span>
                <span data-debug="onResize">onResize: false</span>
                <span data-debug="needResize">needResize: false</span>
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
    }
};

document.addEventListener('DOMContentLoaded', () => common.init());


