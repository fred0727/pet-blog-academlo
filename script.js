// Interactividad para BlogMascotas - Landing Page
document.addEventListener('DOMContentLoaded', function () {
  
  // ===== SCROLL SUAVE PARA ENLACES DEL MENÚ =====
  const menuLinks = document.querySelectorAll('a[href^="#"]');
  
  menuLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      // Si es solo "#", scrollear al top
      if (targetId === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Calcular offset para header fijo
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Actualizar URL sin hacer scroll
        history.pushState(null, null, targetId);
      }
    });
  });

  // ===== EFECTO MOSTRAR/OCULTAR MÁS INFORMACIÓN =====
  const toggleButtons = document.querySelectorAll('.toggle-more');
  
  toggleButtons.forEach(button => {
    button.addEventListener('click', function () {
      const article = this.closest('.article');
      const moreContent = article.querySelector('.more');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      if (moreContent) {
        if (isExpanded) {
          // Ocultar contenido
          moreContent.classList.remove('open');
          this.setAttribute('aria-expanded', 'false');
          this.textContent = 'Más info';
          moreContent.setAttribute('aria-hidden', 'true');
        } else {
          // Mostrar contenido
          moreContent.classList.add('open');
          this.setAttribute('aria-expanded', 'true');
          this.textContent = 'Menos info';
          moreContent.setAttribute('aria-hidden', 'false');
        }
        
        // Efecto visual en el botón
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
      }
    });
  });

  // ===== ANIMACIÓN REVEAL ON SCROLL =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Desconectar después de animar para mejor performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar todos los elementos con clase 'reveal'
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => observer.observe(el));

  // ===== HEADER TRANSPARENTE CON SCROLL =====
  const header = document.querySelector('.header');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Cambiar opacidad del header basado en scroll
    if (currentScrollY > 100) {
      header.style.background = 'rgba(254, 247, 240, 0.98)';
      header.style.boxShadow = '0 2px 20px rgba(255, 181, 162, 0.15)';
    } else {
      header.style.background = 'rgba(254, 247, 240, 0.95)';
      header.style.boxShadow = '0 2px 8px rgba(255, 181, 162, 0.1)';
    }
    
    lastScrollY = currentScrollY;
  });

  // ===== ANIMACIÓN DE HOVER EN TARJETAS =====
  const articles = document.querySelectorAll('.article');
  
  articles.forEach(article => {
    article.addEventListener('mouseenter', function () {
      this.style.zIndex = '10';
    });
    
    article.addEventListener('mouseleave', function () {
      this.style.zIndex = '';
    });
  });

  // ===== MEJORAS DE ACCESIBILIDAD =====
  
  // Navegación por teclado para botones
  toggleButtons.forEach(button => {
    button.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Focus visible para mejor navegación por teclado
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', function () {
    document.body.classList.remove('keyboard-navigation');
  });

  console.log('🐾 BlogMascotas interactividad cargada correctamente!');
});

// ===== RESPETO A PREFERENCIAS DE MOVIMIENTO REDUCIDO =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Deshabilitar animaciones para usuarios que prefieren movimiento reducido
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.add('visible');
    el.style.transition = 'none';
  });
}

// ===== FILTRADO DE CATEGORÍAS DEL BLOG =====
document.addEventListener('DOMContentLoaded', function() {
  const categoryButtons = document.querySelectorAll('.category-btn');
  const articles = document.querySelectorAll('.article[data-category]');
  
  if (categoryButtons.length === 0) return;
  
  categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remover clase active de todos los botones
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      // Agregar clase active al botón clickeado
      this.classList.add('active');
      
      const category = this.getAttribute('data-category');
      
      articles.forEach(article => {
        if (category === 'todos' || article.getAttribute('data-category') === category) {
          article.style.display = 'block';
          // Animación de entrada
          article.style.opacity = '0';
          article.style.transform = 'translateY(20px)';
          setTimeout(() => {
            article.style.opacity = '1';
            article.style.transform = 'translateY(0)';
            article.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          }, 100);
        } else {
          article.style.display = 'none';
        }
      });
    });
  });
});

// ===== VALIDACIÓN DEL FORMULARIO =====
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  
  if (!form) return;
  
  // Validaciones en tiempo real
  const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
  
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    
    input.addEventListener('input', function() {
      clearError(this);
    });
  });
  
  // Función para validar campo individual
  function validateField(field) {
    const value = field.value.trim();
    const name = field.name;
    let isValid = true;
    let errorMessage = '';
    
    switch(name) {
      case 'nombre':
        if (!value) {
          errorMessage = 'El nombre es requerido';
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = 'El nombre debe tener al menos 2 caracteres';
          isValid = false;
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errorMessage = 'El email es requerido';
          isValid = false;
        } else if (!emailRegex.test(value)) {
          errorMessage = 'Por favor ingresa un email válido';
          isValid = false;
        }
        break;
        
      case 'telefono':
        const phoneRegex = /^[\d\s\-\+\(\)]{8,}$/;
        if (value && !phoneRegex.test(value)) {
          errorMessage = 'Por favor ingresa un teléfono válido';
          isValid = false;
        }
        break;
        
      case 'mensaje':
        if (!value) {
          errorMessage = 'El mensaje es requerido';
          isValid = false;
        } else if (value.length < 10) {
          errorMessage = 'El mensaje debe tener al menos 10 caracteres';
          isValid = false;
        }
        break;
    }
    
    showError(field, errorMessage);
    return isValid;
  }
  
  // Función para mostrar error
  function showError(field, message) {
    const errorElement = field.parentNode.querySelector('.form-error');
    if (errorElement) {
      errorElement.textContent = message;
      field.style.borderColor = message ? '#e53e3e' : '#e2e8f0';
    }
  }
  
  // Función para limpiar error
  function clearError(field) {
    const errorElement = field.parentNode.querySelector('.form-error');
    if (errorElement && errorElement.textContent) {
      errorElement.textContent = '';
      field.style.borderColor = '#e2e8f0';
    }
  }
  
  // Validación del checkbox de privacidad
  const privacyCheckbox = document.getElementById('privacidad');
  if (privacyCheckbox) {
    privacyCheckbox.addEventListener('change', function() {
      const errorElement = this.closest('.form-group').querySelector('.form-error');
      if (errorElement) {
        if (!this.checked) {
          errorElement.textContent = 'Debes aceptar la política de privacidad';
        } else {
          errorElement.textContent = '';
        }
      }
    });
  }
  
  // Manejo del envío del formulario
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validar todos los campos
    let isFormValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });
    
    // Validar checkbox de privacidad
    if (privacyCheckbox && !privacyCheckbox.checked) {
      const errorElement = privacyCheckbox.closest('.form-group').querySelector('.form-error');
      if (errorElement) {
        errorElement.textContent = 'Debes aceptar la política de privacidad';
      }
      isFormValid = false;
    }
    
    if (!isFormValid) {
      // Hacer scroll al primer error
      const firstError = form.querySelector('.form-error:not(:empty)');
      if (firstError) {
        firstError.closest('.form-group').scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      return;
    }
    
    // Simular envío del formulario
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';
    
    // Agregar spinner CSS si no existe
    if (!document.querySelector('.spinner-style')) {
      const style = document.createElement('style');
      style.className = 'spinner-style';
      style.textContent = `
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Simular tiempo de envío
    setTimeout(() => {
      // Mostrar mensaje de éxito
      showSuccessMessage();
      
      // Resetear formulario
      form.reset();
      
      // Restaurar botón
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Enviar Mensaje';
      
      // Limpiar todos los errores
      const errorElements = form.querySelectorAll('.form-error');
      errorElements.forEach(error => error.textContent = '');
      
      // Restaurar bordes
      inputs.forEach(input => input.style.borderColor = '#e2e8f0');
      
    }, 2000);
  });
  
  // Función para mostrar mensaje de éxito
  function showSuccessMessage() {
    // Remover mensaje previo si existe
    const existingSuccess = form.querySelector('.form-success');
    if (existingSuccess) {
      existingSuccess.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML = `
      <span class="success-icon">✅</span>
      <div>
        <strong>¡Mensaje enviado con éxito!</strong><br>
        Te contactaremos pronto.
      </div>
    `;
    
    form.appendChild(successDiv);
    
    // Scroll al mensaje de éxito
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remover mensaje después de 5 segundos
    setTimeout(() => {
      successDiv.remove();
    }, 5000);
  }
});