(function () {
    "use strict";

    /* ─────────────────────────────────────────
       1. WELCOME MESSAGE  (home.html only)
    ───────────────────────────────────────── */
    function initWelcome() {
        const banner = document.getElementById("welcome-banner");
        if (!banner) return;

        var stored = localStorage.getItem("visitorName");

        if (!stored) {
            var input = prompt("Welcome to Siganga Family Farm! What is your name?");
            if (input && input.trim() !== "") {
                stored = input.trim();
                localStorage.setItem("visitorName", stored);
            } else {
                stored = "Valued Guest";
            }
        }

        banner.textContent = "Welcome back, " + stored + "! Explore our fresh harvest below.";
        banner.style.display = "block";
    }

    /* ─────────────────────────────────────────
       2. FORM VALIDATION  (contact + premium)
    ───────────────────────────────────────── */
    function showError(input, message) {
        var existing = input.parentNode.querySelector(".field-error");
        if (existing) existing.remove();

        var err = document.createElement("span");
        err.className = "field-error";
        err.textContent = message;
        input.parentNode.appendChild(err);
        input.classList.add("input-error");
    }

    function clearError(input) {
        var existing = input.parentNode.querySelector(".field-error");
        if (existing) existing.remove();
        input.classList.remove("input-error");
    }

    function validateForm(form) {
        var fields = form.querySelectorAll("input, select, textarea");
        var valid = true;

        fields.forEach(function (field) {
            clearError(field);

            if (field.type === "submit" || field.type === "button") return;

            var value = field.value.trim();

            if (field.hasAttribute("required") && value === "") {
                showError(field, "This field is required.");
                valid = false;
                return;
            }

            if (field.type === "email" && value !== "") {
                var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(value)) {
                    showError(field, "Please enter a valid email address.");
                    valid = false;
                }
            }

            if (field.tagName === "SELECT" && field.hasAttribute("required") && value === "") {
                showError(field, "Please select an option.");
                valid = false;
            }
        });

        return valid;
    }

    function initFormValidation() {
        var forms = document.querySelectorAll("form");
        forms.forEach(function (form) {
            form.setAttribute("novalidate", true);

            form.addEventListener("submit", function (e) {
                e.preventDefault();
                if (validateForm(form)) {
                    showFormSuccess(form);
                }
            });

            form.querySelectorAll("input, select, textarea").forEach(function (field) {
                field.addEventListener("input", function () { clearError(field); });
                field.addEventListener("change", function () { clearError(field); });
            });
        });
    }

    function showFormSuccess(form) {
        var existing = form.querySelector(".form-success");
        if (existing) existing.remove();

        var msg = document.createElement("div");
        msg.className = "form-success";
        msg.textContent = "✓ Message sent! We will get back to you shortly.";
        form.appendChild(msg);
        form.reset();

        setTimeout(function () {
            if (msg.parentNode) msg.remove();
        }, 5000);
    }

    /* ─────────────────────────────────────────
       3a. DYNAMIC — Farm Fact Toggler (home)
           Click button to reveal a fun farm fact
    ───────────────────────────────────────── */
    var facts = [
        "Our farm has been running for over 100 years since 1919.",
        "We produce over 50 litres of raw honey every harvest season.",
        "Our grass-fed cattle roam over 12 acres of open pasture.",
        "Every jar of tallow is hand-rendered in small batches.",
        "We grow 6 varieties of traditional indigenous greens.",
        "Our free-range hens lay over 200 eggs every week."
    ];
    var factIndex = 0;

    function initFarmFact() {
        var btn = document.getElementById("fact-btn");
        var display = document.getElementById("fact-display");
        if (!btn || !display) return;

        btn.addEventListener("click", function () {
            display.textContent = facts[factIndex % facts.length];
            display.style.display = "block";
            factIndex++;
            btn.textContent = "Show Another Fact";
        });
    }

    /* ─────────────────────────────────────────
       3b. DYNAMIC — Premium card highlight
           Click a plan card to select it and
           see a confirmation message
    ───────────────────────────────────────── */
    function initPremiumCards() {
        var cards = document.querySelectorAll(".premium-card");
        var confirmMsg = document.getElementById("plan-confirm");
        if (cards.length === 0) return;

        cards.forEach(function (card) {
            card.style.cursor = "pointer";
            card.addEventListener("click", function () {
                cards.forEach(function (c) { c.classList.remove("card-selected"); });
                card.classList.add("card-selected");

                var planName = card.querySelector("h3") ? card.querySelector("h3").textContent : "this plan";
                if (confirmMsg) {
                    confirmMsg.textContent = "✓ You selected: " + planName + ". Fill in the form below to join!";
                    confirmMsg.style.display = "block";

                    var tierSelect = document.getElementById("tier-select");
                    if (tierSelect) {
                        var map = {
                            "The Garden Basket Share": "garden",
                            "The Pitmaster & Roast Share": "meat",
                            "The Full Farm Experience": "homestead"
                        };
                        var val = map[planName];
                        if (val) tierSelect.value = val;
                    }
                }
            });
        });
    }

    /* ─────────────────────────────────────────
       3c. DYNAMIC — Show/hide team member bio
           on About page (click a team card)
    ───────────────────────────────────────── */
    var bios = {
        "John Omwamba":   "John has 15 years of experience in crop rotation and soil health management across Western Kenya.",
        "Grace Achieng":  "Grace holds a diploma in Animal Husbandry and has cared for our livestock herd since 2018.",
        "Samuel Mwangi":  "Samuel is a certified apiarist who introduced our native Kenyan bee colonies in 2020.",
        "Mary Wambui":    "Mary trained in traditional food processing and leads our tallow and flour production unit.",
        "David Kiprop":   "David manages our 3-acre orchard and introduced pomegranate cultivation to the farm.",
        "Florence Atieno":"Florence coordinates all harvest logistics and manages our weekly vegetable box subscriptions."
    };

    function initTeamCards() {
        var cards = document.querySelectorAll(".slide-card");
        if (cards.length === 0) return;

        cards.forEach(function (card) {
            var nameEl = card.querySelector("h3");
            if (!nameEl) return;
            var name = nameEl.textContent.trim();
            if (!bios[name]) return;

            card.style.cursor = "pointer";

            var bioEl = document.createElement("p");
            bioEl.className = "team-bio";
            bioEl.textContent = bios[name];
            bioEl.style.display = "none";
            card.appendChild(bioEl);

            var hint = document.createElement("small");
            hint.className = "bio-hint";
            hint.textContent = "Click to read more";
            card.appendChild(hint);

            card.addEventListener("click", function () {
                var isOpen = bioEl.style.display === "block";
                bioEl.style.display = isOpen ? "none" : "block";
                hint.textContent = isOpen ? "Click to read more" : "Click to collapse";
                card.classList.toggle("card-expanded", !isOpen);
            });
        });
    }

    /* ─────────────────────────────────────────
       4. INIT — run the right features per page
    ───────────────────────────────────────── */
    document.addEventListener("DOMContentLoaded", function () {
        initWelcome();
        initFormValidation();
        initFarmFact();
        initPremiumCards();
        initTeamCards();
    });

})();
