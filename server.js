const express = require('express');
const app = express();
const port = 3000;

let currentData = { temperature: 0, humidity: 0, distance: 0, light: 0 };
let fanState = false;
let lightState = false;
let fireDetected = false; // Thêm biến lưu trạng thái phát hiện lửa

app.use(express.json());
app.use(express.static('public'));

app.post('/api/temperature', (req, res) => {
    const { temperature, humidity, distance, light, fireDetected: newFireState } = req.body;

    if (temperature !== undefined && humidity !== undefined) {
        currentData = { temperature, humidity, distance, light };
        fanState = temperature > 30 && distance < 50;
        lightState = light < 500;
        fireDetected = newFireState; // Cập nhật trạng thái phát hiện lửa

        console.log(`🔥 Nhiệt độ: ${temperature}°C, Độ ẩm: ${humidity}%, Khoảng cách: ${distance}cm, Ánh sáng: ${light}`);
        console.log(`Quạt: ${fanState ? 'BẬT' : 'TẮT'}, Đèn: ${lightState ? 'BẬT' : 'TẮT'}, Lửa: ${fireDetected ? 'PHÁT HIỆN' : 'KHÔNG'}`);

        res.json({ message: 'Dữ liệu nhận thành công!', fanState, lightState, fireDetected });
    } else {
        res.status(400).json({ message: 'Dữ liệu không hợp lệ!' });
    }
});

// API lấy dữ liệu hiện tại
app.get('/api/current-data', (req, res) => {
    res.json({ 
        ...currentData, 
        fanState, 
        lightState,
        fireDetected 
    });
});

// API điều khiển đèn
app.post('/api/control-light', (req, res) => {
    const { state } = req.body;
    lightState = state;
    res.json({ state: lightState });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🔥 Server đang chạy trên cổng ${port}`);
});

// API điều khiển quạt
app.post('/api/control-fan', (req, res) => {
    const { state } = req.body;
    fanState = state; // Cập nhật trạng thái quạt
    res.json({ state: fanState });
});
