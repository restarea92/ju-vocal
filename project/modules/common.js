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

export default { headerSize };

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
    debugContainer.style.top = '0';
    debugContainer.style.left = '0';
    debugContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    debugContainer.style.color = '#fff';
    debugContainer.style.padding = '5px';
    debugContainer.style.zIndex = '9999';
    document.body.appendChild(debugContainer);
});