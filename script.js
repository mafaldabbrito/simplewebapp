// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const dashboardBtn = document.getElementById('dashboard-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const dashboardModal = document.getElementById('dashboard-modal');
    const settingsModal = document.getElementById('settings-modal');
    const closeBtns = document.querySelectorAll('.close-btn');

    // Debug: Check if elements are found
    console.log('Dashboard button:', dashboardBtn);
    console.log('Settings button:', settingsBtn);
    console.log('Dashboard modal:', dashboardModal);
    console.log('Settings modal:', settingsModal);


    // Dashboard functionality
    function initializeDashboard() {
        // Counter functionality
        const counter = document.getElementById('counter');
        const incrementBtn = document.getElementById('increment-btn');
        const decrementBtn = document.getElementById('decrement-btn');
        const resetBtn = document.getElementById('reset-btn');
        
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
        console.log('updateURL called with:', modalName);
        const url = new URL(window.location);
        if (modalName) {
            url.searchParams.set('modal', modalName);
        } else {
            url.searchParams.delete('modal');
        }
        console.log('New URL will be:', url.toString());
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
        console.log(`Adding event listener for ${modalName}`, config.btn);
        if (config.btn) {
            config.btn.addEventListener('click', () => {
                console.log(`${modalName} button clicked`);
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

});
