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
        onScroll: false,
        onResize: false,
    },
    
    init() {
        this.refreshDimensions();
        this.debugScrolling();

        window.addEventListener('scroll', () => this.updateScrollingState());
        window.addEventListener('resize', () => this.refreshDimensions());
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

    updateScrollingState() {
        this.state.onScroll = true;
        this.debugScrolling();
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
            <div style="position: fixed; top:1rem; left:1rem; background: blue; color:white; padding: 0.5rem; border: 4px solid red;">
                <p class="debugScroll">Is Scrolling: ${this.state.onScroll}</p>
                <p class="debugResize">Resizing: ${this.state.onResize}</p>
            </div>
        `
        document.body.insertAdjacentHTML('beforeend', elementHtml);
    }
};

document.addEventListener('DOMContentLoaded', () => common.init());


