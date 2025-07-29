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

        // File editor functionality
        initializeFileEditor();
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

    // File Editor functionality
    function initializeFileEditor() {
        const openFileBtn = document.getElementById('open-file-btn');
        const saveFileBtn = document.getElementById('save-file-btn');
        const newFileBtn = document.getElementById('new-file-btn');
        const fileNameSpan = document.getElementById('file-name');
        const fileContent = document.getElementById('file-content');
        const languageSelect = document.getElementById('editor-language-select');
        const lineCount = document.getElementById('line-count');
        const charCount = document.getElementById('char-count');

        let currentFileHandle = null;
        let hasUnsavedChanges = false;

        // Update stats
        function updateEditorStats() {
            const content = fileContent.value;
            const lines = content.split('\n').length;
            const chars = content.length;
            
            lineCount.textContent = lines;
            charCount.textContent = chars;
        }

        // Update language based on file extension
        function updateLanguageFromFileName(fileName) {
            const extension = fileName.split('.').pop().toLowerCase();
            const languageMap = {
                'js': 'javascript',
                'html': 'html',
                'css': 'css',
                'json': 'json',
                'txt': 'text'
            };
            
            if (languageMap[extension]) {
                languageSelect.value = languageMap[extension];
            }
        }

        // File operations
        async function openFile() {
            try {
                if (!window.showOpenFilePicker) {
                    // Fallback for browsers that don't support File System Access API
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.txt,.html,.css,.js,.json,.md';
                    input.onchange = (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                fileContent.value = e.target.result;
                                fileNameSpan.textContent = file.name;
                                updateLanguageFromFileName(file.name);
                                updateEditorStats();
                                saveFileBtn.disabled = true;
                            };
                            reader.readAsText(file);
                        }
                    };
                    input.click();
                    return;
                }

                const [fileHandle] = await window.showOpenFilePicker({
                    types: [
                        {
                            description: 'Text files',
                            accept: {
                                'text/*': ['.txt', '.html', '.css', '.js', '.json', '.md']
                            }
                        }
                    ]
                });

                const file = await fileHandle.getFile();
                const content = await file.text();
                
                fileContent.value = content;
                fileNameSpan.textContent = file.name;
                currentFileHandle = fileHandle;
                saveFileBtn.disabled = false;
                hasUnsavedChanges = false;
                
                updateLanguageFromFileName(file.name);
                updateEditorStats();
            } catch (err) {
                if (err.name !== 'AbortError') {
                    alert('Error opening file: ' + err.message);
                }
            }
        }

        async function saveFile() {
            if (!currentFileHandle) {
                return saveAsFile();
            }

            try {
                const writable = await currentFileHandle.createWritable();
                await writable.write(fileContent.value);
                await writable.close();
                hasUnsavedChanges = false;
                alert('File saved successfully!');
            } catch (err) {
                alert('Error saving file: ' + err.message);
            }
        }

        async function saveAsFile() {
            try {
                if (!window.showSaveFilePicker) {
                    // Fallback: download file
                    const blob = new Blob([fileContent.value], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileNameSpan.textContent;
                    a.click();
                    URL.revokeObjectURL(url);
                    return;
                }

                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: fileNameSpan.textContent,
                    types: [
                        {
                            description: 'Text files',
                            accept: {
                                'text/*': ['.txt', '.html', '.css', '.js', '.json', '.md']
                            }
                        }
                    ]
                });

                const writable = await fileHandle.createWritable();
                await writable.write(fileContent.value);
                await writable.close();
                
                currentFileHandle = fileHandle;
                fileNameSpan.textContent = (await fileHandle.getFile()).name;
                hasUnsavedChanges = false;
                saveFileBtn.disabled = false;
                alert('File saved successfully!');
            } catch (err) {
                if (err.name !== 'AbortError') {
                    alert('Error saving file: ' + err.message);
                }
            }
        }

        function newFile() {
            if (hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to create a new file?')) {
                return;
            }
            
            fileContent.value = '';
            fileNameSpan.textContent = 'untitled.txt';
            languageSelect.value = 'text';
            currentFileHandle = null;
            hasUnsavedChanges = false;
            saveFileBtn.disabled = true;
            updateEditorStats();
        }

        // Event listeners
        openFileBtn.addEventListener('click', openFile);
        saveFileBtn.addEventListener('click', saveFile);
        newFileBtn.addEventListener('click', newFile);
        
        fileContent.addEventListener('input', () => {
            hasUnsavedChanges = true;
            updateEditorStats();
        });

        languageSelect.addEventListener('change', () => {
            const language = languageSelect.value;
            const extensions = {
                'javascript': 'js',
                'html': 'html',
                'css': 'css',
                'json': 'json',
                'text': 'txt'
            };
            
            if (extensions[language] && fileNameSpan.textContent === 'untitled.txt') {
                fileNameSpan.textContent = `untitled.${extensions[language]}`;
            }
        });

        // Initial setup
        updateEditorStats();
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
    
    if (modalParam === 'dashboard') {
        dashboardModal.classList.add('active');
        initializeDashboard();
    } else if (modalParam === 'settings') {
        settingsModal.classList.add('active');
        initializeSettings();
    }

    // Override existing modal event listeners to include URL updates
    dashboardBtn.removeEventListener('click', dashboardBtn.onclick);
    settingsBtn.removeEventListener('click', settingsBtn.onclick);

    dashboardBtn.addEventListener('click', () => {
        dashboardModal.classList.add('active');
        initializeDashboard();
        updateURL('dashboard');
    });

    settingsBtn.addEventListener('click', () => {
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
        
        // Open the appropriate modal based on URL
        if (modalParam === 'dashboard') {
            dashboardModal.classList.add('active');
            initializeDashboard();
        } else if (modalParam === 'settings') {
            settingsModal.classList.add('active');
            initializeSettings();
        }
    });
});
