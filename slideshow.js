(function () {
    "use strict";

    function visibleCount() {
        return window.innerWidth <= 440 ? 1 : window.innerWidth <= 700 ? 2 : 3;
    }

    function initSlideshow(wrapper) {
        const slideshow = wrapper.querySelector(".slideshow");
        const track = wrapper.querySelector(".slideshow-track");
        if (!track) return;

        const cards = Array.from(track.querySelectorAll(".slide-card"));
        if (cards.length === 0) return;

        const dotsContainer = wrapper.querySelector(".slide-dots");
        const prevBtn = wrapper.querySelector(".slide-prev");
        const nextBtn = wrapper.querySelector(".slide-next");

        let activeIndex = 0;
        let dots = [];

        function maxIndex() {
            return Math.max(0, cards.length - visibleCount());
        }

        function buildDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = "";
            dots = [];
            const total = maxIndex() + 1;
            for (let i = 0; i < total; i++) {
                const d = document.createElement("button");
                d.className = "slide-dot";
                d.setAttribute("aria-label", "Go to slide " + (i + 1));
                d.addEventListener("click", function () { goTo(i); });
                dotsContainer.appendChild(d);
                dots.push(d);
            }
        }

        function goTo(index) {
            const safe = Math.max(0, Math.min(index, maxIndex()));
            activeIndex = safe;

            const gap = parseFloat(getComputedStyle(track).gap) || 16;
            const cardWidth = cards[0].offsetWidth + gap;
            track.style.transform = "translateX(-" + (safe * cardWidth) + "px)";

            cards.forEach(function (card, i) {
                const vc = visibleCount();
                card.classList.toggle("is-active", i >= safe && i < safe + vc);
            });

            dots.forEach(function (d, i) {
                d.classList.toggle("is-active", i === safe);
            });
        }

        buildDots();
        goTo(0);

        if (prevBtn) prevBtn.addEventListener("click", function () { goTo(activeIndex - 1); });
        if (nextBtn) nextBtn.addEventListener("click", function () { goTo(activeIndex + 1); });

        let autoTimer = setInterval(function () {
            goTo(activeIndex + 1 > maxIndex() ? 0 : activeIndex + 1);
        }, 5000);

        wrapper.addEventListener("mouseenter", function () { clearInterval(autoTimer); });
        wrapper.addEventListener("mouseleave", function () {
            autoTimer = setInterval(function () {
                goTo(activeIndex + 1 > maxIndex() ? 0 : activeIndex + 1);
            }, 5000);
        });

        window.addEventListener("resize", function () {
            buildDots();
            goTo(Math.min(activeIndex, maxIndex()));
        });
    }

    window.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".slideshow-wrapper").forEach(initSlideshow);
    });
})();
