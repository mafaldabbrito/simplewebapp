<?php
// Determine route
$route = $_GET['page'] ?? 'dashboard';

// Single manifest file for the entire app
$manifest = 'manifest.json';

switch ($route) {
    case 'settings':
        $title = 'Settings';
        $content = 'Welcome to the Settings Page!';
        $icon = '/icons/settings.png';
        $themeColor = '#4caf50';
        break;
    case 'dashboard':
    default:
        $title = 'Dashboard';
        $content = 'Welcome to the Dashboard!';
        $icon = '/icons/dashboard.png';
        $themeColor = '#2196f3';
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
  <meta name="theme-color" content="<?php echo $themeColor; ?>" />

  <style>
    body {
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
    }

    header {
      background-color: <?php echo $themeColor; ?>;
      color: white;
      width: 100%;
      padding: 1rem;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
      margin: 1rem 0;
      font-size: 2rem;
    }

    nav a {
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
    }

    nav a:hover {
      background-color: <?php echo $themeColor; ?>;
      color: #fff;
    }

    footer {
      margin-top: auto;
      padding: 1rem;
      font-size: 0.85rem;
      color: #aaa;
    }
  </style>
</head>
<body>
  <header>
    <h1><?php echo $title; ?></h1>
  </header>

  <main>
    <p><?php echo $content; ?></p>
    <nav>
      <a href="?page=dashboard">Dashboard</a>
      <a href="?page=settings">Settings</a>
    </nav>
  </main>

  <footer>
    Powered by PHP • PWA Example
  </footer>

  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  </script>
</body>
</html>
