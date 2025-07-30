<?php
// Check if specific page is requested, otherwise show main page
$route = $_GET['page'] ?? 'main';
$modal = $_GET['modal'] ?? null;

// Determine which manifest and settings to use
if ($modal === 'dashboard') {
    $manifest = 'manifest-dashboard.json';
    $title = 'Dashboard - MyApp';
    $icon = '/icons/dashboard.svg';
    $themeColor = '#6b7280';
} elseif ($modal === 'settings') {
    $manifest = 'manifest-settings.json';
    $title = 'Settings - MyApp';
    $icon = '/icons/settings.png';
    $themeColor = '#8b4513';
} else {
    $manifest = 'manifest.json';
    $title = 'MyApp';
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
            <h1>MyApp</h1>
            <p>Welcome to your application</p>
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
        </main>
    </div>

    <!-- Dashboard Modal -->
    <div id="dashboard-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Dashboard</h2>
                <div class="window-controls">
                    <button class="window-btn minimize-btn" disabled>&#8722;</button>
                    <button class="window-btn maximize-btn" disabled>&#9744;</button>
                    <button class="window-btn close-btn" data-modal="dashboard-modal">&times;</button>
                </div>
            </div>
            <div class="modal-body">
                <!-- Dashboard Section -->
                <section id="dashboard" class="section active">
                    <div class="container">
                        <div class="card">
                            <h2>Dashboard</h2>
                            <p>Welcome to your dashboard! Here you can view your data and analytics.</p>
                            
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
                    <button class="window-btn minimize-btn" disabled>&#8722;</button>
                    <button class="window-btn maximize-btn" disabled>&#9744;</button>
                    <button class="window-btn close-btn" data-modal="settings-modal">&times;</button>
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

                            <div class="settings-group">
                                <h3>Language</h3>
                                <select id="language-select" class="form-control">
                                    <option value="en">English</option>
                                    <option value="es">Español</option>
                                    <option value="fr">Français</option>
                                    <option value="de">Deutsch</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>

    <script src="/script.js"></script>
    
    <?php else: ?>
    <!-- Legacy page support -->
    <div style="
        margin: 0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #f0f2f5;
        color: #333;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
    ">
        <header style="
            background-color: <?php echo $themeColor; ?>;
            color: white;
            width: 100%;
            padding: 1rem;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        ">
            <h1 style="margin: 1rem 0; font-size: 2rem;"><?php echo $title; ?></h1>
        </header>

        <main style="padding: 2rem;">
            <p style="font-size: 1.2rem; margin-bottom: 2rem;"><?php echo $content; ?></p>
            <nav>
                <a href="/" style="
                    display: inline-block;
                    margin: 0.5rem 1rem;
                    padding: 0.5rem 1rem;
                    background-color: #fff;
                    border: 2px solid <?php echo $themeColor; ?>;
                    color: <?php echo $themeColor; ?>;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: bold;
                    transition: all 0.3s ease;
                ">Back to Main</a>
                <a href="?page=dashboard" style="
                    display: inline-block;
                    margin: 0.5rem 1rem;
                    padding: 0.5rem 1rem;
                    background-color: #fff;
                    border: 2px solid <?php echo $themeColor; ?>;
                    color: <?php echo $themeColor; ?>;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: bold;
                    transition: all 0.3s ease;
                ">Dashboard</a>
                <a href="?page=settings" style="
                    display: inline-block;
                    margin: 0.5rem 1rem;
                    padding: 0.5rem 1rem;
                    background-color: #fff;
                    border: 2px solid <?php echo $themeColor; ?>;
                    color: <?php echo $themeColor; ?>;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: bold;
                    transition: all 0.3s ease;
                ">Settings</a>
            </nav>
        </main>

        <footer style="
            margin-top: auto;
            padding: 1rem;
            font-size: 0.85rem;
            color: #aaa;
        ">
            Powered by PHP • PWA Example
        </footer>
    </div>
    <?php endif; ?>
</body>
</html>

  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  </script>
</body>
</html>
