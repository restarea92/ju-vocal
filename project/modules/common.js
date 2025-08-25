const common = {
    elements: {
        header: document.querySelector('header#doz_header_wrap'),
        root: document.documentElement
    },
    
    state: {
        headerHeight: 0,
        lvh: 0
    },
    
    init() {
        this.refreshDimensions();

        window.addEventListener('resize', () => this.refreshDimensions());
    },
    
    refreshDimensions() {
        this.updateViewportHeight();
        this.updateHeaderHeight();
    },
    
    updateViewportHeight() {
        const newLvh = this.toPx('1lvh');
        
        if (this.state.lvh < newLvh) {
            this.elements.root.style.setProperty('--lvh', `${newLvh}px`);
            this.state.lvh = newLvh;
        }
    },
    
    updateHeaderHeight() {
        const newHeight = this.elements.header?.getBoundingClientRect().height || 0;
        console.log(this.elements.header);
        if (this.state.headerHeight !== newHeight) {
            this.elements.root.style.setProperty('--header-height', `${newHeight}px`);
            this.state.headerHeight = newHeight;
        }
    },
    
    toPx(cssValue) {
        if (!document.body) return 0;
        
        const temp = document.createElement('div');
        temp.style.height = cssValue;
        document.body.appendChild(temp);
        
        const pixels = parseFloat(getComputedStyle(temp).height);
        temp.remove();
        
        return pixels;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    common.init()
});