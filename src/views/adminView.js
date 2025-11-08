class AdminView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const HTML = ``;
    this.shadowRoot.innerHTML = HTML;
  }
}

customElements.define('admin-view', AdminView);