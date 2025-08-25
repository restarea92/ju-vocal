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
        needResize: false,
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

    updateScrollingState(isScrolling = true) {
        this.state.onScroll = isScrolling;
    },

    updateResizeScrollState(isResizing = true) {
        this.state.onResize = isResizing;
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
            <div style="display:flex; flex-direction:column; gap:0.5rem; z-index:99999; position: fixed; bottom:1rem; font-size:0.75rem; font-weight:900; left:1rem; background: blue; color:white; padding: 0.5rem; border: 4px solid red;">
                <span class="debugScroll">Is Scrolling: ${this.state.onScroll}</span>
                <span class="debugResize">Resizing: ${this.state.onResize}</span>
                <span class="debugResize">Need Resize: ${this.state.needResize}</span>
            </div>
        `
        document.body.insertAdjacentHTML('beforeend', elementHtml);
    }
};

document.addEventListener('DOMContentLoaded', () => common.init());


