const express = require('express');
const app = express();
const port = 3000;

let currentData = { temperature: 0, humidity: 0, distance: 0, light: 0 };
let fanState = false;
let lightState = false;
let manualLightControl = false; // Thêm biến cho chế độ điều khiển đèn
// let fireDetected = false;

app.use(express.json());
app.use(express.static('public'));

app.post('/api/temperature', (req, res) => {
    // const { temperature, humidity, distance, light, fireDetected: newFireState } = req.body;
    const { temperature, humidity, distance, light} = req.body;

    if (temperature !== undefined && humidity !== undefined) {
        currentData = { temperature, humidity, distance, light };
        fanState = temperature > 30 && distance < 50;
        
        // Chỉ tự động điều khiển đèn nếu không ở chế độ manual
        if (!manualLightControl) {
            lightState = light < 500;
        }
        
        // fireDetected = newFireState;

        console.log(`🔥 Nhiệt độ: ${temperature}°C, Độ ẩm: ${humidity}%, Khoảng cách: ${distance}cm, Ánh sáng: ${light}`);
        // console.log(`Quạt: ${fanState ? 'BẬT' : 'TẮT'}, Đèn: ${lightState ? 'BẬT' : 'TẮT'}, Chế độ đèn: ${manualLightControl ? 'THỦ CÔNG' : 'TỰ ĐỘNG'}, Lửa: ${fireDetected ? 'PHÁT HIỆN' : 'KHÔNG'}`);
        console.log(`Quạt: ${fanState ? 'BẬT' : 'TẮT'}, Đèn: ${lightState ? 'BẬT' : 'TẮT'}, Chế độ đèn: ${manualLightControl ? 'THỦ CÔNG' : 'TỰ ĐỘNG'}}`);
        res.json({ 
            message: 'Dữ liệu nhận thành công!', 
            fanState, 
            lightState, 
            manualLightControl,
            // fireDetected 
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
        // fireDetected 
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
    
    // Cập nhật chế độ điều khiển nếu được chỉ định
    if (manual !== undefined) {
        manualLightControl = manual;
    }
    
    // Cập nhật trạng thái đèn
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
    
    // Nếu chuyển sang chế độ tự động, cập nhật trạng thái dựa trên ánh sáng
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

// API báo cháy
// app.post('/api/fireAlert', (req, res) => {
//     const { fireDetected: newFireState } = req.body;
//     fireDetected = newFireState;
//     console.log(`🔥 Fire Alert: ${fireDetected ? 'DETECTED' : 'CLEAR'}`);
//     res.json({ status: 'received', fireDetected });
// });

app.listen(port, '0.0.0.0', () => {
    console.log(`🔥 Server đang chạy trên cổng ${port}`);
});