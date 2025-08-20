const commonState = {
    elements: {
        header: document.querySelector('#doz_header_wrap'),
        docRoot: document.documentElement,
    },

    state: {
        headerHeight: 0,
        lvh: 0,
    },

    init() {
        this.updateState();
    },

    updateState() {
        this.setLvh();
        this.setHeaderHeight();
    },

    setLvh() {
        const originLvh = this.state.lvh;
        const newLvh = this.toPx('1lvh');

        if (originLvh < newLvh) {
            this.elements.docRoot.style.setProperty('--lvh', `${newLvh}px`);
            this.state.lvh = newLvh;
        }
    },

    setHeaderHeight() {
        const originHeaderHeight = this.state.headerHeight;
        const newHeaderHeight = this.elements.header
            ? this.elements.header.getBoundingClientRect().height
            : 0;

        if (originHeaderHeight !== newHeaderHeight) {
            this.elements.docRoot.style.setProperty('--header-height', `${newHeaderHeight}px`);
            this.state.headerHeight = newHeaderHeight;
        }
    },

    /**
     * Convert a CSS length value to pixels.
     * @param {string} value - The CSS length value to convert.
     * @returns {number} - The equivalent pixel value.
     */
    toPx(value) {
        if (!document.body) return 0; // fallback
        const tempElement = document.createElement('div');
        tempElement.style.height = value;
        document.body.appendChild(tempElement);
        const num = parseFloat(getComputedStyle(tempElement).height);
        document.body.removeChild(tempElement);
        return num;
    },
};

// 실행
document.addEventListener('DOMContentLoaded', () => commonState.init());
window.addEventListener('resize', () => commonState.updateState());

document.addEventListener('DOMContentLoaded', () => {
    commonState.init();
});

document.addEventListener('resize', () => {
    commonState.updateState();
});



document.addEventListener('DOMContentLoaded', () => {
    /**
     * Set the --lvh variable
     */


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
            'css 100lvh': `${getStringValueToPx('100lvh')}`,
            'current 100lvh': `${commonState.state.lvh * 100}px`,
            'css 1lvh': `${getStringValueToPx('1lvh')}`,
            'current 1lvh': `${commonState.state.lvh}px`,
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