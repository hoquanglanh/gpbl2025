const express = require('express');
const app = express();
const port = 3000;

let currentData = { temperature: 0, humidity: 0, distance: 0, light: 0 };
let fanState = false;
let lightState = false;
let manualLightControl = false;
let fireDetected = false;
let shockDetectedGlobal = false; // Biến toàn cục để lưu trạng thái va chạm

app.use(express.json());
app.use(express.static('public'));

app.post('/api/temperature', (req, res) => {
    const { temperature, humidity, distance, light, flameDetected, shockDetected } = req.body;

    if (temperature !== undefined && humidity !== undefined) {
        currentData = { temperature, humidity, distance, light };
        fanState = temperature > 30 && distance < 50;
        
        if (!manualLightControl) {
            lightState = light < 500;
        }
        
        fireDetected = flameDetected;
        shockDetectedGlobal = shockDetected; // Cập nhật biến toàn cục

        console.log(`🔥 Nhiệt độ: ${temperature}°C, Độ ẩm: ${humidity}%, Khoảng cách: ${distance}cm, Ánh sáng: ${light}`);
        console.log(`Quạt: ${fanState ? 'BẬT' : 'TẮT'}, Đèn: ${lightState ? 'BẬT' : 'TẮT'}, Chế độ đèn: ${manualLightControl ? 'THỦ CÔNG' : 'TỰ ĐỘNG'}, Lửa: ${fireDetected ? 'PHÁT HIỆN' : 'KHÔNG'}, Va chạm: ${shockDetected ? 'PHÁT HIỆN' : 'KHÔNG'}`);
        
        res.json({ 
            message: 'Dữ liệu nhận thành công!', 
            fanState, 
            lightState, 
            fireDetected,
            shockDetected
        });
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
        manualLightControl,
        fireDetected,
        shockDetected: shockDetectedGlobal // Sửa thành shockDetectedGlobal
    });
});

// Endpoint for Arduino to check device states
app.get('/api/device-states', (req, res) => {
    res.json({
        fanState,
        lightState,
        manualLightControl
    });
});

// API điều khiển đèn
app.post('/api/control-light', (req, res) => {
    const { state, manual } = req.body;
    
    if (manual !== undefined) {
        manualLightControl = manual;
    }
    
    if (state !== undefined) {
        lightState = state;
    }
    
    res.json({ 
        state: lightState,
        manualControl: manualLightControl 
    });
});

// API chuyển đổi chế độ điều khiển đèn
app.post('/api/light-control-mode', (req, res) => {
    const { manual } = req.body;
    manualLightControl = manual;
    
    if (!manual) {
        lightState = currentData.light < 500;
    }
    
    res.json({ 
        manualControl: manualLightControl,
        state: lightState 
    });
});

// API điều khiển quạt
app.post('/api/control-fan', (req, res) => {
    const { state } = req.body;
    fanState = state;
    res.json({ state: fanState });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🔥 Server đang chạy trên cổng ${port}`);
});