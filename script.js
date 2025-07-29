// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const dashboardBtn = document.getElementById('dashboard-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const dashboardModal = document.getElementById('dashboard-modal');
    const settingsModal = document.getElementById('settings-modal');
    const closeBtns = document.querySelectorAll('.close-btn');

    // Open modals
    dashboardBtn.addEventListener('click', () => {
        dashboardModal.classList.add('active');
        initializeDashboard();
    });

    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
        initializeSettings();
    });

    // Close modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalId = e.target.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });

    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModals = document.querySelectorAll('.modal.active');
            if (activeModals.length > 0) {
                activeModals.forEach(modal => {
                    modal.classList.remove('active');
                });
                updateURL(null);
            }
        }
    });

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

        // Todo functionality
        const todoInput = document.getElementById('todo-input');
        const addTodoBtn = document.getElementById('add-todo-btn');
        const todoList = document.getElementById('todo-list');
        
        let todos = JSON.parse(localStorage.getItem('todos') || '[]');
        
        function renderTodos() {
            todoList.innerHTML = '';
            todos.forEach((todo, index) => {
                const li = document.createElement('li');
                li.className = 'todo-item';
                li.innerHTML = `
                    <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
                    <div class="todo-actions">
                        <button class="btn-toggle ${todo.completed ? 'btn-undo' : 'btn-complete'}" onclick="toggleTodo(${index})">
                            ${todo.completed ? 'Undo' : 'Done'}
                        </button>
                        <button class="btn-delete" onclick="deleteTodo(${index})">Delete</button>
                    </div>
                `;
                todoList.appendChild(li);
            });
        }

        window.toggleTodo = function(index) {
            todos[index].completed = !todos[index].completed;
            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodos();
        };

        window.deleteTodo = function(index) {
            todos.splice(index, 1);
            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodos();
        };

        function addTodo() {
            const text = todoInput.value.trim();
            if (text) {
                todos.push({ text, completed: false });
                localStorage.setItem('todos', JSON.stringify(todos));
                todoInput.value = '';
                renderTodos();
            }
        }

        addTodoBtn.addEventListener('click', addTodo);
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTodo();
            }
        });

        renderTodos();
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

    // Check URL parameters and open modal if specified
    const urlParams = new URLSearchParams(window.location.search);
    const modalParam = urlParams.get('modal');
    
    // Set window title and theme based on the modal parameter
    if (modalParam === 'dashboard') {
        document.title = 'Dashboard - MyApp';
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#6b7280');
        dashboardModal.classList.add('active');
        initializeDashboard();
        
        // Hide main page when opened directly via shortcut
        const mainPage = document.getElementById('main-page');
        if (mainPage) {
            mainPage.style.display = 'none';
        }
    } else if (modalParam === 'settings') {
        document.title = 'Settings - MyApp';
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#8b4513');
        settingsModal.classList.add('active');
        initializeSettings();
        
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

    dashboardBtn.addEventListener('click', () => {
        document.title = 'Dashboard - MyApp';
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#2196f3');
        dashboardModal.classList.add('active');
        initializeDashboard();
        updateURL('dashboard');
    });

    settingsBtn.addEventListener('click', () => {
        document.title = 'Settings - MyApp';
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#4caf50');
        settingsModal.classList.add('active');
        initializeSettings();
        updateURL('settings');
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
                document.querySelector('meta[name="theme-color"]').setAttribute('content', '#2196f3');
                
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
    const originalWindowHandler = window.onclick;
    window.removeEventListener('click', originalWindowHandler);
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
            document.title = 'MyApp';
            document.querySelector('meta[name="theme-color"]').setAttribute('content', '#2196f3');
            
            // Show main page
            const mainPage = document.getElementById('main-page');
            if (mainPage) {
                mainPage.style.display = 'flex';
            }
            
            updateURL(null);
        }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const modalParam = urlParams.get('modal');
        
        // Close all modals first
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        
        // Show main page
        const mainPage = document.getElementById('main-page');
        if (mainPage) {
            mainPage.style.display = 'flex';
        }
        
        // Open the appropriate modal based on URL and set window properties
        if (modalParam === 'dashboard') {
            document.title = 'Dashboard - MyApp';
            dashboardModal.classList.add('active');
            initializeDashboard();
            if (mainPage) mainPage.style.display = 'none';
        } else if (modalParam === 'settings') {
            document.title = 'Settings - MyApp';
            settingsModal.classList.add('active');
            initializeSettings();
            if (mainPage) mainPage.style.display = 'none';
        } else {
            document.title = 'MyApp';
        }
    });
});
