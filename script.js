document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // --- Efekt powiększania kart usług (IntersectionObserver) ---
    const serviceCards = document.querySelectorAll('.service-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-card');
            } else {
                entry.target.classList.remove('active-card');
            }
        });
    }, { threshold: 0.75 }); // Karta musi być w 75% widoczna, aby efekt zadziałał

    serviceCards.forEach(card => cardObserver.observe(card));

    // --- Obsługa przycisku Udostępnij (Web Share API) ---
    const shareButtons = document.querySelectorAll('.btn-share');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: document.title,
                    text: 'Profesjonalne usługi koparkowe i roboty ziemne. Sprawdź ofertę!',
                    url: window.location.href
                }).catch(console.error);
            } else {
                alert('Twoja przeglądarka nie obsługuje funkcji udostępniania.');
            }
        });
    });

    // --- Efekt Przewijania Paska Nawigacji ---
    const topBar = document.querySelector('.top-bar');
    const stickyBtn = document.querySelector('.sticky-call-btn');
    const mapElement = document.querySelector('.map-wrapper'); // Element odniesienia (mapa)

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            topBar.classList.add('scrolled');
        } else {
            topBar.classList.remove('scrolled');
        }

        if (stickyBtn) {
            // Obliczamy próg dynamicznie: pozycja mapy minus wysokość okna (plus margines),
            // aby przycisk pojawił się, gdy mapa wjedzie na ekran. Domyślnie 1500px.
            const threshold = mapElement ? (mapElement.offsetTop - window.innerHeight + 200) : 1500;
            if (window.scrollY > threshold) {
                stickyBtn.classList.add('visible');
            } else {
                stickyBtn.classList.remove('visible');
            }
        }
    });



    // --- PWA: Obsługa Instalacji i Aktualizacji ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(reg => {
            
            // 1. Sprawdź, czy nowy SW już czeka (np. po odświeżeniu strony w tle)
            if (reg.waiting) {
                showUpdateBanner(reg.waiting);
            }

            // 2. Nasłuchuj na pojawienie się nowego SW
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    // Jeśli nowy SW został zainstalowany, ale jeszcze nie aktywny
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateBanner(newWorker);
                    }
                });
            });
        }).catch(err => console.log('SW Error:', err));
    }

    // Przeładowanie strony, gdy nowy SW przejmie kontrolę
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            window.location.reload();
            refreshing = true;
        }
    });

    let deferredPrompt;
    const installBtn = document.getElementById('install-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installBtn) installBtn.style.display = 'inline-block';
    });

    if (installBtn) {
        installBtn.addEventListener('click', () => {
            if (installBtn) installBtn.style.display = 'none';
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    deferredPrompt = null;
                });
            }
        });
    }

    // Funkcja pokazująca pasek aktualizacji
    function showUpdateBanner(worker) {
        const banner = document.getElementById('update-banner');
        const btn = document.getElementById('reload-btn');
        const closeBtn = document.getElementById('close-update-btn');

        if (banner && btn) {
            banner.classList.add('show');
            btn.onclick = () => {
                worker.postMessage({ type: 'SKIP_WAITING' });
            };
            if (closeBtn) {
                closeBtn.onclick = () => {
                    banner.classList.remove('show');
                };
            }
        }
    }
});
