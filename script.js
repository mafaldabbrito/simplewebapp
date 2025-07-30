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
        document.title = 'MyApp';
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#6b7280');
    }

    // Override existing modal event listeners to include URL updates
    dashboardBtn.removeEventListener('click', dashboardBtn.onclick);
    settingsBtn.removeEventListener('click', settingsBtn.onclick);

    Object.entries(modalConfigs).forEach(([modalName, config]) => {
        config.btn.addEventListener('click', () => {
            document.title = config.title;
            config.modal.classList.add('active');
            config.init();
            updateURL(modalName);
        });
    });

    // Update close functionality
    closeBtns.forEach(btn => {
        const originalHandler = btn.onclick;
        btn.removeEventListener('click', originalHandler);
        btn.addEventListener('click', (e) => {
            const modalId = e.target.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                document.title = 'MyApp';
                
                // Show main page
                const mainPage = document.getElementById('main-page');
                if (mainPage) {
                    mainPage.style.display = 'flex';
                }
                
                updateURL(null);
            }
        });
    });

    // Update window click listener
    // const originalWindowHandler = window.onclick;
    // window.removeEventListener('click', originalWindowHandler);
    // window.addEventListener('click', (e) => {
    //     if (e.target.classList.contains('modal')) {
    //         e.target.classList.remove('active');
    //         document.title = 'MyApp';
    //         document.querySelector('meta[name="theme-color"]').setAttribute('content', '#2196f3');
            
    //         // Show main page
    //         const mainPage = document.getElementById('main-page');
    //         if (mainPage) {
    //             mainPage.style.display = 'flex';
    //         }
            
    //         updateURL(null);
    //     }
    // });

    // // Handle browser back/forward buttons
    // window.addEventListener('popstate', () => {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const modalParam = urlParams.get('modal');
        
    //     // Close all modals first
    //     document.querySelectorAll('.modal').forEach(modal => {
    //         modal.classList.remove('active');
    //     });
        
    //     // Show main page
    //     const mainPage = document.getElementById('main-page');
    //     if (mainPage) {
    //         mainPage.style.display = 'flex';
    //     }
        
    //     // Open the appropriate modal based on URL and set window properties
    //     if (modalParam === 'dashboard') {
    //         document.title = 'Dashboard - MyApp';
    //         dashboardModal.classList.add('active');
    //         initializeDashboard();
    //         if (mainPage) mainPage.style.display = 'none';
    //     } else if (modalParam === 'settings') {
    //         document.title = 'Settings - MyApp';
    //         settingsModal.classList.add('active');
    //         initializeSettings();
    //         if (mainPage) mainPage.style.display = 'none';
    //     } else {
    //         document.title = 'MyApp';
    //     }
    // });

    // Connection status monitoring
    function updateConnectionStatus() {
        if (!navigator.onLine) {
            showOfflineNotification();
        } else {
            hideOfflineNotification();
        }
    }

    function showOfflineNotification() {
        // Remove existing notification
        const existing = document.getElementById('offline-notification');
        if (existing) existing.remove();

        const offlineNotification = document.createElement('div');
        offlineNotification.id = 'offline-notification';
        offlineNotification.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: #ff9800;
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                z-index: 10000;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: space-between;
                max-width: 400px;
                margin: 0 auto;
            ">
                <span>📡 You're offline - Some features may be limited</span>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    margin-left: 10px;
                ">&times;</button>
            </div>
        `;
        
        document.body.appendChild(offlineNotification);
    }

    function hideOfflineNotification() {
        const notification = document.getElementById('offline-notification');
        if (notification) {
            notification.remove();
        }
    }

    // Listen for connection changes
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);

    // Initial connection status check
    updateConnectionStatus();
});
