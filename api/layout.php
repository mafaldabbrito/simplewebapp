<?php
// layout.php

// Variables passed in: $title, $manifest, $icon, $themeColor, $contentFile

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
    <?php include $contentFile; ?>

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
