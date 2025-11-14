// Auth and Navigation State Management
let currentUser = null;

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const authModal = document.getElementById('authModal');
const closeModal = document.getElementById('closeModal');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const userName = document.getElementById('userName');
const protectedNav = document.getElementById('protectedNav');
const projectTabs = document.querySelectorAll('.project-tab');
const projectContents = document.querySelectorAll('.project-content');

// File download function
function downloadFile(filePath, fileName) {
    // Создаем скрытую ссылку для скачивания
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    link.style.display = 'none';
    
    // Добавляем ссылку в документ и кликаем по ней
    document.body.appendChild(link);
    link.click();
    
    // Удаляем ссылку после клика
    setTimeout(() => {
        document.body.removeChild(link);
    }, 100);
}

// Setup download links
function setupDownloadLinks() {
    const downloadLinks = document.querySelectorAll('.download-link');
    
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const filePath = this.getAttribute('data-file');
            const fileName = this.getAttribute('data-filename');
            
            if (filePath && fileName) {
                downloadFile(filePath, fileName);
            } else {
                console.error('File path or filename not found');
            }
        });
    });
}

// Проверка доступа к защищенным страницам
function checkPageAccess() {
    const currentPage = window.location.pathname.split('/').pop();
    const protectedPages = ['project.html', 'documents.html'];
    
    // Если текущая страница защищенная и пользователь не авторизован
    if (protectedPages.includes(currentPage) && !currentUser) {
        alert('Для доступа к этой странице необходимо авторизоваться');
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// Check if user is logged in (from localStorage)
function checkAuthStatus() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        showProtectedContent();
    }
    
    // Проверяем доступ к странице
    checkPageAccess();
}

// Обновление навигации в зависимости от авторизации
function updateNavigation() {
    const protectedLinks = document.querySelectorAll('a[href="project.html"], a[href="documents.html"]');
    const navLinks = document.querySelectorAll('.nav-link[href="project.html"], .nav-link[href="documents.html"]');
    
    if (!currentUser) {
        // Скрываем защищенные ссылки для неавторизованных
        protectedLinks.forEach(link => {
            link.style.display = 'none';
        });
        navLinks.forEach(link => {
            link.style.display = 'none';
        });
    } else {
        // Показываем защищенные ссылки для авторизованных
        protectedLinks.forEach(link => {
            link.style.display = 'block';
        });
        navLinks.forEach(link => {
            link.style.display = 'block';
        });
    }
}

// Show protected content after login
function showProtectedContent() {
    // Update UI for logged in user
    if (loginBtn) loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    if (userInfo) userInfo.style.display = 'flex';
    if (userName) userName.textContent = currentUser.name;
    
    // Show protected navigation if it exists on this page
    if (protectedNav) protectedNav.style.display = 'block';
    
    // Обновляем навигацию
    updateNavigation();
}

// Show public content after logout
function showPublicContent() {
    // Update UI for logged out user
    if (loginBtn) loginBtn.style.display = 'inline-block';
    if (registerBtn) registerBtn.style.display = 'inline-block';
    if (userInfo) userInfo.style.display = 'none';
    
    // Hide protected navigation if it exists on this page
    if (protectedNav) protectedNav.style.display = 'none';
    
    // Обновляем навигацию
    updateNavigation();
    
    // Проверяем доступ при выходе
    checkPageAccess();
}

// Open modal on login/register button click
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        authModal.style.display = 'flex';
        switchToLogin();
    });
}

if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        authModal.style.display = 'flex';
        switchToRegister();
    });
}

// Close modal
if (closeModal) {
    closeModal.addEventListener('click', () => {
        authModal.style.display = 'none';
    });
}

// Switch between login and register tabs
if (loginTab) {
    loginTab.addEventListener('click', switchToLogin);
}

if (registerTab) {
    registerTab.addEventListener('click', switchToRegister);
}

function switchToLogin() {
    if (loginTab && registerTab && loginForm && registerForm) {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    }
}

function switchToRegister() {
    if (loginTab && registerTab && loginForm && registerForm) {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

// Form submission - Login
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Simple validation
        if (email && password) {
            currentUser = {
                name: email.split('@')[0],
                email: email
            };
            
            // Save to localStorage
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update UI
            showProtectedContent();
            
            // Close modal
            authModal.style.display = 'none';
            
            // Show success message
            alert('Вы успешно вошли в систему!');
            
            // Redirect to project page if on main page
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                setTimeout(() => {
                    window.location.href = 'project.html';
                }, 1000);
            }
        } else {
            alert('Пожалуйста, заполните все поля');
        }
    });
}

// Form submission - Register
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Simple validation
        if (name && email && password && confirmPassword) {
            if (password !== confirmPassword) {
                alert('Пароли не совпадают');
                return;
            }
            
            currentUser = {
                name: name,
                email: email
            };
            
            // Save to localStorage
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update UI
            showProtectedContent();
            
            // Close modal
            authModal.style.display = 'none';
            
            // Show success message
            alert('Вы успешно зарегистрировались!');
            
            // Redirect to project page if on main page
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                setTimeout(() => {
                    window.location.href = 'project.html';
                }, 1000);
            }
        } else {
            alert('Пожалуйста, заполните все поля');
        }
    });
}

// Logout functionality
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showPublicContent();
        alert('Вы вышли из системы');
        
        // Redirect to main page if on protected pages
        if (window.location.pathname.endsWith('project.html') || window.location.pathname.endsWith('documents.html')) {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    });
}

// Project tabs click handlers
if (projectTabs.length > 0) {
    projectTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabId = e.target.dataset.tab;
            
            // Update active tab
            projectTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            // Show corresponding content
            projectContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}Content`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.style.display = 'none';
    }
});

// Service buttons functionality
document.addEventListener('DOMContentLoaded', function() {
    const serviceButtons = document.querySelectorAll('.service-btn');
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceTitle = this.closest('.service-card').querySelector('.service-title').textContent;
            alert(`Спасибо за интерес к услуге "${serviceTitle}"! Для записи свяжитесь с нами по телефону.`);
        });
    });
});

// Initialize charts
function initCharts() {
    // Age chart - only on project page
    const ageChartCanvas = document.getElementById('ageChart');
    if (ageChartCanvas) {
        const ageCtx = ageChartCanvas.getContext('2d');
        const ageChart = new Chart(ageCtx, {
            type: 'bar',
            data: {
                labels: ['18-25 лет', '26-35 лет', '36-45 лет', '45+ лет'],
                datasets: [{
                    label: 'Процент клиентов',
                    data: [35, 45, 15, 5],
                    backgroundColor: [
                        'rgba(255, 182, 193, 0.7)',
                        'rgba(255, 105, 180, 0.7)',
                        'rgba(255, 20, 147, 0.7)',
                        'rgba(199, 21, 133, 0.7)'
                    ],
                    borderColor: [
                        'rgba(255, 182, 193, 1)',
                        'rgba(255, 105, 180, 1)',
                        'rgba(255, 20, 147, 1)',
                        'rgba(199, 21, 133, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 50,
                        title: {
                            display: true,
                            text: 'Процент клиентов (%)'
                        }
                    }
                }
            }
        });
    }
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    initCharts();
    setupDownloadLinks();
    
    // Set active navigation link based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if ((currentPage === 'index.html' || currentPage === '') && linkHref === 'index.html') {
            link.classList.add('active');
        } else if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Set active protected navigation link
    const protectedNavLinks = document.querySelectorAll('.protected-nav-link');
    protectedNavLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
