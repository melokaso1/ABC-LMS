class AdminView extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.render();
    }
    render() {
        this.innerHTML = `
        <div class="admin-view">
            <h1>Admin View</h1>
            <p>Panel de administración</p>
        </div>
        `;
    }
}

customElements.define('admin-view', AdminView);
export default AdminView;

