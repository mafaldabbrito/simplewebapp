<?php
// Check if specific page is requested, otherwise show main page
$route = $_GET['page'] ?? 'main';
$modal = $_GET['modal'] ?? null;

// Determine which manifest and settings to use
if ($modal === 'dashboard') {
    $manifest = 'manifest-dashboard.json';
    $title = 'Dashboard - EOW PWA Demo';
    $icon = '/icons/dashboard.svg';
    $themeColor = '#6b7280';
} elseif ($modal === 'settings') {
    $manifest = 'manifest-settings.json';
    $title = 'Settings - EOW PWA Demo';
    $icon = '/icons/settings.png';
    $themeColor = '#8b4513';
} else {
    $manifest = 'manifest.json';
    $title = 'EOW PWA Demo';
    $icon = '/icons/dashboard.svg';
    $themeColor = '#6b7280';
}

// Legacy support for direct page access
if ($route !== 'main' && !$modal) {
    switch ($route) {
        case 'settings':
            $title = 'Settings';
            $content = 'Welcome to the Settings Page!';
            $icon = '/icons/settings.png';
            $themeColor = '#8b4513';
            break;
        case 'dashboard':
        default:
            $title = 'Dashboard';
            $content = 'Welcome to the Dashboard!';
            $icon = '/icons/dashboard.svg';
            $themeColor = '#6b7280';
            break;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $title; ?></title>
    <link rel="manifest" href="/<?php echo $manifest; ?>">
    <link rel="icon" href="<?php echo $icon; ?>">
    <meta name="theme-color" content="<?php echo $themeColor; ?>">
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <?php if ($route === 'main' || !isset($_GET['page'])): ?>
    <!-- Main Page -->
    <div id="main-page" class="main-page">
        <header class="main-header">
            <h1>EOW PWA Demo</h1>
            <p>Demo for the EOW PWA feature</p>
        </header>
        
        <main class="main-content">
            <div class="button-container">
                <button id="dashboard-btn" class="app-button dashboard-button">
                    <img src="/icons/dashboard.svg" alt="Dashboard" class="button-icon">
                    <span>Dashboard</span>
                </button>
                
                <button id="settings-btn" class="app-button settings-button">
                    <img src="/icons/settings.png" alt="Settings" class="button-icon">
                    <span>Settings</span>
                </button>
            </div>
            
            <!-- Window Management Permission -->
            <div id="window-placement" class="permission-section" style="display: none;">
                <p>This app needs window management permissions for advanced window controls.</p>
                <button id="window-placement-btn" class="btn btn-primary">Grant Window Management Permission</button>
            </div>
        </main>
    </div>

    <!-- Dashboard Modal -->
    <div id="dashboard-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Dashboard</h2>
                <div class="window-controls">
                    <button class="window-btn minimize-btn" id="min-button">&#8722;</button>
                    <button class="window-btn maximize-btn" id="max-button">&#9744;</button>
                    <button class="window-btn restore-btn" id="restore-button">&#9634;</button>
                    <button class="window-btn close-btn" id="close-button" data-modal="dashboard-modal">&times;</button>
                </div>
            </div>
            <div class="modal-body">
                <!-- Dashboard Section -->
                <section id="dashboard" class="section active">
                    <div class="container">
                        <div class="card">
                            <h2>Dashboard</h2>
                            <p>Welcome to your dashboard!</p>
                            
                            <div class="counter-section">
                                <h3>Counter</h3>
                                <div class="counter-display">
                                    <span id="counter">0</span>
                                </div>
                                <div class="counter-controls">
                                    <button id="decrement-btn" class="btn btn-danger">-</button>
                                    <button id="reset-btn" class="btn btn-secondary">Reset</button>
                                    <button id="increment-btn" class="btn btn-success">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>

    <!-- Settings Modal -->
    <div id="settings-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Settings</h2>
                <div class="window-controls">
                    <button class="window-btn minimize-btn" id="settings-min-button">&#8722;</button>
                    <button class="window-btn maximize-btn" id="settings-max-button">&#9744;</button>
                    <button class="window-btn restore-btn" id="settings-restore-button">&#9634;</button>
                    <button class="window-btn close-btn" id="settings-close-button" data-modal="settings-modal">&times;</button>
                </div>
            </div>
            <div class="modal-body">
                <!-- Settings Section -->
                <section id="settings" class="section active">
                    <div class="container">
                        <div class="card">
                            <h2>Settings</h2>
                            <p>Configure your application preferences here.</p>
                            
                            <div class="settings-group">
                                <h3>Theme</h3>
                                <select id="theme-select" class="form-control">
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="auto">Auto</option>
                                </select>
                            </div>

                            <div class="settings-group">
                                <h3>Notifications</h3>
                                <label class="checkbox-label">
                                    <input type="checkbox" id="notifications-enabled" checked>
                                    Enable notifications
                                </label>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>

    <?php endif; ?>

    <script src="/script.js"></script>
    
    <script>
        // Service Worker registration
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(function(registration) {
                    console.log('Service Worker registered successfully:', registration.scope);
                })
                .catch(function(error) {
                    console.log('Service Worker registration failed:', error);
                });
        }
    </script>
</body>
</html>
