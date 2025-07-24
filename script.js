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
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

// State
let count = 0;
let todos = [];

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

// Contact form functionality
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Simple validation
    if (!name || !email || !message) {
        showFormMessage('Please fill in all fields.', 'error');
        return;
    }
    
    // Simulate form submission
    showFormMessage('Sending message...', 'success');
    
    setTimeout(() => {
        showFormMessage('Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
    }, 1500);
});

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Hide message after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Show home section by default
    showSection('home');
    
    // Add smooth transitions
    document.body.style.transition = 'all 0.3s ease';
    
    console.log('Simple Web App initialized! 🚀');
});

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    // Subtle parallax effect on background
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    document.body.style.backgroundPosition = `${mouseX * 50}px ${mouseY * 50}px`;
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press numbers 1-3 to navigate between sections
    if (e.key >= '1' && e.key <= '3') {
        const sections = ['home', 'about', 'contact'];
        const sectionIndex = parseInt(e.key) - 1;
        showSection(sections[sectionIndex]);
    }
    
    // Press 'r' to reset counter
    if (e.key.toLowerCase() === 'r' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        count = 0;
        updateCounter();
    }
});
