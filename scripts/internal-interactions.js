(function () {
  "use strict";

  function normalizeRoute(path) {
    if (!path) return "/";
    var clean = path.split("?")[0].split("#")[0].replace(/index\.html$/, "");
    if (clean.length > 1 && clean.charAt(clean.length - 1) !== "/") {
      clean += "/";
    }
    return clean;
  }

  function initInternalInteractions() {
    var currentPath = normalizeRoute(window.location.pathname);

    /* 1. Mark Active Page in Navigation Crest & Drawer */
    var navLinks = document.querySelectorAll("#dock-drawer a[href], .crest-utility a[href]");
    for (var n = 0; n < navLinks.length; n++) {
      var href = navLinks[n].getAttribute("href");
      if (!href || href.charAt(0) === "#" || href.indexOf("http") === 0) continue;
      var resolved = navLinks[n].pathname || href;
      if (normalizeRoute(resolved) === currentPath) {
        navLinks[n].setAttribute("aria-current", "page");
      }
    }

    /* 2. Accessible FAQ / Accordion Panels */
    var faqTriggers = document.querySelectorAll("[data-faq-trigger]");
    for (var f = 0; f < faqTriggers.length; f++) {
      (function (btn) {
        btn.addEventListener("click", function () {
          var expanded = btn.getAttribute("aria-expanded") === "true";
          var targetId = btn.getAttribute("aria-controls");
          var panel = targetId ? document.getElementById(targetId) : null;
          btn.setAttribute("aria-expanded", expanded ? "false" : "true");
          if (panel) {
            if (expanded) {
              panel.setAttribute("hidden", "");
            } else {
              panel.removeAttribute("hidden");
            }
          }
        });
      })(faqTriggers[f]);
    }

    /* 3. Interactive Resource Library Search & Category Filter */
    var libraries = document.querySelectorAll("[data-library]");
    for (var l = 0; l < libraries.length; l++) {
      (function (lib) {
        var searchInput = lib.querySelector("[data-library-search]");
        var filterBtns = lib.querySelectorAll("[data-library-filter]");
        var clearBtns = lib.querySelectorAll("[data-library-clear]");
        var countEl = lib.querySelector("[data-library-count]");
        var emptyEl = lib.querySelector("[data-library-empty]");
        var cards = lib.querySelectorAll(".resource-card");
        var activeFilter = "all";

        function applyLibraryFilter() {
          var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
          var shown = 0;

          for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var cat = card.getAttribute("data-category") || "";
            var haystack = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
            var matchCat = activeFilter === "all" || cat === activeFilter;
            var matchQuery = !query || haystack.indexOf(query) !== -1;
            var visible = matchCat && matchQuery;

            if (visible) {
              card.removeAttribute("hidden");
              shown += 1;
            } else {
              card.setAttribute("hidden", "");
            }
          }

          if (countEl) {
            countEl.textContent = "Showing " + shown + " of " + cards.length + " items";
          }

          if (emptyEl) {
            if (shown === 0) {
              emptyEl.removeAttribute("hidden");
            } else {
              emptyEl.setAttribute("hidden", "");
            }
          }
        }

        if (searchInput) {
          searchInput.addEventListener("input", applyLibraryFilter);
        }

        for (var b = 0; b < filterBtns.length; b++) {
          (function (btn) {
            btn.addEventListener("click", function () {
              activeFilter = btn.getAttribute("data-library-filter") || "all";
              for (var k = 0; k < filterBtns.length; k++) {
                filterBtns[k].setAttribute("aria-pressed", filterBtns[k] === btn ? "true" : "false");
              }
              applyLibraryFilter();
            });
          })(filterBtns[b]);
        }

        for (var c = 0; c < clearBtns.length; c++) {
          clearBtns[c].addEventListener("click", function () {
            if (searchInput) searchInput.value = "";
            activeFilter = "all";
            for (var k = 0; k < filterBtns.length; k++) {
              var isAll = filterBtns[k].getAttribute("data-library-filter") === "all";
              filterBtns[k].setAttribute("aria-pressed", isAll ? "true" : "false");
            }
            applyLibraryFilter();
            if (searchInput) searchInput.focus();
          });
        }

        applyLibraryFilter();
      })(libraries[l]);
    }

    /* 4. Interactive Topic Selector & Accessible Flagship Form Validation */
    var forms = document.querySelectorAll("[data-mechasys-form]");
    for (var m = 0; m < forms.length; m++) {
      (function (form) {
        var topicBtns = form.querySelectorAll("[data-topic-btn]");
        var topicInput = form.querySelector("[data-topic-input]");
        var statusEl = form.querySelector("[data-form-status]");

        for (var t = 0; t < topicBtns.length; t++) {
          (function (btn) {
            btn.addEventListener("click", function () {
              var val = btn.getAttribute("data-topic-btn") || "";
              for (var k = 0; k < topicBtns.length; k++) {
                topicBtns[k].setAttribute("aria-pressed", topicBtns[k] === btn ? "true" : "false");
              }
              if (topicInput) topicInput.value = val;
            });
          })(topicBtns[t]);
        }

        form.addEventListener("submit", function (e) {
          e.preventDefault();
          var requiredControls = form.querySelectorAll("[required]");
          var firstInvalid = null;

          for (var r = 0; r < requiredControls.length; r++) {
            var ctrl = requiredControls[r];
            var invalid = false;

            if (ctrl.type === "checkbox") {
              invalid = !ctrl.checked;
            } else {
              var val = (ctrl.value || "").trim();
              if (!val) {
                invalid = true;
              } else if (ctrl.type === "email" && (val.indexOf("@") === -1 || val.indexOf(".") === -1)) {
                invalid = true;
              }
            }

            if (invalid) {
              ctrl.setAttribute("aria-invalid", "true");
              if (!firstInvalid) firstInvalid = ctrl;
            } else {
              ctrl.removeAttribute("aria-invalid");
            }
          }

          if (firstInvalid) {
            if (statusEl) {
              statusEl.setAttribute("data-state", "error");
              statusEl.textContent = "Please complete all highlighted required fields and enter a valid work email address before continuing.";
            }
            firstInvalid.focus();
            return;
          }

          var selectedTopic = topicInput && topicInput.value ? " (" + topicInput.value + ")" : "";
          var successLabel = form.getAttribute("data-success-message") ||
            ("Your details have been validated" + selectedTopic + " in this local preview environment.");

          if (statusEl) {
            statusEl.setAttribute("data-state", "success");
            statusEl.textContent = successLabel;
          }

          form.reset();
          if (topicBtns.length && topicInput) {
            topicInput.value = topicBtns[0].getAttribute("data-topic-btn") || "";
            for (var k = 0; k < topicBtns.length; k++) {
              topicBtns[k].setAttribute("aria-pressed", k === 0 ? "true" : "false");
            }
          }
        });
      })(forms[m]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initInternalInteractions);
  } else {
    initInternalInteractions();
  }
})();
