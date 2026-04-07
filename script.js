document.getElementById('findLocation').addEventListener('click', function() {
    const btn = this;
    const status = document.getElementById('status');
    const results = document.getElementById('results');
    const addressDiv = document.getElementById('address');

    // Show loading state
    btn.style.display = 'none';
    status.style.display = 'block';

    if (!navigator.geolocation) {
        status.textContent = "Geolocation is not supported by your browser";
        return;
    }

    const options = {
        enableHighAccuracy: true, // Uses GPS if available
        timeout: 5000,            // Wait max 5 seconds
        maximumAge: 0             // Do not use a cached location
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

    function success(position) {
        const { latitude, longitude } = position.coords;
        
        // Hide loader, show map container
        status.style.display = 'none';
        results.style.display = 'block';

        // Initialize Map
        const map = L.map('map').setView([latitude, longitude], 15);

        // Fast-loading Tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Add Marker
        L.marker([latitude, longitude]).addTo(map)
            .bindPopup('You are here!')
            .openPopup();

        // Reverse Geocoding (Optional: fetches address name)
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
                addressDiv.innerHTML = `<strong>Address:</strong> ${data.display_name}`;
            })
            .catch(() => {
                addressDiv.innerHTML = `<strong>Coordinates:</strong> ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            });
    }

    function error(err) {
        status.textContent = `Unable to retrieve location: ${err.message}`;
        btn.style.display = 'inline-block';
    }
});
