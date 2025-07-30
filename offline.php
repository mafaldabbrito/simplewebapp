<?php
// Check if specific page is requested, otherwise show main page
$route = $_GET['page'] ?? 'main';
$modal = $_GET['modal'] ?? null;

// Determine which manifest and settings to use
if ($modal === 'dashboard') {
    $manifest = 'manifest-dashboard.json';
    $title = 'Dashboard Offline - MyApp';
    $icon = '/icons/dashboard.svg';
    $themeColor = '#6b7280';
    $context = 'Dashboard';
} elseif ($modal === 'settings') {
    $manifest = 'manifest-settings.json';
    $title = 'Settings Offline - MyApp';
    $icon = '/icons/settings.png';
    $themeColor = '#8b4513';
    $context = 'Settings';
} else {
    $manifest = 'manifest.json';
    $title = 'You\'re Offline - MyApp';
    $icon = '/icons/dashboard.svg';
    $themeColor = '#6b7280';
    $context = 'MyApp';
}

// Legacy support for direct page access
if ($route !== 'main' && !$modal) {
    switch ($route) {
        case 'settings':
            $title = 'Settings Offline - MyApp';
            $context = 'Settings';
            $icon = '/icons/settings.png';
            $themeColor = '#8b4513';
            break;
        case 'dashboard':
        default:
            $title = 'Dashboard Offline - MyApp';
            $context = 'Dashboard';
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
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, <?php echo $themeColor; ?>33 0%, <?php echo $themeColor; ?>66 100%);
            color: #333;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 2rem;
        }

        .offline-container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 3rem 2rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            animation: slideIn 0.6s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .offline-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 2rem;
            border-radius: 50%;
            background: #ff6b6b;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            color: white;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }

        .offline-title {
            font-size: 2rem;
            color: #333;
            margin-bottom: 1rem;
            font-weight: 600;
        }

        .offline-message {
            font-size: 1.1rem;
            color: #666;
            margin-bottom: 2rem;
            line-height: 1.6;
        }

        .offline-suggestions {
            text-align: left;
            background: #f8f9fa;
            border-radius: 10px;
            padding: 1.5rem;
            margin-bottom: 2rem;
        }

        .offline-suggestions h3 {
            color: #333;
            margin-bottom: 1rem;
            font-size: 1.2rem;
        }

        .offline-suggestions ul {
            list-style: none;
            padding: 0;
        }

        .offline-suggestions li {
            margin-bottom: 0.8rem;
            padding-left: 1.5rem;
            position: relative;
            color: #555;
        }

        .offline-suggestions li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
        }

        .retry-button {
            background: linear-gradient(45deg, <?php echo $themeColor; ?>, <?php echo $themeColor; ?>dd);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            margin: 0.5rem;
        }

        .retry-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .retry-button:active {
            transform: translateY(0);
        }

        .back-button {
            background: transparent;
            color: <?php echo $themeColor; ?>;
            border: 2px solid <?php echo $themeColor; ?>;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            margin: 0.5rem;
        }

        .back-button:hover {
            background: <?php echo $themeColor; ?>;
            color: white;
            transform: translateY(-2px);
        }

        .connection-status {
            margin-top: 2rem;
            padding: 1rem;
            border-radius: 10px;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .status-offline {
            background: #fee;
            color: #c53030;
            border: 1px solid #feb2b2;
        }

        .status-online {
            background: #f0fff4;
            color: #2d7738;
            border: 1px solid #9ae6b4;
        }

        @media (max-width: 480px) {
            .offline-container {
                padding: 2rem 1.5rem;
                margin: 1rem;
            }
            
            .offline-title {
                font-size: 1.5rem;
            }
            
            .offline-message {
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="offline-container">
        <div class="offline-icon">
            📡
        </div>
        
        <h1 class="offline-title"><?php echo $context; ?> is Offline</h1>
        
        <p class="offline-message">
            It looks like you're not connected to the internet. The <?php echo $context; ?> section may not be available right now, but you can still access cached content.
        </p>
        
        <div class="offline-suggestions">
            <h3>Try these steps:</h3>
            <ul>
                <li>Check your internet connection</li>
                <li>Make sure WiFi or mobile data is enabled</li>
                <li>Try refreshing the page in a moment</li>
                <li>Check if other websites are working</li>
            </ul>
        </div>
        
        <div class="button-group">
            <button class="retry-button" onclick="retryConnection()">
                Try Again
            </button>
            <button class="back-button" onclick="goBack()">
                Go Back
            </button>
            <?php if ($context !== 'MyApp'): ?>
            <button class="back-button" onclick="goToMain()">
                Back to Main
            </button>
            <?php endif; ?>
        </div>
        
        <div id="connection-status" class="connection-status status-offline">
            ⚠️ Currently offline
        </div>
    </div>

    <script>
        // Check connection status
        function updateConnectionStatus() {
            const statusElement = document.getElementById('connection-status');
            if (navigator.onLine) {
                statusElement.textContent = '✅ Connection restored!';
                statusElement.className = 'connection-status status-online';
            } else {
                statusElement.textContent = '⚠️ Currently offline';
                statusElement.className = 'connection-status status-offline';
            }
        }

        // Retry connection
        function retryConnection() {
            if (navigator.onLine) {
                // Try to reload the original page
                window.location.reload();
            } else {
                // Show feedback that we're still offline
                const button = event.target;
                const originalText = button.textContent;
                button.textContent = 'Still offline...';
                button.style.background = '#ff6b6b';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = 'linear-gradient(45deg, <?php echo $themeColor; ?>, <?php echo $themeColor; ?>dd)';
                }, 2000);
            }
        }

        // Go back function
        function goBack() {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // If no history, try to go to the main page
                window.location.href = '/';
            }
        }

        // Go to main page function
        function goToMain() {
            window.location.href = '/';
        }

        // Listen for connection changes
        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);

        // Initial status check
        updateConnectionStatus();

        // Auto-retry when connection is restored
        window.addEventListener('online', function() {
            setTimeout(function() {
                if (navigator.onLine) {
                    window.location.reload();
                }
            }, 1000);
        });
    </script>
</body>
</html>
