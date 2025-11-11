class DashboardView extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.render();
    }
    render() {
        this.innerHTML = `
        <div class="dashboard-view">
            <h1>Dashboard View</h1>
            <p>Panel de control</p>
        </div>
        `;
    }
}

customElements.define('dashboard-view', DashboardView);
export default DashboardView;

