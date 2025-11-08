// crea una tabla dinamica
export function createTable(data = [], options = {}) {
  // saca columnas y callbacks del options
  const {
    columns,
    actions = true,
    onEdit = null,
    onDelete = null
  } = options;

  // si no pasan columnas, las infiere
  let cols = columns;
  if (!cols) {
    const allKeys = data.reduce((acc, row) => {
      Object.keys(row).forEach((k) => { if (!acc.includes(k)) acc.push(k); });
      return acc;
    }, []);
    cols = allKeys.map(key => ({ key, label: key.charAt(0).toUpperCase() + key.slice(1) }));
  }

  // crea la tabla
  const table = document.createElement("table");
  table.className = "abc-table";

  // crea thead
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  for (const col of cols) {
    const th = document.createElement("th");
    th.textContent = col.label || col.key;
    tr.appendChild(th);
  }

  // agrega columna acciones si hace falta
  if (actions && (onEdit || onDelete)) {
    const th = document.createElement("th");
    th.textContent = "Acciones";
    tr.appendChild(th);
  }
  thead.appendChild(tr);
  table.appendChild(thead);

  // crea tbody
  const tbody = document.createElement("tbody");
  data.forEach((row) => {
    const tr = document.createElement("tr");
    for (const col of cols) {
      const td = document.createElement("td");
      let value = row[col.key];
      // si es null muestra vacio
      td.textContent = value == null ? '' : value;
      tr.appendChild(td);
    }
    // botones de acciones
    if (actions && (onEdit || onDelete)) {
      const td = document.createElement("td");
      td.style.whiteSpace = "nowrap";
      // boton editar
      if (onEdit) {
        const btnEdit = document.createElement("button");
        btnEdit.type = "button";
        btnEdit.className = "abc-table-edit-btn";
        btnEdit.title = "Editar";
        btnEdit.textContent = "✎";
        btnEdit.addEventListener("click", (e) => {
          e.stopPropagation();
          onEdit(row);
        });
        td.appendChild(btnEdit);
      }
      // boton eliminar
      if (onDelete) {
        const btnDel = document.createElement("button");
        btnDel.type = "button";
        btnDel.className = "abc-table-delete-btn";
        btnDel.title = "Eliminar";
        btnDel.textContent = "🗑️";
        btnDel.addEventListener("click", (e) => {
          e.stopPropagation();
          onDelete(row);
        });
        td.appendChild(btnDel);
      }
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  // devuelve la tabla
  return table;
}
