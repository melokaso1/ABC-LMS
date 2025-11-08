// Modal simple usando shadow DOM
export function showModal(contentHTML, options = {}) {
  const { title = "", closable = true } = options;

  // Host del modal
  const modalHost = document.createElement("div");
  modalHost.className = "abc-modal-host";
  const shadow = modalHost.attachShadow({ mode: "open" });

  // Estilos
  const style = document.createElement("style");
  style.textContent = `
    .abc-modal-overlay {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000;
    }
    .abc-modal {
      background: #fff;
      border-radius: 8px;
      max-width: 90vw;
      min-width: 320px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.2);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .abc-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem 0.5rem;
    }
    .abc-modal-header h3 {
      margin: 0;
      font-size: 1.2rem;
    }
    .abc-modal-header button {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      padding: 0 0.5rem;
      line-height: 1;
    }
    .abc-modal-content {
      padding: 1rem 1.5rem;
    }
  `;

  // Overlay
  const overlay = document.createElement("div");
  overlay.className = "abc-modal-overlay";

  // Caja modal
  const modal = document.createElement("div");
  modal.className = "abc-modal";

  // Header con titulo y/o cerrar
  if (title || closable) {
    const header = document.createElement("div");
    header.className = "abc-modal-header";

    if (title) {
      const h3 = document.createElement("h3");
      h3.textContent = title;
      header.appendChild(h3);
    } else {
      header.appendChild(document.createElement("div"));
    }

    if (closable) {
      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.innerHTML = "&times;";
      closeBtn.setAttribute("aria-label", "Cerrar modal");
      closeBtn.addEventListener("click", removeModal);
      header.appendChild(closeBtn);
    }
    modal.appendChild(header);
  }

  // Contenido
  const contentDiv = document.createElement("div");
  contentDiv.className = "abc-modal-content";
  contentDiv.innerHTML = contentHTML;
  modal.appendChild(contentDiv);

  // Ensamblar
  overlay.appendChild(modal);
  shadow.appendChild(style);
  shadow.appendChild(overlay);

  // Poner en body
  document.body.appendChild(modalHost);

  // Cerrar con click fuera o Escape si es cerrable
  if (closable) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) removeModal();
    });

    setTimeout(() => {
      document.addEventListener("keydown", escListener);
    }, 0);
  }

  // Eliminar modal
  function removeModal() {
    if (modalHost.parentNode) {
      modalHost.parentNode.removeChild(modalHost);
      if (closable) {
        document.removeEventListener("keydown", escListener);
      }
    }
  }

  // Cerrar con Escape
  function escListener(e) {
    if (e.key === "Escape") {
      removeModal();
    }
  }

  // Devolver función para cerrar
  return removeModal;
}
