document.addEventListener('DOMContentLoaded', function() {
    // --- Scroll Reveal Logic ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks?.classList.remove('active');
        });
    });

    // --- FAQ Toggle ---
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
    
    // --- Google Sheets Form Submission & Honeypot ---
    const form = document.querySelector('.contact-form') as HTMLFormElement;
    const submitBtn = form?.querySelector('button[type="submit"]') as HTMLButtonElement;
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwm4Jnj57udwdjI2eptT5moO2LFR1r9DgOHRcr5If7MOuPm5y0vlgBLiyc18mNi7EOatg/exec'; 

    if(form) {
        form.addEventListener('submit', e => {
            e.preventDefault(); 
            
            if (errorMessage) errorMessage.style.display = 'none';
            
            const honeypot = (form.querySelector('input[name="bot_check"]') as HTMLInputElement).value;
            if (honeypot) {
                showSuccess();
                return;
            }
            
            const originalBtnText = submitBtn.textContent || '';
            submitBtn.textContent = 'שולח...';
            submitBtn.disabled = true;

            fetch(scriptURL, { method: 'POST', body: new FormData(form)})
                .then(response => {
                    if (response.ok || response.status === 0) {
                        showSuccess();
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    if (errorMessage) errorMessage.style.display = 'block';
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }

    function showSuccess() {
        if (form) form.style.display = 'none';
        if (successMessage) successMessage.style.display = 'block';
    }
});
