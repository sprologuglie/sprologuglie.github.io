document.addEventListener('DOMContentLoaded', () => {

    
    
    // =========================================================
    // 0. ACCESSIBILITÀ: GESTIONE FOCUS (Tab vs Mouse)
    // =========================================================
    
    // Variabile per tracciare se l'utente usa il mouse
    let usingMouse = false;

    // Aggiunge la classe 'mouse-user' al body al primo movimento del mouse
    document.addEventListener('mousemove', () => {
        if (!usingMouse) {
            document.body.classList.add('mouse-user');
            usingMouse = true;
        }
    });

    // Rimuove la classe 'mouse-user' quando l'utente preme Tab per navigare
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.remove('mouse-user');
            usingMouse = false;
        }
    });
    

    // =========================================================
    // 1. SCROLL REVEAL ANIMATION
    // =========================================================
    // ... (Il tuo codice 1. SCROLL REVEAL ANIMATION) ...
    const revealElements = document.querySelectorAll('.reveal-item');
    const observerOptions = {
        root: null,
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });
    
    // =========================================================
    // 2. SMOOTH DETAILS TOGGLE ANIMATION
    // =========================================================
    // ... (Il tuo codice 2. SMOOTH DETAILS TOGGLE ANIMATION) ...
    const details = document.querySelectorAll('.toggle-container');

    details.forEach(detail => {
        detail.addEventListener('toggle', (event) => {
            const content = detail.querySelector('.toggle-text');

            if (detail.open) {
                content.style.height = content.scrollHeight + 'px';
            } else {
                content.style.height = '0';
            }
        });
    });

    // =========================================================
    // 3. MENU OFF-CANVAS (Accessibile)
    // =========================================================

    const menu = document.getElementById('side-menu');
    const toggleBtn = document.getElementById('menu-toggle-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const body = document.body;
    
    // Elementi che possono ricevere il focus all'interno del menu
    const focusableElements = menu.querySelectorAll('a, button'); 
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    function toggleMenu(open) {
        if (open) {
            menu.classList.add('active');
            menu.removeAttribute('hidden');          // Rimuove 'hidden' per lo screen reader
            menu.setAttribute('aria-expanded', 'true'); // Stato: Aperto
            body.classList.add('menu-open');
            toggleBtn.setAttribute('aria-expanded', 'true');

            // Sposta il focus sul primo elemento del menu (il bottone di chiusura)
            closeBtn.focus();
            
        } else {
            menu.classList.remove('active');
            menu.setAttribute('hidden', '');          // Nasconde allo screen reader
            menu.setAttribute('aria-expanded', 'false'); // Stato: Chiuso
            body.classList.remove('menu-open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            
            // Ripristina il focus sul pulsante che ha aperto il menu
            toggleBtn.focus();
        }
    }
    
    // ... (3.1 - 3.3 Rimangono come prima, gestiscono il click) ...
    // 3.1. Apri il menu al click sul bottone
    if (toggleBtn && menu) {
        toggleBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleMenu(true);
        });
        
        // 3.2. Chiudi il menu con il bottone 'X'
        closeBtn.addEventListener('click', () => {
            toggleMenu(false);
        });

        // 3.3. Chiudi il menu quando si clicca su un link interno
        const menuLinks = menu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Piccolo ritardo per permettere al click di elaborare la navigazione
                setTimeout(() => toggleMenu(false), 50); 
            });
        });

        // 3.4. Gestione del Focus Trap (Loop di Tab)
        menu.addEventListener('keydown', (e) => {
            if (!menu.classList.contains('active')) return; // Solo se il menu è attivo

            const isTabPressed = (e.key === 'Tab' || e.keyCode === 9);

            if (!isTabPressed) {
                return;
            }

            // Se è SHIFT + TAB e il focus è sul primo elemento
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } 
            // Se è solo TAB e il focus è sull'ultimo elemento
            else { 
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        });

        // 3.5. Chiudi il menu al click su ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                toggleMenu(false);
            }
        });
        
        // 3.6. Chiudi il menu quando si clicca ovunque fuori
        document.addEventListener('click', (event) => {
            if (menu.classList.contains('active') && !menu.contains(event.target) && !toggleBtn.contains(event.target)) {
                toggleMenu(false);
            }
        });
    }

    // =========================================================
    // 4. POPUP PROMOZIONALE con Session Storage
    // =========================================================
    // Il blocco del popup va all'interno di DOMContentLoaded
    
    const popup = document.getElementById('promo-popup');
    // NOTA: Usa un nome diverso per closeBtn del popup per non sovrascrivere quello del menu
    const popupCloseBtn = document.querySelector('.popup-close-btn'); 
    const ctaBtn = document.querySelector('.popup-cta-btn');
    const hasSeenPopup = sessionStorage.getItem('therapyou_promo_session_seen');

    // Funzione per chiudere il popup
    function closePopup() {
        if(popup) { // Aggiunto un controllo di sicurezza per il popup
             popup.classList.remove('active');
        }
    }

    // 1. Controlla se mostrare il popup
    if (popup && !hasSeenPopup) {
        // 1.1 Mostra il popup dopo un piccolo ritardo (es. 1 secondo)
        setTimeout(() => {
            popup.classList.add('active');
            // 1.2 Solo ora registriamo che è stato visto in questa sessione
            sessionStorage.setItem('therapyou_promo_session_seen', 'true'); 
        }, 1000); 
    }

    // 2. Listener per chiudere il popup
    if (popup) { 
        // Usa la variabile rinominata: popupCloseBtn
        if (popupCloseBtn) popupCloseBtn.addEventListener('click', closePopup);
        if (ctaBtn) ctaBtn.addEventListener('click', closePopup);

        // Chiudi il popup cliccando sull'involucro esterno (l'ombra scura)
        popup.addEventListener('click', (event) => {
            if (event.target === popup) {
                closePopup();
            }
        });
    }

    // =========================================================
    // 5. GESTIONE SOTTO-MENU (Dropdown Verticale)
    // =========================================================




    // 1. Seleziona tutti i pulsanti di attivazione del sottomenù
    const submenuToggles = document.querySelectorAll('.submenu-toggle');

    submenuToggles.forEach(submenuToggle => {
        // 2. Per ogni pulsante, trova il sottomenù target utilizzando l'attributo aria-controls
        const submenuId = submenuToggle.getAttribute('aria-controls');
        // ASSICURATI DI AVER RINOMINATO GLI ID NEL TUO HTML COME CONSIGLIATO:
        // Esempio: "sub-servizi-pt", "sub-servizi-chin", ecc.
        const submenuContent = document.getElementById(submenuId);

        // 3. Applica la logica solo se entrambi gli elementi esistono
        if (submenuToggle && submenuContent) {

            // Inizializzazione: Assicurati che all'avvio, se è nascosto, l'altezza sia 0
            // Questo è cruciale se usi l'animazione basata sull'altezza.
            if (submenuContent.hidden) {
                submenuContent.style.height = '0';
                // Rimuovi l'attributo 'hidden' per consentire la transizione CSS/JS
                submenuContent.removeAttribute('hidden');
            }


            // Listener per il click sul pulsante
            submenuToggle.addEventListener('click', () => {
                const isExpanded = submenuToggle.getAttribute('aria-expanded') === 'true';

                // Toggle dello stato ARIA
                submenuToggle.setAttribute('aria-expanded', !isExpanded);

                if (!isExpanded) {
                    // --- APERTURA ---
                    // Imposta l'altezza sul valore scrollHeight per l'animazione di espansione
                    submenuContent.style.height = submenuContent.scrollHeight + 'px';
                    // Rende visibile il contenuto per gli screen reader (accessibilità)
                    submenuContent.hidden = false;

                } else {
                    // --- CHIUSURA ---
                    // 1. Forza l'altezza attuale (necessario per l'animazione di chiusura)
                    submenuContent.style.height = submenuContent.scrollHeight + 'px';
                    
                    // 2. Utilizza un timeout per applicare la transizione CSS a height: 0
                    setTimeout(() => {
                        submenuContent.style.height = '0';
                    }, 10);
                }
            });

            // Listener per la fine dell'animazione (transizione CSS)
            submenuContent.addEventListener('transitionend', (e) => {
                // Controlla se l'animazione è terminata su una proprietà specifica (e.g., 'height')
                if (e.propertyName === 'height') {
                    // Se il sottomenù è aperto
                    if (submenuToggle.getAttribute('aria-expanded') === 'true') {
                        // Rimuovi l'altezza fissa dopo l'apertura completa per gestire contenuti dinamici
                        submenuContent.style.height = 'auto';
                    } else {
                        // Se il sottomenù è chiuso (height: 0), nascondilo completamente
                        submenuContent.hidden = true;
                    }
                }
            });
        }
    });

 

    const cards = document.querySelectorAll(".google-style");

  cards.forEach(card => {
    const wrapper = card.querySelector(".recensione-text-wrapper");
    const text = card.querySelector(".recensione-text");
    const btn = card.querySelector(".leggi");

    // Misura altezza totale del testo
    const fullHeight = text.scrollHeight;

    // Altezza chiusa (3 righe circa)
    const collapsedHeight = wrapper.clientHeight;

    // Mostra pulsante solo se serve
    if (fullHeight <= collapsedHeight + 5) {
      btn.style.display = "none";
    }

    // Toggle apertura
    btn.addEventListener("click", () => {
      const expanded = wrapper.classList.toggle("expanded");
      wrapper.style.maxHeight = expanded ? fullHeight + "px" : collapsedHeight + "px";
      btn.textContent = expanded ? "Leggi di meno" : "Leggi di più";
    });
  });

// CHIUSURA FINALE CORRETTA dell'evento DOMContentLoaded
});