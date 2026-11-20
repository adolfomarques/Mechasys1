(function () {
  "use strict";

  function initFoldMotion() {
    var prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ------------------------------------------------------------
       1. Slide-Over Drawer Controller & Stagger Setup
       ------------------------------------------------------------ */
    var dockMenuBtn = document.getElementById("dock-menu-toggle");
    var dockMenuLabel = document.getElementById("dock-menu-label");
    var dockMenuTooltip = document.getElementById("dock-menu-tooltip");
    var crestMenuBtn = document.getElementById("crest-menu-toggle");
    var crestMenuLabel = document.getElementById("crest-menu-label");
    var mobileMenuBtn = document.getElementById("mobile-menu-toggle");
    var mobileMenuLabel = document.getElementById("mobile-menu-label");
    var drawerCloseBtn = document.getElementById("drawer-close-btn");
    var dockDrawer = document.getElementById("dock-drawer");
    var dockBackdrop = document.getElementById("dock-backdrop");
    var lastTriggerEl = null;

    if (dockDrawer) {
      var drawerListItems = dockDrawer.querySelectorAll(".drawer-links li");
      for (var dIdx = 0; dIdx < drawerListItems.length; dIdx++) {
        drawerListItems[dIdx].style.setProperty("--item-idx", String(dIdx));
      }
    }

    function getDrawerFocusable() {
      if (!dockDrawer) return [];
      return Array.prototype.slice.call(
        dockDrawer.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
    }

    function setDrawerOpen(isOpen, restoreFocus) {
      if (!dockDrawer || !dockBackdrop) return;
      dockDrawer.setAttribute("data-open", isOpen ? "true" : "false");
      dockBackdrop.setAttribute("data-open", isOpen ? "true" : "false");

      if (dockMenuBtn) dockMenuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (crestMenuBtn) crestMenuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (mobileMenuBtn) mobileMenuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (dockMenuLabel) dockMenuLabel.textContent = isOpen ? "Close" : "Menu";
      if (dockMenuTooltip) dockMenuTooltip.textContent = isOpen ? "Close menu" : "All pages";
      if (crestMenuLabel) crestMenuLabel.textContent = isOpen ? "Close" : "Menu";
      if (mobileMenuLabel) mobileMenuLabel.textContent = isOpen ? "Close" : "Menu";

      if (isOpen) {
        dockDrawer.removeAttribute("inert");
        var firstLink =
          dockDrawer.querySelector(".drawer-links a") ||
          dockDrawer.querySelector("a[href]") ||
          drawerCloseBtn;
        if (firstLink && typeof firstLink.focus === "function") {
          try {
            firstLink.focus({ preventScroll: true });
          } catch (err) {
            firstLink.focus();
          }
        }
      } else {
        dockDrawer.setAttribute("inert", "");
        if (restoreFocus && lastTriggerEl && typeof lastTriggerEl.focus === "function") {
          try {
            lastTriggerEl.focus({ preventScroll: true });
          } catch (err) {
            lastTriggerEl.focus();
          }
        }
      }
    }

    function toggleDrawer(triggerEl) {
      lastTriggerEl = triggerEl;
      var isOpen = dockDrawer && dockDrawer.getAttribute("data-open") === "true";
      setDrawerOpen(!isOpen, false);
    }

    if (dockMenuBtn) {
      dockMenuBtn.addEventListener("click", function () {
        toggleDrawer(dockMenuBtn);
      });
    }
    if (crestMenuBtn) {
      crestMenuBtn.addEventListener("click", function () {
        toggleDrawer(crestMenuBtn);
      });
    }
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", function () {
        toggleDrawer(mobileMenuBtn);
      });
    }
    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener("click", function () {
        setDrawerOpen(false, true);
      });
    }
    if (dockBackdrop) {
      dockBackdrop.addEventListener("click", function () {
        setDrawerOpen(false, false);
      });
    }

    document.addEventListener("keydown", function (e) {
      if (!dockDrawer || dockDrawer.getAttribute("data-open") !== "true") return;

      if (e.key === "Escape") {
        e.preventDefault();
        setDrawerOpen(false, true);
        return;
      }

      if (e.key === "Tab") {
        var focusable = getDrawerFocusable();
        if (!focusable.length) return;
        var firstEl = focusable[0];
        var lastEl = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    });

    /* ------------------------------------------------------------
       2. Interactive Hardware Subsystems Inspector & Pins
       ------------------------------------------------------------ */
    var hwTabs = Array.prototype.slice.call(document.querySelectorAll("[data-hw-tab]"));
    var hwPins = Array.prototype.slice.call(document.querySelectorAll("[data-hw-pin]"));
    var hwReadout = document.getElementById("hw-readout");
    var hwReadoutCode = document.getElementById("hw-readout-code");
    var hwReadoutTitle = document.getElementById("hw-readout-title");
    var hwReadoutSpec = document.getElementById("hw-readout-spec");
    var hwReadoutData = {
      "1": {
        code: "01",
        title: "Robotic Laser Optics",
        spec: "1:1 full-scale projection · Millimetric calibration"
      },
      "2": {
        code: "02",
        title: "Anodized Top Carry Frame",
        spec: "Machined aluminum handle · Sealed chassis for one-operator setup"
      },
      "3": {
        code: "03",
        title: "Wireless Layout Field Control",
        spec: "Rugged jobsite tablet · Live DWG/DXF layer control and observations"
      },
      "4": {
        code: "04",
        title: "Survey Tribrach & Tripod Mount",
        spec: "Standard survey tripod compatibility · Rapid stationing to control points"
      }
    };

    function activateHardwarePart(partId, focusTarget) {
      if (!partId) return;
      hwTabs.forEach(function (tab) {
        var active = tab.getAttribute("data-hw-tab") === partId;
        tab.setAttribute("aria-selected", active ? "true" : "false");
        tab.setAttribute("tabindex", active ? "0" : "-1");
        if (active && focusTarget === "tab") {
          tab.focus();
        }
      });
      hwPins.forEach(function (pin) {
        var active = pin.getAttribute("data-hw-pin") === partId;
        pin.setAttribute("aria-pressed", active ? "true" : "false");
        if (active && focusTarget === "pin") {
          pin.focus();
        }
      });
      var info = hwReadoutData[partId];
      if (hwReadout && info) {
        hwReadout.setAttribute("aria-labelledby", "hw-tab-" + partId);
        if (hwReadoutCode) hwReadoutCode.textContent = info.code;
        if (hwReadoutTitle) hwReadoutTitle.textContent = info.title;
        if (hwReadoutSpec) hwReadoutSpec.textContent = info.spec;
      }
    }

    if (hwTabs.length) {
      var initialHwId = "1";
      hwTabs.forEach(function (tab) {
        if (tab.getAttribute("aria-selected") === "true") {
          initialHwId = tab.getAttribute("data-hw-tab") || "1";
        }
      });
      activateHardwarePart(initialHwId, null);
    }

    hwTabs.forEach(function (tab, idx) {
      tab.addEventListener("click", function () {
        activateHardwarePart(tab.getAttribute("data-hw-tab"), null);
      });
      tab.addEventListener("keydown", function (e) {
        var nextIdx = -1;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          nextIdx = (idx + 1) % hwTabs.length;
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          nextIdx = (idx - 1 + hwTabs.length) % hwTabs.length;
        } else if (e.key === "Home") {
          nextIdx = 0;
        } else if (e.key === "End") {
          nextIdx = hwTabs.length - 1;
        }
        if (nextIdx !== -1) {
          e.preventDefault();
          activateHardwarePart(hwTabs[nextIdx].getAttribute("data-hw-tab"), "tab");
        }
      });
    });

    hwPins.forEach(function (pin, idx) {
      pin.addEventListener("click", function () {
        activateHardwarePart(pin.getAttribute("data-hw-pin"), null);
      });
      pin.addEventListener("keydown", function (e) {
        var nextIdx = -1;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          nextIdx = (idx + 1) % hwPins.length;
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          nextIdx = (idx - 1 + hwPins.length) % hwPins.length;
        } else if (e.key === "Home") {
          nextIdx = 0;
        } else if (e.key === "End") {
          nextIdx = hwPins.length - 1;
        }
        if (nextIdx !== -1) {
          e.preventDefault();
          activateHardwarePart(hwPins[nextIdx].getAttribute("data-hw-pin"), "pin");
        }
      });
    });

    /* ------------------------------------------------------------
       3. Interactive 532nm Hero CAD Laser Reticle & Drag Measure
       ------------------------------------------------------------ */
    var heroSurface = document.getElementById("hero-laser-surface");
    var laserOverlay = document.getElementById("mh-laser-overlay");
    var laserH = document.getElementById("mh-laser-h");
    var laserV = document.getElementById("mh-laser-v");
    var laserNode = document.getElementById("mh-laser-node");
    var laserCoords = document.getElementById("mh-laser-coords");
    var dragBox = document.getElementById("mh-laser-drag-box");
    var hasFinePointer =
      !window.matchMedia || window.matchMedia("(pointer: fine)").matches;

    if (
      heroSurface &&
      laserOverlay &&
      laserH &&
      laserV &&
      laserNode &&
      laserCoords &&
      !prefersReducedMotion &&
      hasFinePointer
    ) {
      var dragOrigin = null;

      heroSurface.addEventListener("pointerenter", function () {
        laserOverlay.setAttribute("data-active", "true");
      });

      heroSurface.addEventListener("pointerleave", function () {
        laserOverlay.setAttribute("data-active", "false");
        dragOrigin = null;
        if (dragBox) dragBox.style.display = "none";
      });

      heroSurface.addEventListener("pointerdown", function (e) {
        var rect = heroSurface.getBoundingClientRect();
        dragOrigin = {
          x: Math.max(0, Math.min(rect.width, e.clientX - rect.left)),
          y: Math.max(0, Math.min(rect.height, e.clientY - rect.top))
        };
        if (dragBox) {
          dragBox.style.display = "block";
          dragBox.style.left = dragOrigin.x + "px";
          dragBox.style.top = dragOrigin.y + "px";
          dragBox.style.width = "0px";
          dragBox.style.height = "0px";
        }
      });

      window.addEventListener("pointerup", function () {
        dragOrigin = null;
        if (dragBox) dragBox.style.display = "none";
      });

      heroSurface.addEventListener("pointermove", function (e) {
        var rect = heroSurface.getBoundingClientRect();
        var x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        var y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

        laserH.style.transform = "translate3d(0," + y.toFixed(1) + "px,0)";
        laserV.style.transform = "translate3d(" + x.toFixed(1) + "px,0,0)";
        laserNode.style.transform =
          "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";

        var mmX = Math.round(x * 3.5);
        var mmY = Math.round(y * 3.5);

        if (dragOrigin && dragBox) {
          var left = Math.min(dragOrigin.x, x);
          var top = Math.min(dragOrigin.y, y);
          var w = Math.abs(x - dragOrigin.x);
          var h = Math.abs(y - dragOrigin.y);
          dragBox.style.left = left + "px";
          dragBox.style.top = top + "px";
          dragBox.style.width = w + "px";
          dragBox.style.height = h + "px";
          laserCoords.textContent =
            "\u0394 " + Math.round(w * 3.5) + " \u00d7 " + Math.round(h * 3.5) + " mm";
        } else {
          laserCoords.textContent =
            "X " +
            String(mmX).padStart(4, "0") +
            " \u00b7 Y " +
            String(mmY).padStart(4, "0") +
            " mm";
        }
      });
    }

    /* ------------------------------------------------------------
       4. Interactive & Scroll-Driven 3-Step Workflow + SVG Tracing
       ------------------------------------------------------------ */
    var stepButtons = Array.prototype.slice.call(document.querySelectorAll("[data-step-btn]"));
    var workflowSection = document.getElementById("workflow");
    var workflowRunway = document.getElementById("workflow-runway");
    var workflowCanvas = document.getElementById("workflow-canvas");
    var statusLabel = document.getElementById("blueprint-status-label");
    var currentStep = "1";
    var stepCaptions = {
      "1": "Active stage: 01 Visualize \u2014 Projecting selected CAD layers at 1:1",
      "2": "Active stage: 02 Build \u2014 Shared multi-trade clearance review",
      "3": "Active stage: 03 Perfect \u2014 Syncing field observations to Layout Cloud"
    };

    function prepareTracePaths(container, selectorList) {
      var records = [];
      if (prefersReducedMotion || !container) return records;
      selectorList.forEach(function (sel) {
        var nodes = container.querySelectorAll(sel);
        for (var i = 0; i < nodes.length; i++) {
          var p = nodes[i];
          if (typeof p.getTotalLength === "function") {
            try {
              var len = p.getTotalLength();
              if (len > 0) {
                p.style.strokeDasharray = len.toFixed(1);
                records.push({ el: p, len: len });
              }
            } catch (err) {}
          }
        }
      });
      return records;
    }

    var slabTracePaths = prepareTracePaths(workflowCanvas, [".wall-selected", ".conduit-selected"]);
    var step2TracePaths = prepareTracePaths(workflowCanvas, [".clearance", ".inspection-service"]);
    var step3TracePaths = prepareTracePaths(workflowCanvas, [".record-route", ".record-meter"]);

    function setTraceProgress(records, ratio) {
      var clamped = Math.max(0, Math.min(1, ratio));
      for (var i = 0; i < records.length; i++) {
        records[i].el.style.strokeDashoffset = ((1 - clamped) * records[i].len).toFixed(1);
      }
    }

    function updateWorkflowStatusText() {
      if (!statusLabel || !workflowCanvas) return;
      var wallsOn = workflowCanvas.getAttribute("data-walls") !== "false";
      var mepOn = workflowCanvas.getAttribute("data-mep") !== "false";
      if (!wallsOn && !mepOn) {
        statusLabel.textContent = "All projected layers hidden \u2014 toggle a layer to preview";
        return;
      }
      if (stepCaptions[currentStep]) {
        statusLabel.textContent = stepCaptions[currentStep];
      }
    }

    function activateStep(step, moveFocus) {
      if (!workflowCanvas) return;
      currentStep = step;
      workflowCanvas.setAttribute("data-step", step);
      workflowCanvas.setAttribute("aria-labelledby", "tab-step-" + step);
      updateWorkflowStatusText();
      stepButtons.forEach(function (btn) {
        var active = btn.getAttribute("data-step-btn") === step;
        btn.setAttribute("aria-selected", active ? "true" : "false");
        btn.setAttribute("tabindex", active ? "0" : "-1");
        if (active && moveFocus) btn.focus();
      });
    }

    function jumpToStep(step, moveFocus) {
      if (!prefersReducedMotion && workflowRunway && window.innerWidth >= 1025) {
        var rect = workflowRunway.getBoundingClientRect();
        var runwayTop = (window.scrollY || document.documentElement.scrollTop || 0) + rect.top;
        var travel = Math.max(0, workflowRunway.offsetHeight - window.innerHeight);
        var targetRatio = step === "1" ? 0.08 : step === "2" ? 0.5 : 0.88;
        window.scrollTo({ top: runwayTop + travel * targetRatio, behavior: "smooth" });
      } else {
        setTraceProgress(slabTracePaths, 1);
        setTraceProgress(step2TracePaths, 1);
        setTraceProgress(step3TracePaths, 1);
        stepButtons.forEach(function (b) {
          var bStep = b.getAttribute("data-step-btn") || "1";
          b.style.setProperty("--tab-progress", bStep <= step ? "1" : "0");
        });
      }
      activateStep(step, moveFocus);
    }

    stepButtons.forEach(function (btn, idx) {
      btn.addEventListener("click", function () {
        jumpToStep(btn.getAttribute("data-step-btn"), false);
      });
      btn.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault();
          var next = stepButtons[(idx + 1) % stepButtons.length];
          jumpToStep(next.getAttribute("data-step-btn"), true);
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          var prev = stepButtons[(idx - 1 + stepButtons.length) % stepButtons.length];
          jumpToStep(prev.getAttribute("data-step-btn"), true);
        } else if (e.key === "Home") {
          e.preventDefault();
          jumpToStep(stepButtons[0].getAttribute("data-step-btn"), true);
        } else if (e.key === "End") {
          e.preventDefault();
          jumpToStep(stepButtons[stepButtons.length - 1].getAttribute("data-step-btn"), true);
        }
      });
    });

    function bindLayerToggle(btnId, attrName) {
      var btn = document.getElementById(btnId);
      if (!btn || !workflowCanvas) return;
      var stateEl = btn.querySelector(".layer-state");
      btn.addEventListener("click", function () {
        var nextState = btn.getAttribute("aria-pressed") !== "true";
        btn.setAttribute("aria-pressed", nextState ? "true" : "false");
        if (stateEl) stateEl.textContent = nextState ? "ON" : "OFF";
        workflowCanvas.setAttribute(attrName, nextState ? "true" : "false");
        updateWorkflowStatusText();
      });
    }
    bindLayerToggle("toggle-walls", "data-walls");
    bindLayerToggle("toggle-mep", "data-mep");

    /* ------------------------------------------------------------
       5. Accessible Newsletter Validation
       ------------------------------------------------------------ */
    var newsletterForm = document.getElementById("newsletter-form");
    var newsletterEmail = document.getElementById("newsletter-email");
    var newsletterFeedback = document.getElementById("newsletter-feedback");

    if (newsletterForm && newsletterEmail && newsletterFeedback) {
      newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var val = newsletterEmail.value.trim();
        var atIdx = val.indexOf("@");
        var dotIdx = atIdx > 0 ? val.indexOf(".", atIdx + 2) : -1;
        if (!val || atIdx < 1 || dotIdx === -1 || dotIdx >= val.length - 1 || val.indexOf(" ") !== -1) {
          newsletterFeedback.textContent =
            "Please enter a valid work email address (for example, name@company.com).";
          newsletterEmail.focus();
          return;
        }
        newsletterFeedback.textContent =
          "Thank you \u2014 your email has been registered for Mechasys field updates.";
        newsletterForm.reset();
      });
    }

    /* ------------------------------------------------------------
       6. Reveals, Shutters, Seams & Eased Numeric Counters
       ------------------------------------------------------------ */
    function animateCounter(el) {
      if (prefersReducedMotion || el.getAttribute("data-counted") === "true") return;
      el.setAttribute("data-counted", "true");
      var target = parseInt(el.getAttribute("data-counter"), 10);
      var suffix = el.getAttribute("data-suffix") || "";
      if (isNaN(target)) return;
      var startVal = target <= 10 ? 1 : 0;
      var duration = 680;
      var startTime = performance.now();

      function stepFrame(now) {
        var t = Math.min(1, (now - startTime) / duration);
        var eased = 1 - Math.pow(1 - t, 4);
        var current = Math.round(startVal + (target - startVal) * eased);
        el.textContent = current + suffix;
        if (t < 1) {
          window.requestAnimationFrame(stepFrame);
        } else {
          el.textContent = target + suffix;
        }
      }
      window.requestAnimationFrame(stepFrame);
    }

    var observedNodes = Array.prototype.slice.call(
      document.querySelectorAll(
        "[data-fold-seam], [data-reveal], [data-shutter], .pillar-link, .app-plate, .case-row, [data-counter]"
      )
    );

    function revealIfVisible(node, vh) {
      if (
        node.getAttribute("data-inview") === "true" ||
        node.getAttribute("data-counted") === "true"
      ) {
        return true;
      }
      var r = node.getBoundingClientRect();
      if (r.top < vh * 0.96 && r.bottom > -40) {
        if (node.hasAttribute("data-counter")) {
          animateCounter(node);
        } else {
          node.setAttribute("data-inview", "true");
        }
        return true;
      }
      return false;
    }

    if (!prefersReducedMotion && "IntersectionObserver" in window) {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var node = entry.target;
            if (node.hasAttribute("data-counter")) {
              animateCounter(node);
            } else {
              node.setAttribute("data-inview", "true");
            }
            revealObserver.unobserve(node);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
      );

      observedNodes.forEach(function (node) {
        revealObserver.observe(node);
      });
    } else {
      observedNodes.forEach(function (node) {
        if (!node.hasAttribute("data-counter")) {
          node.setAttribute("data-inview", "true");
        }
      });
    }

    /* ------------------------------------------------------------
       7. Gliding Laser Section-Spy, Surface Observer & 120Hz RAF Loop
       ------------------------------------------------------------ */
    var leftDock = document.getElementById("left-dock");
    var dockSpy = document.getElementById("dock-spy");
    var dockSpyIndicator = document.getElementById("dock-spy-indicator");
    var scrollFill = document.getElementById("laser-scroll-fill");
    var hwReticle = document.getElementById("hw-reticle-svg");
    var hwFigure = document.getElementById("hw-parallax-figure");
    var foldApertures = Array.prototype.slice.call(
      document.querySelectorAll("[data-fold-aperture]")
    );
    var parallaxContainers = Array.prototype.slice.call(
      document.querySelectorAll("[data-parallax-media]")
    );
    var dotMetricEls = Array.prototype.slice.call(
      document.querySelectorAll("[data-dot-metric]")
    );
    var dotMatrices = [];
    var dotInitialized = false;

    function buildDotMatrix(el) {
      var text = (el.getAttribute("data-dot-metric") || el.textContent || "").trim();
      if (!text || !document.createElement) return null;

      var canvas = document.createElement("canvas");
      if (!canvas || typeof canvas.getContext !== "function") return null;

      var ch = 224;
      var fontSpec = '700 200px "Switzer", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      var ctx = canvas.getContext("2d", { willReadFrequently: true }) || canvas.getContext("2d");
      if (!ctx) return null;

      ctx.font = fontSpec;
      ctx.textBaseline = "alphabetic";
      var metrics = ctx.measureText(text);
      var ascent = typeof metrics.actualBoundingBoxAscent === "number" && metrics.actualBoundingBoxAscent > 0
        ? metrics.actualBoundingBoxAscent
        : 146;
      var descent = typeof metrics.actualBoundingBoxDescent === "number"
        ? Math.max(0, metrics.actualBoundingBoxDescent)
        : 4;
      var leftB = typeof metrics.actualBoundingBoxLeft === "number" ? metrics.actualBoundingBoxLeft : 0;
      var rightB = typeof metrics.actualBoundingBoxRight === "number" && metrics.actualBoundingBoxRight > 0
        ? metrics.actualBoundingBoxRight
        : metrics.width;
      var s = 204 / Math.max(1, ascent + descent);
      var cw = Math.max(120, Math.ceil((leftB + rightB) * s) + 24);

      canvas.width = cw;
      canvas.height = ch;

      ctx = canvas.getContext("2d", { willReadFrequently: true }) || canvas.getContext("2d");
      if (!ctx) return null;
      ctx.font = fontSpec;
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#000000";
      ctx.translate(12 + leftB * s, 10 + ascent * s);
      ctx.scale(s, s);
      ctx.fillText(text, 0, 0);

      var data;
      try {
        data = ctx.getImageData(0, 0, cw, ch).data;
      } catch (err) {
        return null;
      }

      var dots = [];
      var step = 7;
      for (var py = 4; py < 220; py += step) {
        for (var px = 4; px < cw - 4; px += step) {
          if (data[(py * cw + px) * 4 + 3] > 140) {
            dots.push({ x: px, y: py });
          }
        }
      }
      if (!dots.length) return null;

      /* Project bottom-to-top, left-to-right like an ascending laser scan */
      dots.sort(function (a, b) {
        return b.y - a.y || a.x - b.x;
      });

      var minX = dots[0].x;
      var maxX = dots[0].x;
      var minY = dots[0].y;
      var maxY = dots[0].y;
      for (var d = 1; d < dots.length; d++) {
        if (dots[d].x < minX) minX = dots[d].x;
        if (dots[d].x > maxX) maxX = dots[d].x;
        if (dots[d].y < minY) minY = dots[d].y;
        if (dots[d].y > maxY) maxY = dots[d].y;
      }

      var pad = 4;
      var vbW = maxX - minX + pad * 2;
      var vbH = maxY - minY + pad * 2;
      var svgNS = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("class", "dot-matrix-svg");
      svg.setAttribute("viewBox", "0 0 " + vbW + " " + vbH);
      svg.setAttribute("aria-hidden", "true");

      var circles = [];
      for (var i = 0; i < dots.length; i++) {
        var circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", String(dots[i].x - minX + pad));
        circle.setAttribute("cy", String(dots[i].y - minY + pad));
        circle.setAttribute("r", "2.05");
        circle.setAttribute("fill", "#CEDAE8");
        svg.appendChild(circle);
        circles.push(circle);
      }

      el.textContent = "";
      el.appendChild(svg);
      el.classList.add("is-dot-ready");

      return {
        el: el,
        circles: circles,
        states: typeof Uint8Array === "function" ? new Uint8Array(circles.length) : [],
        lastLit: -1,
        lastFront: -1
      };
    }

    function updateDotMetrics(vh, forceFull) {
      if (!dotMatrices.length) return;
      for (var m = 0; m < dotMatrices.length; m++) {
        var item = dotMatrices[m];
        var total = item.circles.length;
        var lit;
        var front;
        if (forceFull) {
          lit = total;
          front = 0;
        } else {
          var rect = item.el.getBoundingClientRect();
          var prog = Math.max(0, Math.min(1, (vh * 0.88 - rect.top) / Math.max(1, vh * 0.48)));
          lit = Math.round(prog * total);
          front = lit > 0 && lit < total ? Math.max(10, Math.round(total * 0.045)) : 0;
        }
        if (lit === item.lastLit && (front === 0) === (item.lastFront === 0)) continue;
        item.lastLit = lit;
        item.lastFront = front;

        var settledCutoff = lit - front;
        for (var i = 0; i < total; i++) {
          var nextState = i < settledCutoff ? 2 : i < lit ? 1 : 0;
          if (item.states[i] === nextState) continue;
          item.states[i] = nextState;
          if (nextState === 2) {
            item.circles[i].setAttribute("fill", "#0047BB");
            item.circles[i].setAttribute("r", "2.35");
          } else if (nextState === 1) {
            item.circles[i].setAttribute("fill", "#00B93B");
            item.circles[i].setAttribute("r", "2.7");
          } else {
            item.circles[i].setAttribute("fill", "#CEDAE8");
            item.circles[i].setAttribute("r", "2.05");
          }
        }
      }
    }

    function initDotMatrices() {
      if (dotInitialized || !dotMetricEls.length) return;
      dotInitialized = true;
      for (var i = 0; i < dotMetricEls.length; i++) {
        var built = buildDotMatrix(dotMetricEls[i]);
        if (built) dotMatrices.push(built);
      }
      updateDotMetrics(window.innerHeight || 800, prefersReducedMotion);
    }

    var surfaceSections = Array.prototype.slice.call(
      document.querySelectorAll("[data-surface-theme]")
    );
    var spyLinks = Array.prototype.slice.call(document.querySelectorAll("[data-spy-link]"));
    var spyTargets = spyLinks
      .map(function (link) {
        return {
          link: link,
          section: document.getElementById(link.getAttribute("data-spy-link"))
        };
      })
      .filter(function (item) {
        return !!item.section;
      });

    var ctaSection = document.getElementById("partners");
    var ctaSvg = document.getElementById("cta-blueprint-svg");
    var ctaTracePaths = prepareTracePaths(ctaSvg, ["path"]);

    var lastSpyLink = null;
    var ticking = false;

    function positionSpyIndicator(activeLink) {
      if (!dockSpy || !dockSpyIndicator || !activeLink) return;
      var indHeight = dockSpyIndicator.offsetHeight || 3;
      if (activeLink.offsetHeight > 0 && activeLink.offsetParent === dockSpy) {
        var offsetCenter = activeLink.offsetTop + (activeLink.offsetHeight - indHeight) * 0.5;
        dockSpyIndicator.style.setProperty("--spy-y", offsetCenter.toFixed(1) + "px");
        return;
      }
      var spyRect = dockSpy.getBoundingClientRect();
      var linkRect = activeLink.getBoundingClientRect();
      if (linkRect.height > 0) {
        var rectCenter = linkRect.top - spyRect.top + (linkRect.height - indHeight) * 0.5;
        dockSpyIndicator.style.setProperty("--spy-y", rectCenter.toFixed(1) + "px");
      }
    }

    function updateOnScroll() {
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      var vh = window.innerHeight || 800;
      var vw = window.innerWidth || 1280;
      var midY = vh * 0.5;

      document.documentElement.style.setProperty("--scroll-y", Math.min(y, 900) + "px");
      var heroProg = Math.min(1, Math.max(0, y / Math.max(480, vh * 0.82)));
      document.documentElement.style.setProperty("--hero-progress", heroProg.toFixed(3));

      var maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      var ratio = Math.min(1, Math.max(0, y / maxScroll));

      if (scrollFill && !prefersReducedMotion) {
        scrollFill.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
      }

      /* Dynamic Left Dock Surface Theme (dark | light | cobalt) */
      if (leftDock && surfaceSections.length) {
        var matchedTheme = null;
        for (var s = 0; s < surfaceSections.length; s++) {
          var secRect = surfaceSections[s].getBoundingClientRect();
          if (secRect.top <= midY && secRect.bottom >= midY) {
            matchedTheme = surfaceSections[s].getAttribute("data-surface-theme");
            break;
          }
        }
        if (matchedTheme) {
          leftDock.setAttribute("data-surface", matchedTheme);
        }
      }

      /* Active Section-Spy + Gliding Laser Indicator */
      if (spyTargets.length) {
        var activeItem = spyTargets[0];
        for (var k = 0; k < spyTargets.length; k++) {
          var spRect = spyTargets[k].section.getBoundingClientRect();
          if (spRect.top <= midY + 40) {
            activeItem = spyTargets[k];
          }
        }
        if (y + vh >= document.documentElement.scrollHeight - 4) {
          var lastTarget = spyTargets[spyTargets.length - 1];
          if (lastTarget.section.getBoundingClientRect().top < vh) {
            activeItem = lastTarget;
          }
        }
        spyTargets.forEach(function (item) {
          if (item === activeItem) {
            item.link.setAttribute("aria-current", "true");
          } else {
            item.link.removeAttribute("aria-current");
          }
        });
        lastSpyLink = activeItem.link;
        positionSpyIndicator(lastSpyLink);
      }

      if (prefersReducedMotion) {
        foldApertures.forEach(function (el) {
          el.style.setProperty("--fold-progress", "1");
        });
        updateDotMetrics(vh, true);
        ticking = false;
        return;
      }

      /* Scroll Safety Sweep for Reveals, Shutters, Seams & Counters */
      for (var obsIdx = 0; obsIdx < observedNodes.length; obsIdx++) {
        revealIfVisible(observedNodes[obsIdx], vh);
      }

      updateDotMetrics(vh, false);

      /* Architectural Fold Aperture Framing (--fold-progress 0 -> 1 between vh*0.95 and vh*0.35) */
      for (var f = 0; f < foldApertures.length; f++) {
        var foldEl = foldApertures[f];
        if (vw >= 1025) {
          var fRect = foldEl.getBoundingClientRect();
          var rawFold = (vh * 0.95 - fRect.top) / Math.max(1, vh * 0.6);
          var clampedFold = Math.max(0, Math.min(1, rawFold));
          var easedFold = 1 - Math.pow(1 - clampedFold, 2);
          foldEl.style.setProperty("--fold-progress", easedFold.toFixed(4));
        } else {
          foldEl.style.setProperty("--fold-progress", "1");
        }
      }

      /* Kinetic Hardware Stage: Reticle Rotation/Scale & Cutout Drift */
      if (hwReticle) {
        var retRect = hwReticle.getBoundingClientRect();
        if (retRect.bottom > -120 && retRect.top < vh + 120) {
          var retNorm = Math.max(
            -1,
            Math.min(1, (midY - (retRect.top + retRect.height * 0.5)) / midY)
          );
          var retScale = (1 - Math.abs(retNorm)) * 0.07;
          hwReticle.style.setProperty("--hw-reticle-deg", (retNorm * 16).toFixed(2) + "deg");
          hwReticle.style.setProperty("--hw-scale", retScale.toFixed(4));
        }
      }

      if (hwFigure) {
        var hwRect = hwFigure.getBoundingClientRect();
        if (hwRect.bottom > -120 && hwRect.top < vh + 120) {
          var hwNorm = Math.max(
            -1,
            Math.min(1, (midY - (hwRect.top + hwRect.height * 0.5)) / midY)
          );
          hwFigure.style.setProperty("--hw-drift", (hwNorm * 18).toFixed(1) + "px");
        }
      }

      /* Counter-Directional Media & Case Copy Parallax */
      for (var i = 0; i < parallaxContainers.length; i++) {
        var box = parallaxContainers[i];
        var rect = box.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > vh + 120) continue;
        var img = box.querySelector("img");
        if (!img) continue;
        var norm = Math.max(-1, Math.min(1, (midY - (rect.top + rect.height * 0.5)) / midY));
        img.style.setProperty("--photo-drift", (norm * 28).toFixed(1) + "px");
      }

      /* Scroll-Driven 3-Step Workflow & Live CAD Vector Tracing */
      if (workflowSection && workflowRunway) {
        var wRect = workflowRunway.getBoundingClientRect();
        var isVisible = wRect.bottom > 0 && wRect.top < vh;
        workflowSection.setAttribute("data-active-zone", isVisible ? "true" : "false");

        if (vw >= 1025 && wRect.height > vh) {
          var travel = Math.max(1, wRect.height - vh);
          var wProg = Math.max(0, Math.min(1, -wRect.top / travel));

          var p1 = Math.max(0, Math.min(1, wProg / 0.34));
          var p2 = Math.max(0, Math.min(1, (wProg - 0.34) / 0.33));
          var p3 = Math.max(0, Math.min(1, (wProg - 0.67) / 0.33));

          if (stepButtons[0]) stepButtons[0].style.setProperty("--tab-progress", p1.toFixed(3));
          if (stepButtons[1]) stepButtons[1].style.setProperty("--tab-progress", p2.toFixed(3));
          if (stepButtons[2]) stepButtons[2].style.setProperty("--tab-progress", p3.toFixed(3));

          var slabDraw = Math.max(
            0.18,
            Math.min(
              1,
              wRect.top < vh * 0.78
                ? Math.min(1, (vh * 0.85 - wRect.top) / (vh * 0.75))
                : 0.18
            )
          );
          setTraceProgress(slabTracePaths, Math.max(slabDraw, p1));
          setTraceProgress(step2TracePaths, p2);
          setTraceProgress(step3TracePaths, p3);

          var targetStep = wProg < 0.34 ? "1" : wProg < 0.67 ? "2" : "3";
          if (targetStep !== currentStep) {
            activateStep(targetStep, false);
          }
        } else if (isVisible) {
          var mDraw = Math.max(0, Math.min(1, (vh - wRect.top) / (vh * 0.7)));
          setTraceProgress(slabTracePaths, mDraw);
          setTraceProgress(step2TracePaths, 1);
          setTraceProgress(step3TracePaths, 1);
        }
      }

      /* Scroll-Driven Blueprint Tracing in #partners */
      if (ctaSection && ctaTracePaths.length) {
        var ctaRect = ctaSection.getBoundingClientRect();
        if (ctaRect.bottom > 0 && ctaRect.top < vh) {
          var ctaProg = Math.max(0, Math.min(1, (vh - ctaRect.top) / (vh * 0.85)));
          setTraceProgress(ctaTracePaths, ctaProg);
          ctaSection.style.setProperty(
            "--cta-blueprint-opacity",
            (0.06 + ctaProg * 0.16).toFixed(3)
          );
        }
      }

      ticking = false;
    }

    function requestUpdate() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateOnScroll);
      }
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    updateOnScroll();
    if (dotMetricEls.length) {
      if (
        typeof Promise === "function" &&
        document.fonts &&
        typeof document.fonts.load === "function"
      ) {
        Promise.race([
          document.fonts.load('700 200px "Switzer"').catch(function () {}),
          new Promise(function (resolve) {
            window.setTimeout(resolve, 900);
          })
        ]).then(initDotMatrices, initDotMatrices);
      } else {
        initDotMatrices();
      }
    }
    if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === "function") {
      document.fonts.ready.then(function () {
        if (lastSpyLink) positionSpyIndicator(lastSpyLink);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFoldMotion);
  } else {
    initFoldMotion();
  }
})();
