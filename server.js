<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Crowd Monitoring Dashboard - Sound Alerts</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #0f172a;
            color: white;
            padding: 20px;
            transition: background-color 0.3s ease, color 0.3s ease;
        }

        body.light-theme {
            background-color: #f1f5f9;
            color: #1e293b;
        }

        h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        h2 {
            text-align: center;
            margin: 30px 0 20px 0;
            font-size: 1.5em;
        }

        .controls {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }

        .btn-warning {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .light-theme .btn:hover {
            box-shadow: 0 5px 15px rgba(0,0,0,0.15);
        }

        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
        }

        .card {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
            transition: transform 0.3s, background 0.3s;
        }

        .light-theme .card {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
            border: 1px solid #e2e8f0;
        }

        .card:hover {
            transform: translateY(-5px);
        }

        h3 {
            margin: 0 0 15px 0;
            font-size: 18px;
            opacity: 0.8;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .card p {
            font-size: 36px;
            margin: 0;
            font-weight: bold;
        }

        .card .subtext {
            font-size: 14px;
            opacity: 0.7;
            margin-top: 10px;
        }

        .status {
            color: #10b981;
        }

        .status.warning {
            color: #f59e0b;
        }

        .status.danger {
            color: #ef4444;
        }

        canvas {
            background-color: #1e293b;
            border-radius: 15px;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
            display: block;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
            transition: background-color 0.3s;
        }

        .light-theme canvas {
            background-color: #ffffff;
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
            border: 1px solid #e2e8f0;
        }

        table {
            width: 100%;
            max-width: 1200px;
            margin: 20px auto;
            border-collapse: collapse;
            background-color: #1e293b;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
            transition: background-color 0.3s;
        }

        .light-theme table {
            background-color: #ffffff;
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
            border: 1px solid #e2e8f0;
        }

        th, td {
            padding: 15px;
            text-align: left;
        }

        th {
            background-color: #334155;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 14px;
            letter-spacing: 1px;
            transition: background-color 0.3s;
        }

        .light-theme th {
            background-color: #e2e8f0;
            color: #1e293b;
        }

        tr:nth-child(even) {
            background-color: #2d3748;
            transition: background-color 0.3s;
        }

        .light-theme tr:nth-child(even) {
            background-color: #f8fafc;
        }

        tr:hover {
            background-color: #3f4f66;
        }

        .light-theme tr:hover {
            background-color: #e2e8f0;
        }

        .alert {
            max-width: 1200px;
            margin: 20px auto;
            padding: 15px 20px;
            border-radius: 10px;
            display: none;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from {
                transform: translateY(-20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .alert.show {
            display: flex;
        }

        .alert-warning {
            background-color: #f59e0b;
            color: #1e293b;
        }

        .alert-danger {
            background-color: #ef4444;
            color: white;
        }

        .alert-success {
            background-color: #10b981;
            color: white;
        }

        .alert-info {
            background-color: #3b82f6;
            color: white;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            max-width: 1200px;
            margin: 20px auto;
        }

        .stat-card {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: background 0.3s;
        }

        .light-theme .stat-card {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            border: 1px solid #e2e8f0;
        }

        .stat-card .label {
            font-size: 12px;
            opacity: 0.7;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 8px;
        }

        .stat-card .value {
            font-size: 28px;
            font-weight: bold;
        }

        .peak-time-card {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: 2px solid #10b981;
            color: white;
        }

        .least-time-card {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border: 2px solid #3b82f6;
            color: white;
        }

        .peak-time-card h3,
        .least-time-card h3,
        .peak-time-card .subtext,
        .least-time-card .subtext {
            color: white;
            opacity: 0.9;
        }

        .insights-section {
            max-width: 1200px;
            margin: 30px auto;
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
            transition: background 0.3s;
        }

        .light-theme .insights-section {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
            border: 1px solid #e2e8f0;
        }

        .insights-section h3 {
            margin-bottom: 20px;
            font-size: 22px;
        }

        .insight-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background-color: #0f172a;
            border-radius: 10px;
            margin-bottom: 15px;
            transition: background-color 0.3s;
        }

        .light-theme .insight-item {
            background-color: #f1f5f9;
            border: 1px solid #e2e8f0;
        }

        .insight-icon {
            font-size: 32px;
        }

        .insight-content {
            flex: 1;
        }

        .insight-title {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 5px;
        }

        .insight-description {
            opacity: 0.8;
            font-size: 14px;
        }

        .hourly-breakdown {
            max-width: 1200px;
            margin: 30px auto;
        }

        /* Theme Toggle Switch */
        .theme-toggle-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }

        .theme-switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }

        .theme-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            transition: .4s;
            border-radius: 34px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }

        .slider:before {
            position: absolute;
            content: "🌙";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }

        input:checked + .slider {
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        }

        input:checked + .slider:before {
            transform: translateX(26px);
            content: "☀️";
        }

        /* Sound Settings Panel */
        .sound-settings {
            max-width: 1200px;
            margin: 20px auto;
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3);
            transition: background 0.3s;
        }

        .light-theme .sound-settings {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
            border: 1px solid #e2e8f0;
        }

        .sound-controls {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
        }

        .sound-toggle {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 20px;
            background-color: #0f172a;
            border-radius: 10px;
            transition: background-color 0.3s;
        }

        .light-theme .sound-toggle {
            background-color: #f1f5f9;
            border: 1px solid #e2e8f0;
        }

        .sound-toggle label {
            font-weight: bold;
            cursor: pointer;
        }

        .sound-toggle input[type="checkbox"] {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }

        .volume-control {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 20px;
            background-color: #0f172a;
            border-radius: 10px;
            transition: background-color 0.3s;
        }

        .light-theme .volume-control {
            background-color: #f1f5f9;
            border: 1px solid #e2e8f0;
        }

        .volume-control input[type="range"] {
            width: 150px;
        }

        /* Notification Badge */
        .notification-badge {
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 8px 16px rgba(239, 68, 68, 0.4);
            display: none;
            align-items: center;
            gap: 10px;
            animation: bounceIn 0.5s ease-out;
            z-index: 999;
            max-width: 300px;
        }

        @keyframes bounceIn {
            0% {
                transform: scale(0.3) translateY(-20px);
                opacity: 0;
            }
            50% {
                transform: scale(1.05);
            }
            100% {
                transform: scale(1) translateY(0);
                opacity: 1;
            }
        }

        .notification-badge.show {
            display: flex;
        }

        .notification-badge .close-btn {
            margin-left: auto;
            cursor: pointer;
            font-size: 20px;
            opacity: 0.8;
        }

        .notification-badge .close-btn:hover {
            opacity: 1;
        }
    </style>
</head>
<body>
    <!-- Theme Toggle Switch -->
    <div class="theme-toggle-container">
        <label class="theme-switch">
            <input type="checkbox" id="themeToggle" onchange="toggleTheme()">
            <span class="slider"></span>
        </label>
    </div>

    <!-- Notification Badge -->
    <div id="notificationBadge" class="notification-badge">
        <span id="notificationIcon">🔔</span>
        <span id="notificationText"></span>
        <span class="close-btn" onclick="closeNotification()">×</span>
    </div>

    <h1>🎯 Smart Crowd Monitoring Dashboard</h1>

    <!-- Sound Settings Panel -->
    <div class="sound-settings">
        <div class="sound-controls">
            <div class="sound-toggle">
                <input type="checkbox" id="soundEnabled" checked onchange="toggleSound()">
                <label for="soundEnabled">🔊 Sound Alerts</label>
            </div>
            <div class="sound-toggle">
                <input type="checkbox" id="voiceEnabled" checked onchange="toggleVoice()">
                <label for="voiceEnabled">🗣️ Voice Announcements</label>
            </div>
            <div class="sound-toggle">
                <input type="checkbox" id="notificationsEnabled" checked onchange="toggleNotifications()">
                <label for="notificationsEnabled">🔔 Push Notifications</label>
            </div>
            <div class="volume-control">
                <span>🔊</span>
                <input type="range" id="volumeSlider" min="0" max="100" value="70" onchange="updateVolume()">
                <span id="volumeValue">70%</span>
            </div>
            <button class="btn btn-primary" onclick="testSound()">🔔 Test Sound</button>
        </div>
    </div>

    <!-- Alert Box -->
    <div id="alertBox" class="alert">
        <span id="alertIcon">⚠️</span>
        <span id="alertMessage"></span>
    </div>

    <!-- Controls -->
    <div class="controls">
        <button class="btn btn-primary" onclick="pauseMonitoring()">
            <span id="pauseIcon">⏸️</span>
            <span id="pauseText">Pause</span>
        </button>
        <button class="btn btn-success" onclick="exportToCSV()">📥 Export Data</button>
        <button class="btn btn-warning" onclick="resetData()">🔄 Reset</button>
        <button class="btn btn-primary" onclick="showInsights()">💡 Show Insights</button>
    </div>

    <!-- Main Dashboard Cards -->
    <div class="dashboard">
        <div class="card">
            <h3>Current Crowd</h3>
            <p id="crowdCount">0</p>
        </div>
        <div class="card">
            <h3>Status</h3>
            <p id="crowdStatus" class="status">Normal</p>
        </div>
        <div class="card peak-time-card">
            <h3>🔥 Peak Time</h3>
            <p id="peakTime" style="font-size: 24px;">--:--</p>
            <div class="subtext">Most Crowded: <span id="peakCrowd">0</span> people</div>
        </div>
        <div class="card least-time-card">
            <h3>🌙 Quietest Time</h3>
            <p id="leastTime" style="font-size: 24px;">--:--</p>
            <div class="subtext">Least Crowded: <span id="leastCrowd">0</span> people</div>
        </div>
    </div>

    <!-- Statistics -->
    <h2>📊 Today's Statistics</h2>
    <div class="stats-grid">
        <div class="stat-card">
            <div class="label">Total Entries</div>
            <div class="value" id="totalEntries" style="color: #10b981;">0</div>
        </div>
        <div class="stat-card">
            <div class="label">Total Exits</div>
            <div class="value" id="totalExits" style="color: #ef4444;">0</div>
        </div>
        <div class="stat-card">
            <div class="label">Average Crowd</div>
            <div class="value" id="avgCount">0</div>
        </div>
        <div class="stat-card">
            <div class="label">Peak Today</div>
            <div class="value" id="peakCount">0</div>
        </div>
    </div>

    <!-- Insights Section -->
    <div class="insights-section" id="insightsSection" style="display: none;">
        <h3>💡 Smart Insights & Recommendations</h3>
        <div id="insightsContainer"></div>
    </div>

    <!-- Hourly Breakdown Chart -->
    <div class="hourly-breakdown">
        <h2>⏰ Hourly Crowd Breakdown</h2>
        <canvas id="hourlyChart"></canvas>
    </div>

    <!-- Live Chart -->
    <h2>📈 Live Crowd Count</h2>
    <canvas id="crowdChart"></canvas>

    <!-- Recent Activity -->
    <h2>📋 Recent Activity</h2>
    <table>
        <thead>
            <tr>
                <th>Time</th>
                <th>Crowd Count</th>
                <th>Status</th>
                <th>Entries</th>
                <th>Exits</th>
                <th>Change</th>
            </tr>
        </thead>
        <tbody id="activityTable"></tbody>
    </table>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        // Initialize variables
        let crowdData = [];
        let labels = [];
        const maxDataPoints = 20;
        let previousCount = 0;
        let isPaused = false;
        let updateIntervalId;
        
        // Statistics
        let peakCount = 0;
        let totalEntries = 0;
        let totalExits = 0;
        let allCounts = [];
        
        // Hourly tracking
        let hourlyData = {};
        for (let i = 0; i < 24; i++) {
            hourlyData[i] = { counts: [], total: 0, average: 0 };
        }
        
        // Peak and least crowded times
        let peakHourInfo = { hour: null, count: 0 };
        let leastHourInfo = { hour: null, count: Infinity };
        
        // Settings
        let settings = {
            updateInterval: 5000,
            moderateThreshold: 50,
            crowdedThreshold: 80,
            maxCapacity: 100
        };

        // Sound & Notification Settings
        let soundSettings = {
            soundEnabled: true,
            voiceEnabled: true,
            notificationsEnabled: true,
            volume: 0.7
        };

        // Audio Context
        let audioContext;
        let speechSynthesis = window.speechSynthesis;

        // Initialize Audio Context
        function initAudio() {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }

        // Play Alert Sound
        function playAlertSound(type = 'normal') {
            if (!soundSettings.soundEnabled) return;
            
            initAudio();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            if (type === 'danger') {
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(soundSettings.volume, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
                
                setTimeout(() => {
                    const osc2 = audioContext.createOscillator();
                    const gain2 = audioContext.createGain();
                    osc2.connect(gain2);
                    gain2.connect(audioContext.destination);
                    osc2.frequency.value = 800;
                    gain2.gain.setValueAtTime(soundSettings.volume, audioContext.currentTime);
                    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    osc2.start(audioContext.currentTime);
                    osc2.stop(audioContext.currentTime + 0.5);
                }, 200);
            } else if (type === 'warning') {
                oscillator.frequency.value = 600;
                gainNode.gain.setValueAtTime(soundSettings.volume, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } else {
                oscillator.frequency.value = 400;
                gainNode.gain.setValueAtTime(soundSettings.volume * 0.5, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            }
        }

        // Voice Announcement
        function speak(text) {
            if (!soundSettings.voiceEnabled) return;
            
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = soundSettings.volume;
            
            speechSynthesis.speak(utterance);
        }

        // Show Push Notification
        function showPushNotification(title, message, type = 'info') {
            if (!soundSettings.notificationsEnabled) return;
            
            const badge = document.getElementById('notificationBadge');
            const icon = document.getElementById('notificationIcon');
            const text = document.getElementById('notificationText');
            
            if (type === 'danger') icon.textContent = '🚨';
            else if (type === 'warning') icon.textContent = '⚠️';
            else if (type === 'success') icon.textContent = '✅';
            else icon.textContent = '🔔';
            
            text.textContent = ${title}: ${message};
            badge.classList.add('show');
            
            setTimeout(() => {
                badge.classList.remove('show');
            }, 5000);
        }

        // Close Notification
        function closeNotification() {
            document.getElementById('notificationBadge').classList.remove('show');
        }

        // Toggle Sound
        function toggleSound() {
            soundSettings.soundEnabled = document.getElementById('soundEnabled').checked;
            localStorage.setItem('soundEnabled', soundSettings.soundEnabled);
            showAlert(Sound alerts ${soundSettings.soundEnabled ? 'enabled' : 'disabled'}, 'success');
        }

        // Toggle Voice
        function toggleVoice() {
            soundSettings.voiceEnabled = document.getElementById('voiceEnabled').checked;
            localStorage.setItem('voiceEnabled', soundSettings.voiceEnabled);
            showAlert(Voice announcements ${soundSettings.voiceEnabled ? 'enabled' : 'disabled'}, 'success');
        }

        // Toggle Notifications
        function toggleNotifications() {
            soundSettings.notificationsEnabled = document.getElementById('notificationsEnabled').checked;
            localStorage.setItem('notificationsEnabled', soundSettings.notificationsEnabled);
            showAlert(Push notifications ${soundSettings.notificationsEnabled ? 'enabled' : 'disabled'}, 'success');
        }

        // Update Volume
        function updateVolume() {
            const volume = document.getElementById('volumeSlider').value;
            soundSettings.volume = volume / 100;
            document.getElementById('volumeValue').textContent = volume + '%';
            localStorage.setItem('volume', soundSettings.volume);
        }

        // Test Sound
        function testSound() {
            playAlertSound('normal');
            speak('Sound test successful');
            showPushNotification('Test', 'Sound and notifications are working!', 'success');
        }

        // Load Sound Settings
        function loadSoundSettings() {
            const savedSound = localStorage.getItem('soundEnabled');
            const savedVoice = localStorage.getItem('voiceEnabled');
            const savedNotif = localStorage.getItem('notificationsEnabled');
            const savedVolume = localStorage.getItem('volume');
            
            if (savedSound !== null) {
                soundSettings.soundEnabled = savedSound === 'true';
                document.getElementById('soundEnabled').checked = soundSettings.soundEnabled;
            }
            
            if (savedVoice !== null) {
                soundSettings.voiceEnabled = savedVoice === 'true';
                document.getElementById('voiceEnabled').checked = soundSettings.voiceEnabled;
            }
            
            if (savedNotif !== null) {
                soundSettings.notificationsEnabled = savedNotif === 'true';
                document.getElementById('notificationsEnabled').checked = soundSettings.notificationsEnabled;
            }
            
            if (savedVolume !== null) {
                soundSettings.volume = parseFloat(savedVolume);
                const volumePercent = Math.round(soundSettings.volume * 100);
                document.getElementById('volumeSlider').value = volumePercent;
                document.getElementById('volumeValue').textContent = volumePercent + '%';
            }
        }

        // Theme management
        let isLightTheme = false;

        function loadTheme() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light') {
                isLightTheme = true;
                document.body.classList.add('light-theme');
                document.getElementById('themeToggle').checked = true;
                updateChartColors(true);
            }
        }

        function toggleTheme() {
            isLightTheme = !isLightTheme;
            document.body.classList.toggle('light-theme');
            localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
            updateChartColors(isLightTheme);
            showAlert(Theme switched to ${isLightTheme ? 'Light' : 'Dark'} mode, 'success');
        }

        function updateChartColors(isLight) {
            const textColor = isLight ? '#1e293b' : 'white';
            const gridColor = isLight ? '#e2e8f0' : '#334155';
            
            crowdChart.options.scales.y.ticks.color = textColor;
            crowdChart.options.scales.y.grid.color = gridColor;
            crowdChart.options.scales.x.ticks.color = textColor;
            crowdChart.options.scales.x.grid.color = gridColor;
            crowdChart.options.plugins.legend.labels.color = textColor;
            crowdChart.update();
            
            hourlyChart.options.scales.y.ticks.color = textColor;
            hourlyChart.options.scales.y.grid.color = gridColor;
            hourlyChart.options.scales.x.ticks.color = textColor;
            hourlyChart.options.scales.x.grid.color = gridColor;
            hourlyChart.options.plugins.legend.labels.color = textColor;
            hourlyChart.update();
        }

        // Initialize Charts
        const ctx = document.getElementById('crowdChart').getContext('2d');
        const crowdChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Crowd Count',
                    data: crowdData,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: 'white', font: { size: 12 } },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: 'white', font: { size: 12 } },
                        grid: { color: '#334155' }
                    }
                },
                plugins: {
                    legend: { labels: { color: 'white', font: { size: 14 } } }
                }
            }
        });

        const hourlyCtx = document.getElementById('hourlyChart').getContext('2d');
        const hourlyChart = new Chart(hourlyCtx, {
            type: 'bar',
            data: {
                labels: Array.from({length: 24}, (_, i) => ${i}:00),
                datasets: [{
                    label: 'Average Crowd per Hour',
                    data: Array(24).fill(0),
                    backgroundColor: function(context) {
                        const value = context.parsed.y;
                        if (value < settings.moderateThreshold) return 'rgba(16, 185, 129, 0.6)';
                        if (value < settings.crowdedThreshold) return 'rgba(245, 158, 11, 0.6)';
                        return 'rgba(239, 68, 68, 0.6)';
                    },
                    borderColor: function(context) {
                        const value = context.parsed.y;
                        if (value < settings.moderateThreshold) return '#10b981';
                        if (value < settings.crowdedThreshold) return '#f59e0b';
                        return '#ef4444';
                    },
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: 'white', font: { size: 12 } },
                        grid: { color: '#334155' }
                    },
                    x: {
                        ticks: { color: 'white', font: { size: 10 } },
                        grid: { color: '#334155' }
                    }
                },
                plugins: {
                    legend: { labels: { color: 'white', font: { size: 14 } } }
                }
            }
        });

        function getCurrentTime() {
            return new Date().toLocaleTimeString();
        }

        function getCurrentHour() {
            return new Date().getHours();
        }

        function formatHour(hour) {
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour % 12 || 12;
            return ${displayHour}:00 ${period};
        }

        function getStatus(count) {
            if (count < settings.moderateThreshold) return { text: 'Normal', class: 'status' };
            if (count < settings.crowdedThreshold) return { text: 'Moderate', class: 'status warning' };
            return { text: 'Crowded', class: 'status danger' };
        }

        function getEntryExit(currentCount, previousCount) {
            const difference = currentCount - previousCount;
            if (difference > 0) return { entries: difference, exits: 0 };
            if (difference < 0) return { entries: 0, exits: Math.abs(difference) };
            return { entries: 0, exits: 0 };
        }

        function showAlert(message, type = 'warning') {
            const alertBox = document.getElementById('alertBox');
            const alertMessage = document.getElementById('alertMessage');
            const alertIcon = document.getElementById('alertIcon');
            
            alertBox.className = alert alert-${type} show;
            alertMessage.textContent = message;
            
            if (type === 'warning') alertIcon.textContent = '⚠️';
            else if (type === 'danger') alertIcon.textContent = '🚨';
            else if (type === 'success') alertIcon.textContent = '✅';
            else if (type === 'info') alertIcon.textContent = '💡';
            
            setTimeout(() => alertBox.classList.remove('show'), 6000);
        }

        function updateHourlyData(hour, count) {
            hourlyData[hour].counts.push(count);
            hourlyData[hour].total += count;
            hourlyData[hour].average = Math.round(hourlyData[hour].total / hourlyData[hour].counts.length);
            
            hourlyChart.data.datasets[0].data[hour] = hourlyData[hour].average;
            hourlyChart.update();
            
            if (hourlyData[hour].average > peakHourInfo.count) {
                peakHourInfo = { hour: hour, count: hourlyData[hour].average };
                document.getElementById('peakTime').textContent = formatHour(hour);
                document.getElementById('peakCrowd').textContent = hourlyData[hour].average;
                
                showAlert(🔥 New Peak Time Detected! ${formatHour(hour)} with ${hourlyData[hour].average} people on average, 'info');
                playAlertSound('normal');
                speak(New peak time detected at ${formatHour(hour)});
                showPushNotification('Peak Time', ${formatHour(hour)} with ${hourlyData[hour].average} people, 'info');
            }
            
            if (hourlyData[hour].counts.length > 0 && hourlyData[hour].average < leastHourInfo.count) {
                leastHourInfo = { hour: hour, count: hourlyData[hour].average };
                document.getElementById('leastTime').textContent = formatHour(hour);
                document.getElementById('leastCrowd').textContent = hourlyData[hour].average;
            }
        }

        function updateStatistics(newCount, entryExit) {
            if (newCount > peakCount) {
                peakCount = newCount;
                document.getElementById('peakCount').textContent = peakCount;
            }
            
            totalEntries += entryExit.entries;
            totalExits += entryExit.exits;
            document.getElementById('totalEntries').textContent = totalEntries;
            document.getElementById('totalExits').textContent = totalExits;
            
            allCounts.push(newCount);
            const average = Math.round(allCounts.reduce((a, b) => a + b, 0) / allCounts.length);
            document.getElementById('avgCount').textContent = average;
        }

        function generateInsights() {
            const insights = [];
            
            if (peakHourInfo.hour !== null) {
                insights.push({
                    icon: '🔥',
                    title: 'Peak Time Alert',
                    description: The busiest time today is ${formatHour(peakHourInfo.hour)} with an average of ${peakHourInfo.count} people. Consider allocating more resources during this time.
                });
            }
            
            if (leastHourInfo.hour !== null && leastHourInfo.count !== Infinity) {
                insights.push({
                    icon: '🌙',
                    title: 'Quietest Period',
                    description: The quietest time today is ${formatHour(leastHourInfo.hour)} with an average of ${leastHourInfo.count} people. Ideal for maintenance or special activities.
                });
            }
            
            const currentHour = getCurrentHour();
            if (hourlyData[currentHour].counts.length >= 3) {
                const recent = hourlyData[currentHour].counts.slice(-3);
                const increasing = recent[0] < recent[1] && recent[1] < recent[2];
                const decreasing = recent[0] > recent[1] && recent[1] > recent[2];
                
                if (increasing) {
                    insights.push({
                        icon: '📈',
                        title: 'Increasing Trend',
                        description: 'Crowd levels are steadily increasing this hour. Prepare for higher traffic.'
                    });
                } else if (decreasing) {
                    insights.push({
                        icon: '📉',
                        title: 'Decreasing Trend',
                        description: 'Crowd levels are decreasing this hour. Good time to reduce active resources.'
                    });
                }
            }
            
            const avgCrowd = allCounts.length > 0 ? allCounts.reduce((a, b) => a + b, 0) / allCounts.length : 0;
            const capacityPercent = (avgCrowd / settings.maxCapacity) * 100;
            
            if (capacityPercent > 70) {
                insights.push({
                    icon: '⚠️',
                    title: 'High Capacity Usage',
                    description: Average capacity usage is ${capacityPercent.toFixed(1)}%. Consider expanding capacity or managing flow.
                });
            }
            
            return insights;
        }

        function showInsights() {
            const insightsSection = document.getElementById('insightsSection');
            const insightsContainer = document.getElementById('insightsContainer');
            
            const insights = generateInsights();
            
            if (insights.length === 0) {
                insightsContainer.innerHTML = '<p style="opacity: 0.7;">Not enough data yet. Keep monitoring to generate insights.</p>';
            } else {
                insightsContainer.innerHTML = insights.map(insight => `
                    <div class="insight-item">
                        <div class="insight-icon">${insight.icon}</div>
                        <div class="insight-content">
                            <div class="insight-title">${insight.title}</div>
                            <div class="insight-description">${insight.description}</div>
                        </div>
                    </div>
                `).join('');
            }
            
            insightsSection.style.display = insightsSection.style.display === 'none' ? 'block' : 'none';
        }

        function updateDashboard() {
            if (isPaused) return;
            
            const newCount = Math.floor(Math.random() * (settings.maxCapacity + 1));
            const currentTime = getCurrentTime();
            const currentHour = getCurrentHour();
            const entryExit = getEntryExit(newCount, previousCount);
            
            document.getElementById('crowdCount').textContent = newCount;
            
            const status = getStatus(newCount);
            const statusElement = document.getElementById('crowdStatus');
            statusElement.textContent = status.text;
            statusElement.className = status.class;
            
            // Sound & Voice Alerts
            if (status.text === 'Crowded' && previousCount < settings.crowdedThreshold) {
                showAlert('🚨 ALERT: Crowd level is now CROWDED!', 'danger');
                playAlertSound('danger');
                speak('Alert! Crowd level is now crowded');
                showPushNotification('CROWDED', Current crowd: ${newCount} people, 'danger');
            } else if (status.text === 'Moderate' && previousCount < settings.moderateThreshold) {
                showAlert('⚠️ Warning: Crowd level is now MODERATE', 'warning');
                playAlertSound('warning');
                speak('Warning. Crowd level is moderate');
                showPushNotification('MODERATE', Current crowd: ${newCount} people, 'warning');
            }
            
            crowdData.push(newCount);
            labels.push(currentTime);
            
            if (crowdData.length > maxDataPoints) {
                crowdData.shift();
                labels.shift();
            }
            
            crowdChart.update();
            updateActivityTable(currentTime, newCount, status.text, entryExit);
            updateStatistics(newCount, entryExit);
            updateHourlyData(currentHour, newCount);
            previousCount = newCount;
        }

        function updateActivityTable(time, count, status, entryExit) {
            const tableBody = document.getElementById('activityTable');
            const change = entryExit.entries - entryExit.exits;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${time}</td>
                <td><strong>${count}</strong></td>
                <td>${status}</td>
                <td style="color: #10b981;">↑ ${entryExit.entries}</td>
                <td style="color: #ef4444;">↓ ${entryExit.exits}</td>
                <td style="color: ${change >= 0 ? '#10b981' : '#ef4444'}; font-weight: bold;">
                    ${change >= 0 ? '+' : ''}${change}
                </td>
            `;
            
            tableBody.insertBefore(row, tableBody.firstChild);
            
            while (tableBody.children.length > 15) {
                tableBody.removeChild(tableBody.lastChild);
            }
        }

        function pauseMonitoring() {
            isPaused = !isPaused;
            const pauseText = document.getElementById('pauseText');
            const pauseIcon = document.getElementById('pauseIcon');
            
            if (isPaused) {
                pauseText.textContent = 'Resume';
                pauseIcon.textContent = '▶️';
                showAlert('Monitoring paused', 'warning');
                speak('Monitoring paused');
            } else {
                pauseText.textContent = 'Pause';
                pauseIcon.textContent = '⏸️';
                showAlert('Monitoring resumed', 'success');
                speak('Monitoring resumed');
            }
        }

        function exportToCSV() {
            const rows = [['Time', 'Crowd Count', 'Status', 'Entries', 'Exits', 'Change']];
            const tableRows = document.getElementById('activityTable').children;
            
            for (let i = tableRows.length - 1; i >= 0; i--) {
                const cells = tableRows[i].cells;
                const row = [
                    cells[0].textContent,
                    cells[1].textContent,
                    cells[2].textContent,
                    cells[3].textContent.replace('↑ ', ''),
                    cells[4].textContent.replace('↓ ', ''),
                    cells[5].textContent
                ];
                rows.push(row);
            }
            
            rows.push([]);
            rows.push(['Hourly Summary']);
            rows.push(['Hour', 'Average Crowd']);
            
            for (let i = 0; i < 24; i++) {
                if (hourlyData[i].counts.length > 0) {
                    rows.push([formatHour(i), hourlyData[i].average]);
                }
            }
            
            rows.push([]);
            rows.push(['Peak Time', formatHour(peakHourInfo.hour), peakHourInfo.count]);
            rows.push(['Quietest Time', formatHour(leastHourInfo.hour), leastHourInfo.count]);
            
            const csv = rows.map(row => row.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = crowd-monitoring-${new Date().toISOString().split('T')[0]}.csv;
            a.click();
            window.URL.revokeObjectURL(url);
            
            showAlert('Data exported successfully!', 'success');
            playAlertSound('normal');
        }

        function resetData() {
            if (confirm('Are you sure you want to reset all data?')) {
                crowdData = [];
                labels = [];
                previousCount = 0;
                peakCount = 0;
                totalEntries = 0;
                totalExits = 0;
                allCounts = [];
                
                for (let i = 0; i < 24; i++) {
                    hourlyData[i] = { counts: [], total: 0, average: 0 };
                }
                
                peakHourInfo = { hour: null, count: 0 };
                leastHourInfo = { hour: null, count: Infinity };
                
                crowdChart.update();
                hourlyChart.data.datasets[0].data = Array(24).fill(0);
                hourlyChart.update();
                
                document.getElementById('activityTable').innerHTML = '';
                document.getElementById('peakCount').textContent = '0';
                document.getElementById('avgCount').textContent = '0';
                document.getElementById('totalEntries').textContent = '0';
                document.getElementById('totalExits').textContent = '0';
                document.getElementById('peakTime').textContent = '--:--';
                document.getElementById('peakCrowd').textContent = '0';
                document.getElementById('leastTime').textContent = '--:--';
                document.getElementById('leastCrowd').textContent = '0';
                
                showAlert('All data has been reset', 'success');
                speak('All data has been reset');
            }
        }

        // Initialize
        loadTheme();
        loadSoundSettings();
        updateDashboard();
        updateIntervalId = setInterval(updateDashboard, settings.updateInterval);
        
        setInterval(() => {
            const insights = generateInsights();
            if (insights.length > 0 && Math.random() > 0.5) {
                const randomInsight = insights[Math.floor(Math.random() * insights.length)];
                showAlert(${randomInsight.icon} ${randomInsight.title}: ${randomInsight.description}, 'info');
            }
        }, 120000);
    </script>
</body>
</html>
