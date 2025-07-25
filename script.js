// DOM elements
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('nav a');
const counter = document.getElementById('counter');
const incrementBtn = document.getElementById('increment-btn');
const decrementBtn = document.getElementById('decrement-btn');
const resetBtn = document.getElementById('reset-btn');
const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo-btn');
const todoList = document.getElementById('todo-list');

// File editor elements
const openFileBtn = document.getElementById('open-file-btn');
const saveFileBtn = document.getElementById('save-file-btn');
const newFileBtn = document.getElementById('new-file-btn');
const fileNameSpan = document.getElementById('file-name');
const fileContent = document.getElementById('file-content');
const languageSelect = document.getElementById('language-select');
const lineCount = document.getElementById('line-count');
const charCount = document.getElementById('char-count');

// State
let count = 0;
let todos = [];
let currentFileHandle = null;
let hasUnsavedChanges = false;

// Navigation functionality
function showSection(targetId) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Set up navigation event listeners
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        showSection(targetId);
        
        // Update active nav link
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
    });
});

// File Management Functions
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
                        saveFileBtn.disabled = true; // Can't save with fallback method
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
        
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Error opening file:', error);
            alert('Error opening file. Please try again.');
        }
    }
}

async function saveFile() {
    if (!currentFileHandle) {
        await saveAsNewFile();
        return;
    }

    try {
        const writable = await currentFileHandle.createWritable();
        await writable.write(fileContent.value);
        await writable.close();
        
        hasUnsavedChanges = false;
        updateFileNameDisplay();
        
    } catch (error) {
        console.error('Error saving file:', error);
        alert('Error saving file. Please try again.');
    }
}

async function saveAsNewFile() {
    try {
        if (!window.showSaveFilePicker) {
            // Fallback for browsers that don't support File System Access API
            const blob = new Blob([fileContent.value], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'untitled.txt';
            a.click();
            URL.revokeObjectURL(url);
            return;
        }

        const fileHandle = await window.showSaveFilePicker({
            suggestedName: 'untitled.txt',
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
        fileNameSpan.textContent = fileHandle.name;
        saveFileBtn.disabled = false;
        hasUnsavedChanges = false;
        updateFileNameDisplay();
        
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error('Error saving file:', error);
            alert('Error saving file. Please try again.');
        }
    }
}

function newFile() {
    if (hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to create a new file?')) {
        return;
    }
    
    fileContent.value = '';
    fileNameSpan.textContent = 'New File';
    currentFileHandle = null;
    saveFileBtn.disabled = true;
    hasUnsavedChanges = false;
    languageSelect.value = 'text';
    updateEditorStats();
}

function updateLanguageFromFileName(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    const languageMap = {
        'html': 'html',
        'css': 'css',
        'js': 'javascript',
        'json': 'json',
        'md': 'markdown',
        'txt': 'text'
    };
    
    languageSelect.value = languageMap[extension] || 'text';
}

function updateEditorStats() {
    const content = fileContent.value;
    const lines = content.split('\n').length;
    const characters = content.length;
    
    lineCount.textContent = lines;
    charCount.textContent = characters;
}

function updateFileNameDisplay() {
    const name = currentFileHandle ? currentFileHandle.name : fileNameSpan.textContent;
    fileNameSpan.textContent = hasUnsavedChanges ? `${name} *` : name;
}

// File editor event listeners
openFileBtn.addEventListener('click', openFile);
saveFileBtn.addEventListener('click', saveFile);
newFileBtn.addEventListener('click', newFile);

fileContent.addEventListener('input', () => {
    hasUnsavedChanges = true;
    updateFileNameDisplay();
    updateEditorStats();
});

// Keyboard shortcuts for file operations
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'o':
                e.preventDefault();
                openFile();
                break;
            case 's':
                e.preventDefault();
                if (e.shiftKey) {
                    saveAsNewFile();
                } else {
                    saveFile();
                }
                break;
            case 'n':
                e.preventDefault();
                newFile();
                break;
        }
    }
});

// Counter functionality
function updateCounter() {
    counter.textContent = count;
    
    // Add animation effect
    counter.style.transform = 'scale(1.2)';
    setTimeout(() => {
        counter.style.transform = 'scale(1)';
    }, 150);
}

incrementBtn.addEventListener('click', () => {
    count++;
    updateCounter();
});

decrementBtn.addEventListener('click', () => {
    count--;
    updateCounter();
});

resetBtn.addEventListener('click', () => {
    count = 0;
    updateCounter();
});

// Todo functionality
function createTodoElement(todo, index) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
        <span>${todo.text}</span>
        <div>
            <button onclick="toggleTodo(${index})">${todo.completed ? 'Undo' : 'Done'}</button>
            <button onclick="deleteTodo(${index})">Delete</button>
        </div>
    `;
    
    return li;
}

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const todoElement = createTodoElement(todo, index);
        todoList.appendChild(todoElement);
    });
}

function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;
    
    todos.push({
        text: text,
        completed: false
    });
    
    todoInput.value = '';
    renderTodos();
    
    // Add animation to new todo
    const newTodo = todoList.lastElementChild;
    newTodo.style.opacity = '0';
    newTodo.style.transform = 'translateX(-20px)';
    setTimeout(() => {
        newTodo.style.transition = 'all 0.3s ease';
        newTodo.style.opacity = '1';
        newTodo.style.transform = 'translateX(0)';
    }, 10);
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    renderTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    renderTodos();
}

// Make functions global for onclick handlers
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;

addTodoBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Show home section by default
    showSection('home');
    
    // Initialize file editor stats
    updateEditorStats();
    
    console.log('Simple Web App with File Editor initialized! 🚀');
});

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    // Subtle parallax effect on background
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    document.body.style.backgroundPosition = `${mouseX * 50}px ${mouseY * 50}px`;
});

// Enhanced keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press numbers 1-4 to navigate between sections
    if (e.key >= '1' && e.key <= '4') {
        const sections = ['home', 'file-editor', 'tools', 'about'];
        const sectionIndex = parseInt(e.key) - 1;
        showSection(sections[sectionIndex]);
    }
    
    // Press 'r' to reset counter (only when not in input fields)
    if (e.key.toLowerCase() === 'r' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        count = 0;
        updateCounter();
    }
});
