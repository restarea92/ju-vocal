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

    const getVhToPx = (value) => {
        const tempElement = document.createElement('div');
        tempElement.style.height = value;
        document.body.appendChild(tempElement);
        const vhValue = getComputedStyle(tempElement).height;
        document.body.removeChild(tempElement);
        return vhValue;
    };

    const debugInfo = {
        // 브라우저 창 내부 높이 (스크롤바 제외)
        'w.innerHeight': `${window.innerHeight}px`,

        // 브라우저 창 전체 높이 (툴바 포함)
        'w.outerHeight': `${window.outerHeight}px`,

        // 뷰포트 단위 계산용 변수
        '--vh (1% of viewport height)': `${window.innerHeight * 0.01}px`,

        // 화면 전체 높이 (모바일/데스크탑)
        's.height': `${window.screen.height}px`,
        's.availHeight': `${window.screen.availHeight}px`, // OS UI 제외

        // 문서의 실제 높이
        'clientHeight': `${document.documentElement.clientHeight}px`,

        //100vh
        //100svh
        //100lvh의 높이
        '100vh': `${getVhToPx('100vh')}`,
        '100lvh': `${getVhToPx('100lvh')}`,
        '100svh': `${getVhToPx('100svh')}`
    };


    updateDebugInfo(debugInfo);

    window.addEventListener('resize', () => {
        updateDebugInfo(debugInfo);
    });
});