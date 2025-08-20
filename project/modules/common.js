const getStringValueToPx = (value) => {
    if (!document.body) return '0px'; // fallback
    const tempElement = document.createElement('div');
    tempElement.style.height = value;
    document.body.appendChild(tempElement);
    const px = getComputedStyle(tempElement).height;
    document.body.removeChild(tempElement);
    return px;
};

const getStringValueToNum = (value) => {
    if (!document.body) return 0; // fallback
    const tempElement = document.createElement('div');
    tempElement.style.height = value;
    document.body.appendChild(tempElement);
    const num = parseFloat(getComputedStyle(tempElement).height);
    document.body.removeChild(tempElement);
    return num;
};

const headerSize = {
    element: document.querySelector('#doz_header_wrap'),
    state: {
        height: 0,
        heightProperty: '',
    },

    init() {
        this.updateState();
    },

    updateState() {
        const headerHeight = this.element ? this.element.getBoundingClientRect().height : 0;
        const headerHeightProperty = document.documentElement.style.getPropertyValue('--header-height');
        if (headerHeightProperty !== `${headerHeight}px`) {
            document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
        }
    }
};

const commonState = {
    lvh: `${getStringValueToNum('1lvh')}`,

    init() {
        this.updateState();
    },

    updateState() {
        const lvh = getStringValueToNum('1lvh');
        this.lvh = lvh;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    headerSize.init();
    commonState.init();
});

window.addEventListener('resize', () => {
    headerSize.updateState();
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
            'current 100lvh': `${commonState.lvh * 100}px`,
            'css 1lvh': `${getStringValueToPx('1lvh')}`,
            'current 1lvh': `${commonState.lvh}px`,
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