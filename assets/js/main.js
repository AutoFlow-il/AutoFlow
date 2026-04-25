document.addEventListener('DOMContentLoaded', function() {
    // --- Custom Language Selector Logic ---
    const langBtn = document.querySelector('.lang-btn');
    const langDropdown = document.querySelector('.lang-dropdown');
    const langLinks = document.querySelectorAll('.lang-dropdown a');

    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            langDropdown.classList.remove('show');
        });

        langLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const langCode = link.getAttribute('data-lang');
                
                const triggerTranslate = () => {
                    let gtCombo = document.querySelector('.goog-te-combo');
                    if (gtCombo) {
                        gtCombo.value = langCode;
                        // Google Translate requires the event to bubble
                        gtCombo.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                    } else {
                        // Fallback: set cookie and reload if the combo box isn't found
                        document.cookie = `googtrans=/he/${langCode}; path=/`;
                        document.cookie = `googtrans=/he/${langCode}; domain=.${location.hostname}; path=/`;
                        window.location.reload();
                    }
                };

                // Try immediately, or wait a bit if Google Translate is still loading
                if (document.querySelector('.goog-te-combo')) {
                    triggerTranslate();
                } else {
                    setTimeout(triggerTranslate, 500);
                }
            });
        });
    }

    // --- Google Translate Header Fix ---
    // Moves the fixed header down when the Google Translate banner appears
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
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
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
            if(navLinks) navLinks.classList.remove('active');
        });
    });

    // --- FAQ Toggle ---
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });
    
    // --- Google Sheets Form Submission & Honeypot ---
    const form = document.querySelector('.contact-form');
    const submitBtn = form?.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzJtyePJdUy0teHrbFko7fm2eaZPAiwMCB7wyTT8fXZTfHmc60WvDdz2Y9yxvff0-cDHw/exec'; 

    if(form) {
        form.addEventListener('submit', e => {
            e.preventDefault(); 
            
            if (errorMessage) errorMessage.style.display = 'none';
            
            const honeypot = form.querySelector('input[name="bot_check"]').value;
            if (honeypot) {
                showSuccess();
                return;
            }
            
            const originalBtnText = submitBtn.textContent;
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
        form.style.display = 'none';
        if (successMessage) successMessage.style.display = 'block';
    }
});
