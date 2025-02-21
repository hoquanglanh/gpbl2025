// Hàm cập nhật dữ liệu từ server
async function fetchData() {
    try {
        const response = await fetch('/api/current-data');
        const data = await response.json();

        document.getElementById('temperature').textContent = data.temperature.toFixed(1) + " °C";
        document.getElementById('humidity').textContent = data.humidity.toFixed(1) + " %";
        document.getElementById('distance').textContent = data.distance.toFixed(1) + " cm";
        document.getElementById('light').textContent = data.light;

        // ✅ Hiển thị trạng thái quạt và đèn
        document.getElementById('fan-state').textContent = data.fanState ? 'BẬT' : 'TẮT';
        document.getElementById('fan-state').style.color = data.fanState ? 'green' : 'red';

        document.getElementById('light-state').textContent = data.lightState ? 'BẬT' : 'TẮT';
        document.getElementById('light-state').style.color = data.lightState ? 'green' : 'red';

        // Cập nhật trạng thái phát hiện lửa
        // const fireStatus = document.getElementById('fire-status');
        // fireStatus.textContent = data.fireDetected ? '🔥 PHÁT HIỆN LỬA!' : '✅ AN TOÀN';
        // fireStatus.style.color = data.fireDetected ? 'red' : 'green';

        // if (data.fireDetected) {
        //     alert('🔥 CẢNH BÁO: Phát hiện lửa! Kiểm tra ngay.');
        // }

    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
    }
}

// ✅ Hàm điều khiển quạt
// async function controlFan(state) {
//     try {
//         const response = await fetch('/api/control-fan', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ state: state === 'on' }) // true nếu "on", false nếu "off"
//         });
//         const data = await response.json();
        
//         document.getElementById('fan-state').textContent = data.state ? 'BẬT' : 'TẮT';
//         document.getElementById('fan-state').style.color = data.state ? 'green' : 'red';
//     } catch (error) {
//         console.error('Lỗi khi điều khiển quạt:', error);
//     }
// }

// Thêm hàm này vào script
// async function controlLight(state) {
//     try {
//         const response = await fetch('/api/control-light', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ state: state === 'on' })
//         });
//         const data = await response.json();
        
//         document.getElementById('light-state').textContent = data.state ? 'BẬT' : 'TẮT';
//         document.getElementById('light-state').style.color = data.state ? 'green' : 'red';
//     } catch (error) {
//         console.error('Lỗi khi điều khiển đèn:', error);
//     }
// }

// Thêm event listeners cho nút điều khiển đèn
// document.getElementById('light-on-btn').addEventListener('click', () => controlLight('on'));
// document.getElementById('light-off-btn').addEventListener('click', () => controlLight('off'));

// Gán sự kiện cho nút điều khiển
// document.getElementById('fan-on-btn').addEventListener('click', () => controlFan('on'));
// document.getElementById('fan-off-btn').addEventListener('click', () => controlFan('off'));

// ✅ Cập nhật dữ liệu mỗi 2 giây
setInterval(fetchData, 2000);

// ✅ Chạy lần đầu khi tải trang
fetchData();
