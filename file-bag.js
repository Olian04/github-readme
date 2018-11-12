window.customElements.whenDefined('file-bag')
        .then(() => console.log('Registered'))
        .then(() => console.log(window.customElements.get('file-bag')))
        .catch(console.error);
    window.customElements.define('file-bag', class extends HTMLElement {
    constructor() {
        super();
        var shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `<strong>Shadow dom super powers for the win!</strong>`;
    }
    });