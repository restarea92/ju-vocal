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
