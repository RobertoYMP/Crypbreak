// Función que maneja el registro de un nuevo usuario
async function handleRegister(event) {
    event.preventDefault();  // Evita que el formulario se envíe automáticamente
    
    // Obtiene los valores ingresados en los campos del formulario
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // Verifica que las contraseñas coincidan
    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');  // Muestra mensaje de error
        return;  // Detiene la ejecución si las contraseñas no coinciden
    }

    // Valida que la contraseña cumpla con los requisitos (puedes personalizarla)
    if (!validatePassword(password)) {
        showNotification('La contraseña no cumple con los requisitos', 'error');
        return;
    }

    // HASHEO DE LA CONTRASEÑA
    // Aquí es donde se genera el hash de la contraseña usando el algoritmo SHA3-256
    const hashedPassword = sha3_256(password);  // Se convierte la contraseña en su hash SHA3-256

    try {
        // Simula la creación de un código de verificación
        const verificationCode = Math.random().toString(36).slice(2, 8).toUpperCase();  // Genera un código aleatorio
        localStorage.setItem('pendingVerification', JSON.stringify({
            name,
            email,
            hashedPassword,  // Se guarda la contraseña hasheada
            verificationCode
        }));

        // Se genera un contenido de correo electrónico con el código de verificación
        const emailContent = generateEmailTemplate('verification', { code: verificationCode });
        console.log('Correo de verificación enviado:', emailContent);  // Aquí se simula el envío del correo
        
        // Muestra notificación al usuario
        showNotification('Registro exitoso. Por favor verifica tu correo electrónico.');
        showForm('verify-form');  // Muestra el formulario de verificación
    } catch (error) {
        showNotification('Error al registrar usuario', 'error');
        console.error('Error en el registro:', error);
    }
}

// Función que maneja el inicio de sesión del usuario
async function handleLogin(event) {
    event.preventDefault();  // Evita el envío del formulario
    
    // Obtiene los valores ingresados en el formulario de inicio de sesión
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // HASHEO DE LA CONTRASEÑA
    // Se genera un hash de la contraseña ingresada
    const hashedPassword = sha3_256(password);  // Aquí se genera el hash SHA3-256 de la contraseña

    try {
        await new Promise(resolve => setTimeout(resolve, 1000));  // Simula un pequeño retraso
        localStorage.setItem('user', JSON.stringify({ email, name: 'Usuario' }));  // Guarda los datos del usuario en localStorage
        showNotification('Inicio de sesión exitoso');
        
        // Después de un retraso de 1.5 segundos, redirige al dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';  // Redirige al dashboard
        }, 1500);
    } catch (error) {
        showNotification('Error al iniciar sesión', 'error');
        console.error('Error en el inicio de sesión:', error);
    }
}

// Función que maneja la verificación del código recibido por correo
function handleVerification(event) {
    event.preventDefault();  // Evita que el formulario se envíe automáticamente
    
    const verificationCode = document.getElementById('verification-code').value;  // Obtiene el código ingresado
    const storedData = JSON.parse(localStorage.getItem('pendingVerification'));  // Obtiene los datos almacenados (nombre, correo, contraseña hasheada, código)

    // Verifica si el código ingresado coincide con el que se generó
    if (verificationCode === storedData.verificationCode) {
        // Si el código es correcto, se elimina la verificación pendiente y se notifica al usuario
        localStorage.removeItem('pendingVerification');
        showNotification('Verificación exitosa. Ahora puedes iniciar sesión.');
        showForm('login-form');  // Muestra el formulario de inicio de sesión
    } else {
        // Si el código es incorrecto, muestra un mensaje de error
        showNotification('Código incorrecto. Inténtalo de nuevo.', 'error');
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    notification.className = `notification ${type} show`;  // Muestra la notificación con el tipo especificado (success o error)
    notificationText.textContent = message;  // Establece el texto de la notificación
    
    // La notificación desaparecerá después de 3 segundos
    setTimeout(() => {
        notification.className = 'notification';  // Oculta la notificación
    }, 3000);
}
function showForm(formId) {
    document.querySelectorAll('.form-container').forEach(form => {
        form.classList.add('hidden');
    });
    document.getElementById(formId).classList.remove('hidden');
}

function validatePassword(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*]/.test(password)
    };

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

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // UTILIZAMOS EL HASHEO SHA3_256 EN HEXADECIMAL
    const hashedPassword = sha3_256(password);
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        localStorage.setItem('user', JSON.stringify({ email, name: 'Usuario' }));
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
            <h3 style="text-align: center;">LAS CARTAS SECRETAS DE MARÍA ESTUARDO DURANTE SU CAUTIVERIO</h3>
            <p style="text-align: justify;">En el siglo XVI, María, Reina de Escocia, usó un cifrado de sustitución simple para comunicarse con sus aliados. Sin embargo, este fue descifrado por los criptoanalistas de Isabel I, revelando una conspiración contra la reina que llevó a la ejecución de María en 1587. Este caso ilustra los riesgos de los cifrados débiles.</p>
            <p style="text-align: justify;">Los análisis identificaron patrones femeninos en verbos y adjetivos, así como menciones frecuentes a su cautiverio y a Francis Walsingham, jefe de espías de Isabel I. El sistema era un reemplazo simple, donde símbolos representaban letras o palabras comunes.</p>
            <p style="text-align: justify;">Descifrar todas las posibilidades habría llevado siglos, por lo que se empleó un algoritmo enfocado en soluciones probables. Las cartas trataban temas como su comunicación secreta con Francia, propuestas de matrimonio entre Isabel y el duque de Anjou, y negociaciones sobre su liberación y retorno al trono junto a su hijo, Jacobo VI.</p>
            <p style="text-align: justify;">Estos documentos reflejan a una María atenta y activa en asuntos políticos de Escocia, Inglaterra y Francia, mostrando su habilidad como analista internacional. Su contenido será clave para futuros estudios históricos y de criptografía temprana.</p>

                    `
    },
    modern: {
        title: 'Criptografía Moderna',
        content: `
        <h3 style="text-align: center;">RSA (Rivest-Shamir-Adleman)</h3>
        <p style="text-align: justify;">El algoritmo RSA, desarrollado en 1977 por Rivest, Shamir y Adleman, introdujo la criptografía de clave pública basada en la factorización de números primos grandes, marcando el fin de los sistemas de clave simétrica y abriendo la puerta a internet seguro. Su concepto fue inspirado en trabajos previos del matemático británico Clifford Cocks, cuyo trabajo permaneció clasificado.</p>
        <p style="text-align: justify;">RSA utiliza la multiplicación de dos números primos grandes para generar una clave pública. La seguridad del sistema se basa en la dificultad de factorizar el semiprimo generado, lo que hace casi imposible descifrar el mensaje sin conocer los primos.</p>
        <p style="text-align: justify;">Este sistema es fundamental para la criptografía moderna y sigue siendo relevante, ya que la capacidad de cálculo actual sigue aumentando, permitiendo trabajar con números primos de mayor tamaño.</p>
                
        `
    },
    quantum: {
        title: 'Seguridad Cuántica',
        content: `
            <h3 style="text-align: center;">Computación Cuántica</h3>
            <p style="text-align: justify;">En 2019, Google alcanzó la supremacía cuántica con su computadora Sycamore, resolviendo un problema matemático en 200 segundos que habría tomado a la supercomputadora Summit 10,000 años. Este logro demostró cómo los sistemas cuánticos pueden superar exponencialmente a las computadoras clásicas en tareas específicas.</p>
            <p style="text-align: justify;">El término "supremacía cuántica" refiere a cuando una computadora cuántica supera a las clásicas en una tarea. Sin embargo, algunos cuestionaron el resultado, argumentando que Summit podría haber completado la tarea en 2.5 días con optimización.</p>
            <p style="text-align: justify;">Aunque el problema resuelto no tiene aplicaciones prácticas inmediatas, este avance impulsa el desarrollo de algoritmos cuánticos en áreas como la inteligencia artificial, la química y la criptografía, lo que presenta nuevos retos para la seguridad de los sistemas actuales.</p>

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
