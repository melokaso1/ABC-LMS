class PublicView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const HTML = `
<section class="Public-container">
    <header>
        <a href="#/login">Iniciar Sesión</a>
    </header>
</section>
    `;
    this.shadowRoot.innerHTML = HTML;
  }
}

customElements.define("public-view", PublicView);
