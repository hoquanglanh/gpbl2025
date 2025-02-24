// Function to update data from server
async function fetchData() {
    try {
        const response = await fetch('/api/current-data');
        const data = await response.json();

        // Update environmental metrics
        document.getElementById('temperature').textContent = data.temperature.toFixed(1) + " °C";
        document.getElementById('humidity').textContent = data.humidity.toFixed(1) + " %";
        document.getElementById('distance').textContent = data.distance.toFixed(1) + " cm";
        document.getElementById('light').textContent = data.light;

        // Update fan status
        document.getElementById('fan-state').textContent = data.fanState ? 'ON' : 'OFF';
        document.getElementById('fan-state').style.color = data.fanState ? 'green' : 'red';

        // Update light status
        document.getElementById('light-state').textContent = data.lightState ? 'ON' : 'OFF';
        document.getElementById('light-state').style.color = data.lightState ? 'green' : 'red';

        // Update fire detection status with enhanced visibility
        const fireStatus = document.getElementById('fire-status');
        
        if (data.fireDetected) {
            fireStatus.innerHTML = `<span style="color: red; font-size: 1.2rem;">🚨 FIRE DETECTED!</span>`;
            fireStatus.classList.add('fire-alert');
        } else {
            fireStatus.innerHTML = `<span style="color: green; font-size: 1.2rem;">✅ SAFE</span>`;
            fireStatus.classList.remove('fire-alert');
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Update data every 2 seconds
setInterval(fetchData, 2000);

// Initial data fetch when page loads
fetchData();