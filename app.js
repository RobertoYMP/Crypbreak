const API_URL = 'http://localhost:5000/api';

async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (!validatePassword(password)) {
        showNotification('La contraseña no cumple con los requisitos', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message);
        }
        
        showNotification(data.message);
        showForm('verify-form');
    } catch (error) {
        showNotification(error.message, 'error');
        console.error('Registration error:', error);
    }
}

// Reemplazar la función handleLogin
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message);
        }
        
        // Guardar token y datos del usuario
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showNotification('Inicio de sesión exitoso');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } catch (error) {
        showNotification(error.message, 'error');
        console.error('Login error:', error);
    }
}

// Reemplazar la función handleVerification
async function handleVerification(event) {
    event.preventDefault();
    
    const code = document.getElementById('verification-code').value;
    const email = document.getElementById('register-email').value;
    
    try {
        const response = await fetch(`${API_URL}/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                code
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message);
        }
        
        showNotification(data.message);
        setTimeout(() => {
            showForm('login-form');
        }, 1500);
    } catch (error) {
        showNotification(error.message, 'error');
        console.error('Verification error:', error);
    }
}


// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    notification.className = `notification ${type} show`;
    notificationText.textContent = message;
    
    setTimeout(() => {
        notification.className = 'notification';
    }, 3000);
}

function showForm(formId) {
    document.querySelectorAll('.form-container').forEach(form => {
        form.classList.add('hidden');
    });
    document.getElementById(formId).classList.remove('hidden');
}

// Password validation
function validatePassword(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*]/.test(password)
    };

    // Update UI for password requirements
    Object.keys(requirements).forEach(req => {
        const element = document.getElementById(req);
        if (element) {
            if (requirements[req]) {
                element.classList.add('valid');
            } else {
                element.classList.remove('valid');
            }
        }
    });

    return Object.values(requirements).every(Boolean);
}

// Authentication Handlers
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Hash the password using SHA3-256
    const hashedPassword = sha3_256(password);
    
    try {
        // Simulate API call - In production, replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Store user session
        localStorage.setItem('user', JSON.stringify({ email, name: 'Usuario Demo' }));
        
        showNotification('Inicio de sesión exitoso');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } catch (error) {
        showNotification('Error al iniciar sesión', 'error');
        console.error('Login error:', error);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (!validatePassword(password)) {
        showNotification('La contraseña no cumple con los requisitos', 'error');
        return;
    }
    
    // Hash the password using SHA3-256
    const hashedPassword = sha3_256(password);
    
    try {
        // Simulate sending verification email
        const verificationCode = Math.random().toString(36).slice(2, 8).toUpperCase();
        localStorage.setItem('pendingVerification', JSON.stringify({
            name,
            email,
            hashedPassword,
            verificationCode
        }));
        
        // Send verification email
        const emailContent = generateEmailTemplate('verification', { code: verificationCode });
        console.log('Verification email sent:', emailContent);
        
        showNotification('Registro exitoso. Por favor verifica tu correo electrónico.');
        showForm('verify-form');
    } catch (error) {
        showNotification('Error al registrar usuario', 'error');
        console.error('Registration error:', error);
    }
}

async function handleResetRequest(event) {
    event.preventDefault();
    
    const email = document.getElementById('reset-email').value;
    
    try {
        // Generate reset token and link
        const resetToken = Math.random().toString(36).slice(2);
        const resetLink = `${window.location.origin}/reset-password.html?token=${resetToken}`;
        
        // Send reset email
        const emailContent = generateEmailTemplate('resetPassword', { resetLink });
        console.log('Reset email sent:', emailContent);
        
        showNotification('Se han enviado las instrucciones a tu correo electrónico');
        setTimeout(() => {
            showForm('login-form');
        }, 1500);
    } catch (error) {
        showNotification('Error al procesar la solicitud', 'error');
        console.error('Reset request error:', error);
    }
}

async function handleVerification(event) {
    event.preventDefault();
    
    const code = document.getElementById('verification-code').value;
    const pendingUser = JSON.parse(localStorage.getItem('pendingVerification'));
    
    if (!pendingUser || pendingUser.verificationCode !== code) {
        showNotification('Código de verificación inválido', 'error');
        return;
    }
    
    try {
        // In production, send verification to server
        console.log('User verified:', {
            name: pendingUser.name,
            email: pendingUser.email,
            hashedPassword: pendingUser.hashedPassword
        });
        
        localStorage.removeItem('pendingVerification');
        showNotification('Correo verificado exitosamente');
        
        setTimeout(() => {
            showForm('login-form');
        }, 1500);
    } catch (error) {
        showNotification('Error en la verificación', 'error');
        console.error('Verification error:', error);
    }
}

// Dashboard Functions
const cryptoFacts = {
    classic: {
        title: 'Criptografía Clásica',
        content: `
            <h3>El Cifrado César</h3>
            <p>El cifrado César, nombrado en honor a Julio César, es uno de los métodos de cifrado más simples y ampliamente conocidos. César usaba este método para comunicarse con sus generales durante las campañas militares.</p>
            
            <h3>La Máquina Enigma</h3>
            <p>Durante la Segunda Guerra Mundial, la máquina Enigma fue utilizada por las fuerzas alemanas para cifrar sus comunicaciones. Su descifrado por los Aliados fue un factor crucial en el desarrollo de la guerra.</p>
            
            <h3>El Disco de Cifrado</h3>
            <p>También conocido como cifrado de Alberti, fue el primer sistema de cifrado polialfabético conocido en la historia de la criptografía occidental.</p>
        `
    },
    modern: {
        title: 'Criptografía Moderna',
        content: `
            <h3>RSA (Rivest-Shamir-Adleman)</h3>
            <p>RSA es uno de los primeros sistemas criptográficos de clave pública y es ampliamente utilizado para la transmisión segura de datos. Fue publicado en 1977 por Ron Rivest, Adi Shamir y Leonard Adleman.</p>
            
            <h3>AES (Advanced Encryption Standard)</h3>
            <p>AES es uno de los algoritmos más populares usados en criptografía simétrica. Fue establecido como estándar por el Instituto Nacional de Estándares y Tecnología (NIST) en 2001.</p>
            
            <h3>Criptografía de Curva Elíptica</h3>
            <p>Este tipo de criptografía ofrece el mismo nivel de seguridad que RSA pero con claves más cortas, lo que la hace más eficiente en términos de recursos computacionales.</p>
        `
    },
    quantum: {
        title: 'Seguridad Cuántica',
        content: `
            <h3>Computación Cuántica</h3>
            <p>Las computadoras cuánticas podrían romper muchos de los sistemas criptográficos actuales, lo que ha llevado al desarrollo de la criptografía post-cuántica.</p>
            
            <h3>Criptografía Cuántica</h3>
            <p>La distribución de claves cuánticas (QKD) permite a dos partes producir una clave secreta compartida que puede ser usada para cifrar y descifrar mensajes.</p>
            
            <h3>Algoritmos Post-Cuánticos</h3>
            <p>Se están desarrollando nuevos algoritmos que serían resistentes incluso a ataques de computadoras cuánticas, como los basados en retículos y códigos.</p>
        `
    }
};

function showFactDetails(factType) {
    const modal = document.getElementById('fact-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    const fact = cryptoFacts[factType];
    modalTitle.textContent = fact.title;
    modalContent.innerHTML = fact.content;
    
    modal.style.display = 'block';
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
    
    // Close modal when clicking X
    document.querySelector('.close-modal').onclick = function() {
        modal.style.display = 'none';
    }
}

function generatePDF() {
    const title = document.getElementById('modal-title').textContent;
    const content = document.getElementById('modal-content').innerHTML;
    
    // In production, use a proper PDF library
    console.log('Generating PDF for:', title);
    showNotification('PDF generado exitosamente');
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Email Templates
function generateEmailTemplate(type, data) {
    const templates = {
        verification: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <img src="logo.jpg" alt="Crypbreak Logo" style="width: 100px;">
                <h1 style="color: #2563eb;">Crypbreak</h1>
                <p style="color: #64748b;"> El rompecabezas que nadie quiere resolver/p>
                <h2>Verificación de Correo Electrónico</h2>
                <p>Tu código de verificación es: <strong>${data.code}</strong></p>
                <p>Este código expirará en 30 minutos.</p>
            </div>
        `,
        resetPassword: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <img src="logo.jpg" alt="Crypbreak Logo" style="width: 100px;">
                <h1 style="color: #2563eb;">Crypbreak</h1>
                <p style="color: #64748b;">El rompecabezas que nadie quiere resolver</p>
                <h2>Restablecimiento de Contraseña</h2>
                <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
                <a href="${data.resetLink}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Restablecer Contraseña
                </a>
                <p>Este enlace expirará en 1 hora.</p>
            </div>
        `
    };
    
    return templates[type];
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize password validation if on register page
    const passwordInput = document.getElementById('register-password');
    if (passwordInput) {
        validatePassword(passwordInput.value);
        passwordInput.addEventListener('input', (e) => validatePassword(e.target.value));
    }
    
    // Initialize user data if on dashboard
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            window.location.href = 'index.html';
        } else {
            userNameElement.textContent = user.name;
        }
    }
});
