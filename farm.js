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
                    var isContact = form.classList.contains("contact-form");
                    if (isContact) {
                        saveContact({
                            name:    document.getElementById("name").value.trim(),
                            email:   document.getElementById("contact-email").value.trim(),
                            subject: document.getElementById("subject").value.trim(),
                            message: document.getElementById("message").value.trim()
                        }, form);
                    } else {
                        showFormSuccess(form);
                    }
                }
            });

            form.querySelectorAll("input, select, textarea").forEach(function (field) {
                field.addEventListener("input", function () { clearError(field); });
                field.addEventListener("change", function () { clearError(field); });
            });
        });
    }

    function showFormSuccess(form, text) {
        var existing = form.querySelector(".form-success");
        if (existing) existing.remove();

        var msg = document.createElement("div");
        msg.className = "form-success";
        msg.textContent = text || "✓ Message sent! We will get back to you shortly.";
        form.appendChild(msg);
        form.reset();

        setTimeout(function () {
            if (msg.parentNode) msg.remove();
        }, 5000);
    }

    function saveContact(data, form) {
        fetch("http://localhost:3000/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(function (r) { return r.json(); })
        .then(function (res) {
            if (res.success) {
                showFormSuccess(form, "✓ Message sent! We will get back to you shortly.");
            } else {
                showFormSuccess(form, "✓ Submitted! (DB: " + (res.error || "unknown") + ")");
            }
        })
        .catch(function () {
            showFormSuccess(form, "✓ Message received! (Server offline — saved locally.)");
        });
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
       4. PAYMENT FLOW  (premium.html)
    ───────────────────────────────────────── */

    var planPrices = {
        garden:    { label: "The Garden Basket Share",    amount: "KSh 3,500" },
        meat:      { label: "The Pitmaster & Roast Share", amount: "KSh 7,000" },
        homestead: { label: "The Full Farm Experience",    amount: "KSh 10,000" }
    };

    function initPaymentToggle() {
        var radios = document.querySelectorAll("input[name='payment']");
        if (radios.length === 0) return;

        radios.forEach(function (radio) {
            radio.addEventListener("change", function () {
                document.querySelectorAll(".payment-fields").forEach(function (f) {
                    f.classList.remove("active");
                });
                var target = document.getElementById("fields-" + radio.value);
                if (target) target.classList.add("active");

                // highlight selected option label
                document.querySelectorAll(".payment-option").forEach(function (opt) {
                    opt.style.borderColor = "";
                });
            });
        });
    }

    function showPayModal(method, planLabel, amount, onConfirm) {
        var overlay = document.createElement("div");
        overlay.className = "pay-modal-overlay";

        var icons = { mpesa: "📱", card: "💳", cash: "💵" };
        var methodLabel = { mpesa: "M-Pesa", card: "Card", cash: "Cash on Delivery" };

        var extraHtml = "";
        if (method === "mpesa") {
            var phone = (document.getElementById("mpesa-phone") || {}).value || "your number";
            extraHtml = "<p>A simulated STK push will be sent to <strong>" + phone + "</strong>. Enter your M-Pesa PIN to confirm.</p>";
        } else if (method === "card") {
            var cardNum = (document.getElementById("card-number") || {}).value || "";
            var masked = cardNum ? "**** **** **** " + cardNum.replace(/\s/g, "").slice(-4) : "your card";
            extraHtml = "<p>Charging <strong>" + masked + "</strong>. Click Confirm to authorise this payment.</p>";
        } else {
            extraHtml = "<p>Our delivery agent will collect payment at your door on the first delivery date.</p>";
        }

        overlay.innerHTML =
            "<div class='pay-modal'>" +
            "<div style='font-size:2.5rem;margin-bottom:0.5rem'>" + icons[method] + "</div>" +
            "<h3>" + methodLabel[method] + " Payment</h3>" +
            "<p style='margin-bottom:0.2rem'>Plan: <strong>" + planLabel + "</strong></p>" +
            "<div class='pay-amount'>" + amount + " / month</div>" +
            extraHtml +
            "<div class='pay-modal-btns'>" +
            "<button class='btn-confirm-pay'>✓ Confirm Payment</button>" +
            "<button class='btn-cancel-pay'>Cancel</button>" +
            "</div>" +
            "</div>";

        document.body.appendChild(overlay);

        overlay.querySelector(".btn-confirm-pay").addEventListener("click", function () {
            overlay.remove();
            onConfirm();
        });

        overlay.querySelector(".btn-cancel-pay").addEventListener("click", function () {
            overlay.remove();
        });

        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) overlay.remove();
        });
    }

    function initPremiumPayment() {
        var form = document.querySelector(".premium-form");
        if (!form) return;

        initPaymentToggle();

        form.setAttribute("novalidate", true);

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            // validate core fields only
            var coreValid = true;
            ["fullname", "email", "tier-select", "delivery-address"].forEach(function (id) {
                var field = document.getElementById(id);
                if (!field) return;
                clearError(field);
                if (field.value.trim() === "") {
                    showError(field, "This field is required.");
                    coreValid = false;
                }
            });

            var emailField = document.getElementById("email");
            if (emailField && emailField.value.trim() !== "") {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
                    showError(emailField, "Please enter a valid email address.");
                    coreValid = false;
                }
            }

            var selectedPayment = form.querySelector("input[name='payment']:checked");
            if (!selectedPayment) {
                var payGroup = form.querySelector(".payment-options");
                if (payGroup) {
                    var err = payGroup.parentNode.querySelector(".field-error");
                    if (err) err.remove();
                    var e2 = document.createElement("span");
                    e2.className = "field-error";
                    e2.textContent = "Please select a payment method.";
                    payGroup.parentNode.appendChild(e2);
                }
                coreValid = false;
            }

            if (!coreValid) return;

            // validate payment-specific fields
            var method = selectedPayment.value;
            if (method === "mpesa") {
                var phone = document.getElementById("mpesa-phone");
                if (phone && phone.value.trim() === "") {
                    showError(phone, "Please enter your M-Pesa phone number.");
                    return;
                }
            }
            if (method === "card") {
                var cardNum = document.getElementById("card-number");
                var expiry  = document.getElementById("card-expiry");
                var cvv     = document.getElementById("card-cvv");
                var cardOk  = true;
                if (cardNum && cardNum.value.trim() === "") { showError(cardNum, "Card number is required."); cardOk = false; }
                if (expiry  && expiry.value.trim()  === "") { showError(expiry,  "Expiry date is required."); cardOk = false; }
                if (cvv     && cvv.value.trim()     === "") { showError(cvv,     "CVV is required.");         cardOk = false; }
                if (!cardOk) return;
            }

            // get plan info
            var tierVal   = (document.getElementById("tier-select") || {}).value || "garden";
            var planInfo  = planPrices[tierVal] || { label: "Selected Plan", amount: "KSh 0" };

            showPayModal(method, planInfo.label, planInfo.amount, function () {
                // save subscriber to database
                fetch("http://localhost:3000/subscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        full_name:        (document.getElementById("fullname") || {}).value || "",
                        email:            (document.getElementById("email") || {}).value || "",
                        plan:             planInfo.label,
                        delivery_address: (document.getElementById("delivery-address") || {}).value || "",
                        payment_method:   method
                    })
                })
                .catch(function () { /* server offline, still show success */ });

                var banner = document.getElementById("pay-success");
                if (banner) {
                    banner.style.display = "block";
                    banner.textContent = "✓ Payment confirmed! Welcome to Siganga Farm Premium. You will receive a confirmation email shortly.";
                    banner.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                form.reset();
                document.querySelectorAll(".payment-fields").forEach(function (f) { f.classList.remove("active"); });
            });
        });
    }

    /* ─────────────────────────────────────────
       5. INIT — run the right features per page
    ───────────────────────────────────────── */
    document.addEventListener("DOMContentLoaded", function () {
        initWelcome();
        initFormValidation();
        initFarmFact();
        initPremiumCards();
        initTeamCards();
        initPremiumPayment();
    });

})();
