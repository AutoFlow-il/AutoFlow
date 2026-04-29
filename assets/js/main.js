document.addEventListener('DOMContentLoaded', function() {
    // ==========================================
    // 1. אנימציות חשיפה בגלילה (Scroll Reveal)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================
    // 2. אפקט סקרול להאדר (Header Scroll Effect)
    // ==========================================
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 3. תפריט מובייל (Mobile Menu)
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if(navLinks) navLinks.classList.remove('active');
        });
    });

    // ==========================================
    // 4. שאלות ותשובות (FAQ Toggle)
    // ==========================================
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });

    // ==========================================
    // 5. טופס יצירת קשר (Contact Form)
    // ==========================================
    const form = document.querySelector('.contact-form');
    const submitBtn = form?.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzJtyePJdUy0teHrbFko7fm2eaZPAiwMCB7wyTT8fXZTfHmc60WvDdz2Y9yxvff0-cDHw/exec'; 

    if(form) {
        form.addEventListener('submit', e => {
            e.preventDefault(); 
            if (errorMessage) errorMessage.style.display = 'none';
            
            // הגנת בוטים
            const honeypot = form.querySelector('input[name="bot_check"]').value;
            if (honeypot) { showSuccess(); return; }
            
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'שולח...';
            submitBtn.disabled = true;
            
            fetch(scriptURL, { method: 'POST', body: new FormData(form)})
                .then(response => { showSuccess(); })
                .catch(error => {
                    if (errorMessage) errorMessage.style.display = 'block';
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }

    function showSuccess() {
        form.style.display = 'none';
        if (successMessage) successMessage.style.display = 'block';
    }
});
