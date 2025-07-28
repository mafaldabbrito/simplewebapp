<?php
// Determine route
$route = $_GET['page'] ?? 'dashboard';

switch ($route) {
    case 'settings':
        $manifest = 'manifest-settings.json';
        $title = 'Settings';
        $content = 'Welcome to the Settings Page!';
        $icon = '/icons/settings.png';
        break;
    case 'dashboard':
    default:
        $manifest = 'manifest-dashboard.json';
        $title = 'Dashboard';
        $content = 'Welcome to the Dashboard!';
        $icon = '/icons/dashboard.png';
        break;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title><?php echo $title; ?></title>
  <link rel="manifest" href="/<?php echo $manifest; ?>">
  <link rel="icon" href="<?php echo $icon; ?>" />
</head>
<body>
  <h1><?php echo $content; ?></h1>

  <p><a href="?page=dashboard">Go to Dashboard</a> | <a href="?page=settings">Go to Settings</a></p>

  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  </script>
</body>
</html>
