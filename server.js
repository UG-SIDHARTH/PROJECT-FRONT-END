const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());

let latestData = {
    deviceCount: 0,
    devices: []
};

/* Receive ESP32 Data */
app.post('/api/devices', (req, res) => {
    latestData = req.body;
    console.log("📡 Data received:", latestData);
    res.json({ message: "OK" });
});

/* Send Data to Dashboard */
app.get('/api/devices', (req, res) => {
    res.json(latestData);
});

/* Serve Frontend */
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* IMPORTANT PORT FIX */
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
