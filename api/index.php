<?php
// Get path without query string
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove leading/trailing slashes
$path = trim($path, '/');

// First segment of the path determines the view
$segments = explode('/', $path);
$view = $segments[0] ?: 'main';

// Decide which manifest & metadata to serve
switch ($view) {
    case 'dashboard':
        $manifest = '/manifests/manifest-dashboard.json';
        $title = 'Dashboard - EOW PWA Demo';
        $icon = '/icons/dashboard.svg';
        $themeColor = '#6b7280';
        break;

    case 'settings':
        $manifest = '/manifests/manifest-settings.json';
        $title = 'Settings - EOW PWA Demo';
        $icon = '/icons/settings.png';
        $themeColor = '#8b4513';
        break;

    default:
        $manifest = '/manifests/manifest-main.json';
        $title = 'EOW PWA Demo';
        $icon = '/icons/default-icon.png';
        $themeColor = '#000000';
        break;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title><?= htmlspecialchars($title) ?></title>
    <link rel="manifest" href="<?= htmlspecialchars($manifest) ?>" />
    <link rel="icon" href="<?= htmlspecialchars($icon) ?>" />
    <link rel="stylesheet" href="/styles.css">
    <meta name="theme-color" content="<?= htmlspecialchars($themeColor) ?>" />
</head>
<body>
<?php if ($view === 'main'): ?>
    <!-- Main Page -->
    <div id="main-page" class="main-page">
        <header class="main-header">
            <h1>EOW PWA Demo</h1>
            <p>Demo for the EOW PWA feature</p>
        </header>
        
        <main class="main-content">
            <div class="button-container">
                <a href="/dashboard" class="app-button dashboard-button">
                    <img src="/icons/dashboard.svg" alt="Dashboard" class="button-icon">
                    <span>Dashboard</span>
                </a>
                
                <a href="/settings" class="app-button settings-button">
                    <img src="/icons/settings.png" alt="Settings" class="button-icon">
                    <span>Settings</span>
                </a>
            </div>
        </main>
    </div>

<?php elseif ($view === 'dashboard'): ?>
    <!-- Dashboard Standalone Page -->
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

<?php elseif ($view === 'settings'): ?>
    <!-- Settings Standalone Page -->
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
<?php endif; ?>

<script src="/script.js"></script>
<script>
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker registered:', reg.scope))
            .catch(err => console.error('Service Worker registration failed:', err));
    }
</script>
</body>

</html>
