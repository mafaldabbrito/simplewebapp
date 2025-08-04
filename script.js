// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const dashboardBtn = document.getElementById('dashboard-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const dashboardModal = document.getElementById('dashboard-modal');
    const settingsModal = document.getElementById('settings-modal');
    const closeBtns = document.querySelectorAll('.close-btn');


    // Dashboard functionality
    function initializeDashboard() {
        // Counter functionality
        const counter = document.getElementById('counter');
        const incrementBtn = document.getElementById('increment-btn');
        const decrementBtn = document.getElementById('decrement-btn');
        const resetBtn = document.getElementById('reset-btn');
        
        // Check if elements exist before trying to access them
        if (!counter || !incrementBtn || !decrementBtn || !resetBtn) {
            console.warn('Dashboard elements not found, retrying in 100ms...');
            setTimeout(initializeDashboard, 100);
            return;
        }
        
        let count = parseInt(localStorage.getItem('counter') || '0');
        counter.textContent = count;

        incrementBtn.addEventListener('click', () => {
            count++;
            counter.textContent = count;
            localStorage.setItem('counter', count.toString());
        });

        decrementBtn.addEventListener('click', () => {
            count--;
            counter.textContent = count;
            localStorage.setItem('counter', count.toString());
        });

        resetBtn.addEventListener('click', () => {
            count = 0;
            counter.textContent = count;
            localStorage.setItem('counter', count.toString());
        });
  
    }

    // Settings functionality
    function initializeSettings() {
        // Theme selection
        const themeSelect = document.getElementById('theme-select');
        const notificationsEnabled = document.getElementById('notifications-enabled');
        const languageSelect = document.getElementById('language-select');

        // Check if elements exist before trying to access them
        if (!themeSelect || !notificationsEnabled || !languageSelect) {
            console.warn('Settings elements not found, retrying in 100ms...');
            setTimeout(initializeSettings, 100);
            return;
        }

        // Load saved settings
        themeSelect.value = localStorage.getItem('theme') || 'light';
        notificationsEnabled.checked = localStorage.getItem('notifications') !== 'false';
        languageSelect.value = localStorage.getItem('language') || 'en';

        // Save settings on change
        themeSelect.addEventListener('change', () => {
            localStorage.setItem('theme', themeSelect.value);
            applyTheme(themeSelect.value);
        });

        notificationsEnabled.addEventListener('change', () => {
            localStorage.setItem('notifications', notificationsEnabled.checked.toString());
        });

        languageSelect.addEventListener('change', () => {
            localStorage.setItem('language', languageSelect.value);
        });
    }

    function applyTheme(theme) {
        // Basic theme application
        const body = document.body;
        body.classList.remove('light-theme', 'dark-theme');
        
        if (theme === 'dark') {
            body.classList.add('dark-theme');
        } else if (theme === 'light') {
            body.classList.add('light-theme');
        }
        // 'auto' theme would require media query detection
    }

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // URL parameter functionality for direct modal access
    function updateURL(modalName) {
        const url = new URL(window.location);
        if (modalName) {
            url.searchParams.set('modal', modalName);
        } else {
            url.searchParams.delete('modal');
        }
        window.history.pushState({}, '', url);
    }

    // Modal configurations
    const modalConfigs = {
        dashboard: {
            btn: dashboardBtn,
            modal: dashboardModal,
            title: 'Dashboard',
            init: initializeDashboard
        },
        settings: {
            btn: settingsBtn,
            modal: settingsModal,
            title: 'Settings',
            init: initializeSettings
        }
    };

    // Check URL parameters and open modal if specified
    const urlParams = new URLSearchParams(window.location.search);
    const modalParam = urlParams.get('modal');
    
    // Set window title and theme based on the modal parameter
    if (modalConfigs[modalParam]) {
        const config = modalConfigs[modalParam];
        document.title = config.title;
        config.modal.classList.add('active');
        config.init();
        
        // Hide main page when opened directly via shortcut
        const mainPage = document.getElementById('main-page');
        if (mainPage) {
            mainPage.style.display = 'none';
        }
    } else {
        document.title = 'EOW PWA Demo';
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#6b7280');
    }

    // Add modal event listeners to include URL updates
    Object.entries(modalConfigs).forEach(([modalName, config]) => {
        if (config.btn) {
            config.btn.addEventListener('click', () => {
                document.title = config.title;
                config.modal.classList.add('active');
                config.init();
                updateURL(modalName);
            });
        } else {
            console.error(`Button for ${modalName} not found!`);
        }
    });

    // Add close button functionality
    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = e.target.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                document.title = 'EOW PWA Demo';
                
                // Show main page
                const mainPage = document.getElementById('main-page');
                if (mainPage) {
                    mainPage.style.display = 'flex';
                }
                
                updateURL(null);
            }
        });
    });

    // Offline/Online detection functionality
    function initializeOfflineDetection() {
        let isOnline = navigator.onLine;
        
        function updateOnlineStatus() {
            const wasOnline = isOnline;
            isOnline = navigator.onLine;
            
            if (!isOnline && wasOnline) {
                // Just went offline - notify service worker
                console.log('User went offline');
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                        type: 'USER_OFFLINE'
                    });
                }
            } else if (isOnline && !wasOnline) {
                // Just came back online - notify service worker
                console.log('User came back online');
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                        type: 'USER_ONLINE'
                    });
                }
            }
        }
        
        // Listen for online/offline events
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        
        // Optional: Periodic network check for more reliable detection
        setInterval(() => {
            // This makes a simple request to check actual connectivity
            fetch('/manifest.json', { 
                method: 'HEAD',
                cache: 'no-cache'
            })
            .then(() => {
                if (!navigator.onLine) {
                    // Browser thinks we're offline but we can actually make requests
                    window.dispatchEvent(new Event('online'));
                }
            })
            .catch(() => {
                if (navigator.onLine) {
                    // Browser thinks we're online but requests are failing
                    window.dispatchEvent(new Event('offline'));
                }
            });
        }, 30000); // Check every 30 seconds
    }
    
    // Initialize offline detection
    initializeOfflineDetection();

    /* WINDOW-MANAGEMENT PERMISSION THINGS */
    function setWindowPlacementPermissionButton() {
        const btn = document.getElementById("window-placement-btn");
        if (btn) {
            btn.addEventListener("click", async (event) => {
                try {
                    await window.getScreenDetails();
                    // Hide the permission section after granting
                    document.getElementById("window-placement").style.display = "none";
                } catch (error) {
                    console.error("Failed to get screen details:", error);
                }
            });
        }
    }

    // Check window management permission
    if (navigator.permissions) {
        navigator.permissions.query({ name: "window-management" }).then((status) => {
            const isGranted = status.state == "granted";
            if (!isGranted) setWindowPlacementPermissionButton();
            const placementEl = document.getElementById("window-placement");
            if (placementEl) {
                placementEl.style.display = isGranted ? "none" : "block";
            }
        }).catch(error => {
            console.log("Window management permission not supported:", error);
        });
    }

    /* WINDOW CONTROLS THINGS */
    function setupWindowControls(prefix = '') {
        const minBtn = document.getElementById(prefix + "min-button");
        const maxBtn = document.getElementById(prefix + "max-button");
        const restoreBtn = document.getElementById(prefix + "restore-button");
        const closeBtn = document.getElementById(prefix + "close-button");

        if (minBtn) {
            minBtn.addEventListener("click", async (event) => {
                try {
                    await window.minimize();
                } catch (error) {
                    console.error("Failed to minimize window:", error);
                }
            });
        }

        if (maxBtn) {
            maxBtn.addEventListener("click", async (event) => {
                try {
                    await window.maximize();
                } catch (error) {
                    console.error("Failed to maximize window:", error);
                }
            });
        }

        if (restoreBtn) {
            restoreBtn.addEventListener("click", async (event) => {
                try {
                    await window.restore();
                } catch (error) {
                    console.error("Failed to restore window:", error);
                }
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener("click", (event) => {
                try {
                    window.close();
                } catch (error) {
                    console.error("Failed to close window:", error);
                    // Fallback to modal close behavior
                    const modalId = closeBtn.getAttribute('data-modal');
                    if (modalId) {
                        const modal = document.getElementById(modalId);
                        if (modal) {
                            modal.classList.remove('active');
                            document.title = 'EOW PWA Demo';
                            const mainPage = document.getElementById('main-page');
                            if (mainPage) {
                                mainPage.style.display = 'flex';
                            }
                            updateURL(null);
                        }
                    }
                }
            });
        }
    }

    // Setup window controls for both dashboard and settings
    setupWindowControls(''); // Dashboard controls
    setupWindowControls('settings-'); // Settings controls

});
