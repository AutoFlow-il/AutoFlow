document.addEventListener('DOMContentLoaded', function() {
    // ==========================================
    // 1. מנגנון בחירת שפה (Google Translate Fix)
    // ==========================================
    const langBtn = document.querySelector('.lang-btn');
    const langDropdown = document.querySelector('.lang-dropdown');
    const langLinks = document.querySelectorAll('.lang-dropdown a');

    if (langBtn && langDropdown) {
        // פתיחה וסגירה של תפריט השפות
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            langDropdown.classList.remove('show');
        });

        // לחיצה על שפה ספציפית
        langLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const langCode = link.getAttribute('data-lang'); // למשל 'en' או 'iw'
                
                // יצירת עוגייה עבור Google Translate
                const setTranslateCookie = (code) => {
                    const domain = window.location.hostname;
                    // אנחנו מגדירים את העוגייה בכל תצורה אפשרית כדי לוודא שגוגל קורא אותה
                    document.cookie = `googtrans=/he/${code}; path=/;`;
                    document.cookie = `googtrans=/he/${code}; path=/; domain=${domain};`;
                    document.cookie = `googtrans=/he/${code}; path=/; domain=.${domain};`;
                    
                    // ריענון הדף כדי שהתרגום יופעל אוטומטית
                    window.location.reload();
                };

                setTranslateCookie(langCode);
            });
        });
    }

    // סידור מיקום ההאדר במקרה שגוגל דוחף סרגל כלים
    const translateHeader = document.querySelector('.header');
    const observer = new MutationObserver(() => {
        const bodyTop = document.body.style.top;
        if (bodyTop && bodyTop !== '0px') {
            translateHeader.style.top = bodyTop;
        } else {
            translateHeader.style.top = '0px';
        }
    });
    if (translateHeader) {
        observer.observe(document.body, { attributes: true, attributeFilter:['style'] });
    }


    // ==========================================
    // 2. אנימציות חשיפה בגלילה (Scroll Reveal)
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
    // 3. אפקט סקרול להאדר (Header Scroll Effect)
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
    // 4. תפריט מובייל (Mobile Menu)
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
    // 5. שאלות ותשובות (FAQ Toggle)
    // ==========================================
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
    

    // ==========================================
    // 6. טופס יצירת קשר (Contact Form)
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
            
            // הגנת בוטים (Honeypot)
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
