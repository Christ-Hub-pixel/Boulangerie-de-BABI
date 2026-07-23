
let lastOrderCount = 0;
let globalOrders = [];
let alarmAudio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');

// Admin Dashboard Logic

// Fetch real orders from database
async function fetchOrders() {
    try {
        const response = await fetch('/api/orders');
        const orders = await response.json();
        
        if (lastOrderCount > 0 && orders.length > lastOrderCount) {
            // New order arrived!
            alarmAudio.play().catch(e => console.log("Audio play blocked by browser."));
        }
        lastOrderCount = orders.length;
        
        globalOrders = orders;
        renderOrders(orders);
        updateStats(orders);
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
    }
}

function renderOrders(ordersData) {
    const tbody = document.getElementById('orders-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = ordersData.map(order => `
        <tr>
            <td class="fw-bold">#${order.id}</td>
            <td>
                <div class="fw-bold">${order.customer_name}</div>
                <div class="text-muted small">${order.phone}</div>
            </td>
            <td>
                <div>${order.address}</div>
            </td>
            <td>
                <small>${order.items}</small>
            </td>
            <td class="fw-bold text-primary">${order.total_price.toLocaleString()} FCFA</td>
            <td>${order.payment_method}</td>
            <td>
                <span class="badge ${getStatusBadgeClass(order.status)}">${order.status}</span>
            </td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                        <li><a class="dropdown-item" href="#" onclick="updateOrderStatus(${order.id}, 'nouveau')">Marquer 'Nouveau'</a></li>
                        <li><a class="dropdown-item" href="#" onclick="updateOrderStatus(${order.id}, 'en preparation')">Marquer 'En préparation'</a></li>
                        <li><a class="dropdown-item" href="#" onclick="updateOrderStatus(${order.id}, 'en livraison')">Marquer 'En livraison' (Active GPS)</a></li>
                        <li><a class="dropdown-item" href="#" onclick="updateOrderStatus(${order.id}, 'livre')">Marquer 'Livré'</a></li>
                        <li><hr class="dropdown-divider"></li><li><a class="dropdown-item text-primary" href="#" onclick="printReceipt(${order.id})"><i class="fa-solid fa-print"></i> Imprimer Reçu</a></li>
                        <li><a class="dropdown-item text-danger" href="#">Annuler la commande</a></li>
                    </ul>
                </div>
            </td>
        </tr>
    `).join('');
}

function getStatusBadgeClass(status) {
    if(!status) return 'bg-secondary';
    const s = status.toLowerCase();
    if(s.includes('nouveau')) return 'bg-danger';
    if(s.includes('livre') || s.includes('livré')) return 'bg-success';
    if(s.includes('preparation') || s.includes('préparation')) return 'bg-warning text-dark';
    if(s.includes('en livraison') || s.includes('livraison')) return 'bg-info text-white';
    return 'bg-secondary';
}

function updateStats(ordersData) {
    // Total revenues
    const total = ordersData.reduce((sum, o) => sum + o.total_price, 0);
    const revEl = document.getElementById('total-revenues');
    if(revEl) revEl.innerText = total.toLocaleString() + ' FCFA';
    
    // New orders count
    const newCount = ordersData.filter(o => o.status && o.status.toLowerCase().includes('nouveau')).length;
    const badgeEl = document.getElementById('new-orders-badge');
    const valEl = document.getElementById('new-orders-val');
    
    if(badgeEl) badgeEl.innerText = newCount;
    if(valEl) valEl.innerText = newCount;
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        const data = await response.json();
        if(data.success) {
            fetchOrders(); // Refresh table
        }
    } catch (error) {
        console.error("Erreur de mise à jour du statut:", error);
    }
}

// Auto-refresh every 10 seconds
setInterval(fetchOrders, 10000);

document.addEventListener('DOMContentLoaded', () => {
    fetchOrders();
});


function printReceipt(orderId) {
    const order = globalOrders.find(o => o.id === orderId);
    if(!order) return;
    
    const printWindow = window.open('', '_blank', 'width=300,height=500');
    printWindow.document.write(`
        <html>
        <head>
            <title>Reçu #${order.id}</title>
            <style>
                body { font-family: monospace; padding: 10px; width: 250px; margin: 0 auto; color: #000; }
                .text-center { text-align: center; }
                .bold { font-weight: bold; }
                hr { border-top: 1px dashed #000; }
            </style>
        </head>
        <body>
            <h2 class="text-center mb-0">BOULANGERIE<br>DE BABI</h2>
            <p class="text-center">Cocody Angré, Abidjan<br>Tel: +225 01 02 03 04 05</p>
            <hr>
            <p><strong>Commande:</strong> #${order.id}<br>
            <strong>Date:</strong> ${new Date(order.created_at || Date.now()).toLocaleString()}<br>
            <strong>Client:</strong> ${order.customer_name}<br>
            <strong>Tel:</strong> ${order.phone}</p>
            <hr>
            <p>${order.items.split(', ').join('<br>')}</p>
            <hr>
            <h3 class="text-center">TOTAL: ${order.total_price.toLocaleString()} FCFA</h3>
            <p class="text-center bold">${order.payment_method}</p>
            <hr>
            <p class="text-center">Merci de votre visite !</p>
            <script>
                window.onload = function() { window.print(); window.close(); }
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
}


// Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('babi_dark_mode', isDark);
    document.getElementById('darkModeBtn').innerHTML = isDark ? '<i class="fa-solid fa-sun text-warning"></i>' : '<i class="fa-solid fa-moon"></i>';
}

// Check saved dark mode on load
document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('babi_dark_mode') === 'true') {
        toggleDarkMode();
    }
    checkStockAlerts();
});

// CSV Export
function exportCSV() {
    if(!globalOrders || globalOrders.length === 0) return alert('Aucune commande à exporter.');
    
    let csvContent = "data:text/csv;charset=utf-8,ID,Client,Telephone,Prix_Total,Methode_Paiement,Statut,Date\n";
    globalOrders.forEach(row => {
        csvContent += `${row.id},${row.customer_name},${row.phone},${row.total_price},${row.payment_method},${row.status},${row.created_at}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "babi_ventes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Low Stock Alert
async function checkStockAlerts() {
    try {
        const res = await fetch('/api/products');
        const prods = await res.json();
        const lowStocks = prods.filter(p => p.stock !== undefined && p.stock <= 5);
        
        const container = document.getElementById('stockAlertContainer');
        if(container && lowStocks.length > 0) {
            let html = '<div class="alert alert-danger shadow-sm border-0"><h5 class="fw-bold"><i class="fa-solid fa-triangle-exclamation"></i> Alerte Stock Critique</h5><ul class="mb-0">';
            lowStocks.forEach(p => {
                html += `<li>${p.nom} : Plus que <strong>${p.stock}</strong> en stock !</li>`;
            });
            html += '</ul></div>';
            container.innerHTML = html;
        } else if(container) {
            container.innerHTML = '';
        }
    } catch(e) {}
}

// Hook checkStockAlerts into the fetchOrders interval so it auto refreshes
const originalFetchOrders = fetchOrders;
fetchOrders = async function() {
    await originalFetchOrders();
    checkStockAlerts();
}


// --- AI Logs Fetcher ---
async function fetchAILogs() {
    try {
        const res = await fetch('/api/ai_logs');
        const logs = await res.json();
        const container = document.getElementById('aiLogsList');
        if(container && logs.length > 0) {
            let html = '';
            logs.forEach(log => {
                const date = new Date(log.created_at).toLocaleTimeString();
                html += `<li class="mb-1">[${date}] ${log.message}</li>`;
            });
            container.innerHTML = html;
        }
    } catch(e) {}
}

setInterval(fetchAILogs, 5000); // Check for AI updates every 5s
fetchAILogs();
