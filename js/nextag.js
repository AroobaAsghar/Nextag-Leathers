
const backToTop = document.getElementById("backToTop");
const navToggler = document.querySelector(".custom-toggler");
const navMenu = document.getElementById("navbarSupportedContent");
const navOverlay = document.querySelector(".nav-overlay");

if (navToggler && navMenu && navOverlay) {
    const openMenu = () => {
        navMenu.classList.add("show");
        navOverlay.classList.add("is-open");
        navToggler.classList.add("is-open");
        navToggler.setAttribute("aria-expanded", "true");
        document.body.classList.add("nav-open");
    };

    const closeMenu = () => {
        navMenu.classList.remove("show");
        navOverlay.classList.remove("is-open");
        navToggler.classList.remove("is-open");
        navToggler.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
    };

    navToggler.addEventListener("click", (event) => {
        event.stopPropagation();

        if (navMenu.classList.contains("show")) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navOverlay.addEventListener("click", closeMenu);

    navMenu.querySelectorAll(".nav-link:not(.dropdown-toggle), .dropdown-item").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
        if (!navMenu.classList.contains("show")) {
            return;
        }

        const clickedInsideNavbar = event.target.closest(".navbar");

        if (!clickedInsideNavbar) {
            closeMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 992) {
            closeMenu();
        }
    });
}

if (backToTop) {

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

}

$(document).ready(function () {

    const $slider = $('.testimonial-slider');
    const $cards = $slider.find('.testimonial-card');

    if (!$cards.length) return;

    // We show ONE review at a time (fully responsive)
    let currentIndex = 0;

    function getCardWidth() {
        // Use the first visible card width; works with responsive min-width rules.
        const $first = $cards.eq(0);
        return $first.outerWidth(true) || $first.width() || 0;
    }

    function updateSlider() {
        const cardWidth = getCardWidth();
        if (!cardWidth) return;

        $slider.css('transform', `translateX(-${currentIndex * cardWidth}px)`);

        // Optional: keep focus/paint clean
        $cards.removeClass('is-active');
        $cards.eq(currentIndex).addClass('is-active');
    }

    function next() {
        if (currentIndex < $cards.length - 1) {
            currentIndex++;
            updateSlider();
        }
    }

    function prev() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    }

    $('.next').off('click.testimonials').on('click.testimonials', function () {
        next();
    });

    $('.prev').off('click.testimonials').on('click.testimonials', function () {
        prev();
    });

    // Initialize
    updateSlider();

    // Recalculate on resize for correct per-device widths
    let resizeTimer = null;
    $(window).on('resize.testimonials', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateSlider, 150);
    });

});

// SCOREBOARD: animate craft stats when #craft enters viewport, stop at exact target
(function () {
    const craftSection = document.getElementById('craft');
    if (!craftSection) return;

    function parseTarget(text) {
        const trimmed = (text || '').trim();
        // "50+" -> { value: 50, suffix: "+" }
        // "100%" -> { value: 100, suffix: "%" }
        // "12"   -> { value: 12, suffix: "" }
        const match = trimmed.match(/^(-?\d+(?:\.\d+)?)(.*)$/);
        if (!match) return { value: 0, suffix: trimmed };
        return { value: Number(match[1]), suffix: match[2] || '' };
    }

    function createCounter(el, { durationMs }) {
        const target = parseTarget(el.textContent);
        el.setAttribute('data-score-started', 'false');
        el.textContent = String(0) + target.suffix;

        let rafId = null;
        let startedAt = null;

        function step(ts) {
            if (!startedAt) startedAt = ts;
            const elapsed = ts - startedAt;

            const t = Math.min(1, elapsed / durationMs);
            const eased = t < 0.5
                ? 2 * t * t
                : 1 - Math.pow(-2 * t + 2, 2) / 2; // easeInOutQuad

            const current = Math.round(target.value * eased);
            el.textContent = String(current) + target.suffix;

            if (t < 1) {
                rafId = requestAnimationFrame(step);
            } else {
                el.textContent = String(target.value) + target.suffix;
                el.setAttribute('data-score-started', 'true');
            }
        }

        function start() {
            if (el.getAttribute('data-score-started') === 'true') return;
            if (rafId) cancelAnimationFrame(rafId);
            startedAt = null;
            rafId = requestAnimationFrame(step);
        }

        return { start };
    }

    // Targets: elements with the fs-2 class inside #craft
    const targets = Array.from(craftSection.querySelectorAll('.fs-2'));
    if (!targets.length) return;

    const counters = targets.map(el => createCounter(el, { durationMs: 1200 }));

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                // Start the counter(s) whose element is intersecting
                targets.forEach((el, idx) => {
                    if (entry.target === el) {
                        counters[idx].start();
                    }
                });
            });
        },
        { threshold: 0.35 }
    );

    targets.forEach(el => observer.observe(el));
})();

// var swiper = new Swiper(".mySwiper", {
//   slidesPerView: 3,
//   grid: {
//     rows: 2,
//   },
//   spaceBetween: 30,
//   pagination: {
//     el: ".swiper-pagination",
//     clickable: true,
//   },
// });


    // var swiper = new Swiper(".mySwiper", {
    //   slidesPerView: 3,
    //   grid: {
    //     rows: 2,
    //   },
    //   spaceBetween: 30,
    //   pagination: {
    //     el: ".swiper-pagination",
    //     clickable: true,
    //   },
    // });
 


