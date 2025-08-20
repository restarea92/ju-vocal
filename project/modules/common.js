const common = {
    elements: {
        header: document.querySelector('#doz_header_wrap'),
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

document.addEventListener('DOMContentLoaded', () => common.init());




document.addEventListener('DOMContentLoaded', () => {


    // Create Debug display viewport size
    const debugContainer = document.createElement('div');
    debugContainer.style.position = 'fixed';
    debugContainer.style.top = 'calc(var(--header-height) + 2rem)';
    debugContainer.style.left = '2rem';
    debugContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    debugContainer.style.backdropFilter = 'blur(16px)';
    debugContainer.style.border = '2px solid #fff';
    debugContainer.style.borderRadius = '1rem';
    debugContainer.style.color = '#000';
    debugContainer.style.padding = '1rem';
    debugContainer.style.zIndex = '9999';
    debugContainer.style.minWidth = '200px';
    debugContainer.style.minHeight = '100px';
    debugContainer.classList.add('debug-viewport-size');
    debugContainer.style.display = 'flex';
    debugContainer.style.flexDirection = 'column';
    debugContainer.style.gap = '0.5rem';

    debugContainer.innerHTML = `
        <span style="font-size:1.25rem; font-weight:700">Debug & Status Info</span>
        <div class="debug-contents" style="display:grid; grid-template-columns: max-content 1fr; gap:0 1rem; font-size:0.75rem">

        </div>
    `;
    document.body.appendChild(debugContainer);

    const debugContents = debugContainer.querySelector('.debug-contents');
    const createDebugInfo = (obj) => {
        Object.keys(obj).forEach(key => {
            const createLabelSpan = document.createElement('span');
            createLabelSpan.style.fontWeight = '600';
            createLabelSpan.textContent = key + ':';
            debugContents.appendChild(createLabelSpan);

            const createValueSpan = document.createElement('span');
            createValueSpan.style.fontWeight = '400';
            createValueSpan.textContent = obj[key];
            debugContents.appendChild(createValueSpan);
        });
    };



    const getDebugInfo = () => {
        const debugInfo = {
            'css 100lvh': `${common.toPx('100lvh')}px`,
            'current 100lvh': `${common.state.lvh * 100}px`,
            'css 1lvh': `${common.toPx('1lvh')}px`,
            'current 1lvh': `${common.state.lvh}px`,
        };
        return debugInfo;
    };
    

    window.addEventListener('load', () => {
        debugContents.innerHTML = '';
        createDebugInfo(getDebugInfo());
    });

    window.addEventListener('resize', () => {
        debugContents.innerHTML = '';
        createDebugInfo(getDebugInfo());
    });

});