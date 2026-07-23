
let map;
let bakeryMarker;
let deliveryMarker;
let customerMarker;
let isAnimating = false;
let currentInterval;
let currentPhone = null;
let currentStatus = null;

// Abidjan coordinates
const bakeryCoords = [5.3364, -4.0267]; // Plateau
const customerCoords = [5.3773, -3.9273]; // Riviera 2

function initMap() {
    map = L.map('map').setView([5.3564, -3.9767], 12);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(map);

    // Bakery Icon
    const bakeryIcon = L.divIcon({
        html: '<div style="background:#e11d48; color:white; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 5px rgba(0,0,0,0.3); border:2px solid white;"><i class="fa-solid fa-store"></i></div>',
        className: '', iconSize: [30, 30], iconAnchor: [15, 15]
    });
    bakeryMarker = L.marker(bakeryCoords, {icon: bakeryIcon}).addTo(map).bindPopup("<b>Boulangerie de BABI</b>");

    // Customer Icon
    const customerIcon = L.divIcon({
        html: '<div style="background:#3b82f6; color:white; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 5px rgba(0,0,0,0.3); border:2px solid white;"><i class="fa-solid fa-house"></i></div>',
        className: '', iconSize: [30, 30], iconAnchor: [15, 15]
    });
    customerMarker = L.marker(customerCoords, {icon: customerIcon}).addTo(map).bindPopup("<b>Votre Adresse</b>");

    // Delivery Bike Icon
    const bikeIcon = L.divIcon({
        html: '<div class="pulse-marker" style="display:flex; align-items:center; justify-content:center; color:white; font-size:10px;"><i class="fa-solid fa-motorcycle"></i></div>',
        className: '', iconSize: [20, 20], iconAnchor: [10, 10]
    });
    deliveryMarker = L.marker(bakeryCoords, {icon: bikeIcon}); // Not added to map yet
}

function updateTimeline(status) {
    const s = status.toLowerCase();
    document.querySelectorAll('.timeline-step').forEach(el => {
        el.classList.remove('active', 'done');
    });

    const stepN = document.getElementById('step-nouveau');
    const stepP = document.getElementById('step-preparation');
    const stepL = document.getElementById('step-livraison');
    const stepF = document.getElementById('step-livre');

    if(s.includes('nouveau')) {
        stepN.classList.add('active');
    } 
    else if(s.includes('preparation') || s.includes('préparation')) {
        stepN.classList.add('done');
        stepP.classList.add('active');
    }
    else if(s.includes('en livraison') || s.includes('livraison')) {
        stepN.classList.add('done');
        stepP.classList.add('done');
        stepL.classList.add('active');
        startDeliveryAnimation();
    }
    else if(s.includes('livre') || s.includes('livré')) {
        stepN.classList.add('done');
        stepP.classList.add('done');
        stepL.classList.add('done');
        stepF.classList.add('active');
        stopDeliveryAnimation(true);
    }
    
    // Update Badge
    const badge = document.getElementById('order-badge');
    badge.innerText = status;
    badge.className = 'badge rounded-pill px-3 py-2 fs-6 ';
    if(s.includes('nouveau')) badge.classList.add('bg-danger');
    else if(s.includes('preparation')) badge.classList.add('bg-warning', 'text-dark');
    else if(s.includes('livraison')) badge.classList.add('bg-info', 'text-white');
    else if(s.includes('livre')) badge.classList.add('bg-success');
    else badge.classList.add('bg-secondary');
}

function startDeliveryAnimation() {
    if(isAnimating) return;
    isAnimating = true;
    
    document.getElementById('driver-alert').style.setProperty('display', 'flex', 'important');
    deliveryMarker.addTo(map);
    
    // Simple straight line animation for demonstration
    let startLat = bakeryCoords[0];
    let startLng = bakeryCoords[1];
    let endLat = customerCoords[0];
    let endLng = customerCoords[1];
    
    let progress = 0;
    
    window.animationInterval = setInterval(() => {
        progress += 0.005; // speed
        if(progress >= 1) {
            progress = 1;
            // Loop it back to 0.2 to make it seem like he's still moving around the area if not delivered yet
            if(currentStatus && !currentStatus.toLowerCase().includes('livre')) {
                progress = 0.5; // Jumps back a bit
            }
        }
        
        let curLat = startLat + (endLat - startLat) * progress;
        let curLng = startLng + (endLng - startLng) * progress;
        
        deliveryMarker.setLatLng([curLat, curLng]);
        
        // Slightly pan map to follow
        if(progress > 0.1 && progress < 0.9) {
            map.panTo([curLat, curLng], {animate: true, duration: 1});
        }
    }, 1000);
}

function stopDeliveryAnimation(delivered) {
    if(window.animationInterval) clearInterval(window.animationInterval);
    isAnimating = false;
    document.getElementById('driver-alert').style.setProperty('display', 'none', 'important');
    
    if(delivered) {
        deliveryMarker.setLatLng(customerCoords); // Arrived!
        map.setView(customerCoords, 15);
    } else {
        if(map.hasLayer(deliveryMarker)) map.removeLayer(deliveryMarker);
    }
}

async function fetchOrderStatus() {
    if(!currentPhone) return;
    try {
        const res = await fetch('/api/orders/track/' + currentPhone);
        const data = await res.json();
        
        if(data.success) {
            const order = data.order;
            document.getElementById('search-section').style.display = 'none';
            document.getElementById('tracking-section').style.display = 'block';
            
            document.getElementById('order-id-display').innerText = '#' + order.id;
            document.getElementById('order-total').innerText = order.total_price.toLocaleString() + ' FCFA';
            document.getElementById('order-payment').innerText = order.payment_method;
            document.getElementById('order-items').innerText = order.items;
            if(order.confirmation_code) {
                document.getElementById('confirmation-code-box').style.display = 'block';
                document.getElementById('order-conf-code').innerText = order.confirmation_code;
            }
            
            if(currentStatus !== order.status) {
                currentStatus = order.status;
                updateTimeline(order.status);
            }
            
            if(!map) initMap();
            setTimeout(() => { if(map) map.invalidateSize(); }, 500);
            
        } else {
            alert("Aucune commande en cours pour ce numéro.");
            if(currentInterval) clearInterval(currentInterval);
        }
    } catch(e) {
        console.error(e);
    }
}

window.trackOrder = function() {
    const phone = document.getElementById('phone-input').value;
    if(!phone) return;
    currentPhone = phone;
    fetchOrderStatus();
    
    // Poll every 5 seconds
    if(currentInterval) clearInterval(currentInterval);
    currentInterval = setInterval(fetchOrderStatus, 5000);
}

// Auto track if phone is in URL parameters
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const phone = urlParams.get('phone');
    if(phone) {
        document.getElementById('phone-input').value = phone;
        trackOrder();
    }
});
