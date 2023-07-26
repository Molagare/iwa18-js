import './view.js'
import './data.js'

/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 * @param {Event} event 
 */
const handleDragOver = (event) => {
    event.preventDefault();
    const path = event.path || event.composedPath()
    let column = null

    for (const element of path) {
        const { area } = element.dataset
        if (area) {
            column = area
            break;
        }
    }

    if (!column) return
    updateDragging({ over: column })
    updateDraggingHtml({ over: column })
}


const handleDragStart = (event) => {
    const orderId = event.target.dataset.id;
    event.dataTransfer.setData('text/plain', orderId);
}
const handleDragEnd = (event) => {
    updateDragging({ source: null });
    updateDraggingHtml({ over: null });
}
const handleHelpToggle = (event) => {
    const helpOverlay = html.help.overlay;
    helpOverlay.hasAttribute('open') ? helpOverlay.removeAttribute('open') : helpOverlay.setAttribute('open', '');
    if (!helpOverlay.hasAttribute('open')) {
        html.other.add.focus();
}
const handleAddToggle = (event) => {
    const addOverlay = html.add.overlay;
    if (addOverlay.hasAttribute('open')) {
        html.add.title.value = '';
        html.add.table.value = '';
    }
    addOverlay.toggleAttribute('open');
    if (!addOverlay.hasAttribute('open')) {
        html.other.add.focus();
    }
const handleAddSubmit = (event) => {
        event.preventDefault();
        const title = html.add.title.value.trim();
        const table = html.add.table.value.trim();
        if (title && table) {
            const newOrder = createOrderData({ title, table, column: 'ordered' });
            state.orders[newOrder.id] = newOrder;
            const orderHtml = createOrderHtml(newOrder);
            html.columns.ordered.appendChild(orderHtml);
            handleAddToggle();
        }
    };
    const handleEditToggle = (event) => {
        const orderId = event.target.closest('.order').dataset.id;
        const order = state.orders[orderId];
        if (order) {
            html.edit.title.value = order.title;
            html.edit.table.value = order.table;
            html.edit.id.value = orderId;
            html.edit.column.value = order.column;
            const editOverlay = html.edit.overlay;
            editOverlay.setAttribute('open', '');
            html.edit.title.focus();
        }
    };
    const handleEditSubmit = (event) => {
        event.preventDefault();
        const orderId = html.edit.id.value;
        const order = state.orders[orderId];
        if (order) {
            order.title = html.edit.title.value.trim();
            order.table = html.edit.table.value.trim();
            order.column = html.edit.column.value;
            handleEditToggle();
        }
    };
    const handleDelete = (event) => {
        const orderId = html.edit.id.value;
        const order = state.orders[orderId];
        if (order) {
            delete state.orders[orderId];
            const orderHtml = document.querySelector(`[data-id="${orderId}"]`);
            orderHtml.remove();
            handleEditToggle();
        }
    };
   
html.add.cancel.addEventListener('click', handleAddToggle)
html.other.add.addEventListener('click', handleAddToggle)
html.add.form.addEventListener('submit', handleAddSubmit)

html.other.grid.addEventListener('click', handleEditToggle)
html.edit.cancel.addEventListener('click', handleEditToggle)
html.edit.form.addEventListener('submit', handleEditSubmit)
html.edit.delete.addEventListener('click', handleDelete)

html.help.cancel.addEventListener('click', handleHelpToggle)
html.other.help.addEventListener('click', handleHelpToggle)

for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart)
    htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)
}