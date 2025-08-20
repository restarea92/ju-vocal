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

document.addEventListener('DOMContentLoaded', () => {
    headerSize.init();
});

document.addEventListener('resize', () => {
    headerSize.updateState();
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
        <span style="font-size:1.5rem; font-weight:700">Debug & Status Info</span>
        <div style="display:grid; grid-template-columns: max-content 1fr; gap:0 1rem;">

        </div>
    `;
    document.body.appendChild(debugContainer);


    const updateDebugInfo = (obj) => {
        Object.keys(obj).forEach(key => {
            const createLabelSpan = document.createElement('span');
            createLabelSpan.style.fontWeight = '600';
            createLabelSpan.textContent = key + ':';
            debugContainer.querySelector('div').appendChild(createLabelSpan);

            const createValueSpan = document.createElement('span');
            createValueSpan.style.fontWeight = '400';
            createValueSpan.textContent = obj[key];
            debugContainer.querySelector('div').appendChild(createValueSpan);
        });
    };

    const debugInfo = {
        'Viewport Size': `${window.innerWidth} x ${window.innerHeight}`,
        'Header Height': `${headerSize.state.height}px`,
        'Header Height Property': headerSize.state.heightProperty,
    };

    updateDebugInfo(debugInfo);
});