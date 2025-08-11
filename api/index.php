<?php
// Get the request URI
$uri = $_SERVER['REQUEST_URI'];
$path = parse_url($uri, PHP_URL_PATH);

// Remove trailing slash if present
$path = rtrim($path, '/');

// Set default values
$title = 'EOW PWA Demo';
$manifest = '/manifests/manifest-main.json';
$icon = '/icons/default-icon.png';
$themeColor = '#000000';
$contentFile = __DIR__ . '/views/main.php';

// Change values based on path
switch ($path) {
    case '/dashboard':
        $title = 'EOW PWA Demo - Dashboard';
        $manifest = '/manifests/manifest-dashboard.json';
        $icon = '/icons/dashboard-icon.png';
        $themeColor = '#2c3e50';
        $contentFile = __DIR__ . '/views/dashboard.php';
        break;
    
    case '/settings':
        $title = 'EOW PWA Demo - Settings';
        $manifest = '/manifests/manifest-settings.json';
        $icon = '/icons/settings-icon.png';
        $themeColor = '#3498db';
        $contentFile = __DIR__ . '/views/settings.php';
        break;
    
    default:
        // Keep default values for home page
        break;
}

include __DIR__ . '/layout.php';