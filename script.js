// ================================
// THREE.JS HERO ANIMATION
// OPTIMIZED: Lazy-load Three.js only after page load,
// don't block LCP (Largest Contentful Paint)
// ================================
function loadThreeJS() {
  const canvasContainer = document.getElementById("hero-canvas");
  if (!canvasContainer) return;

  import("https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js")
    .then(({ default: THREE }) => {
      // OPTIMIZED: THREE is now a dynamic import — only loaded after
      // the rest of the page is interactive (not a render-blocking resource)
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

      canvasContainer.appendChild(renderer.domElement);

      function resizeRenderer() {
        const w = canvasContainer.clientWidth;
        const h = canvasContainer.clientHeight || w;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }

      resizeRenderer();
      window.addEventListener("resize", resizeRenderer, { passive: true });

      const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
      const material = new THREE.MeshStandardMaterial({
        color: 0x7a5cff,
        emissive: 0x4422aa,
        roughness: 0.3,
        metalness: 0.7,
      });

      const torusKnot = new THREE.Mesh(geometry, material);
      scene.add(torusKnot);
      scene.add(Object.assign(new THREE.PointLight(0xffffff, 1), { position: new THREE.Vector3(20, 20, 20) }));
      camera.position.z = 40;

      // OPTIMIZED: Pause animation when tab is not visible
      let animId;
      function animate() {
        animId = requestAnimationFrame(animate);
        torusKnot.rotation.x += 0.01;
        torusKnot.rotation.y += 0.01;
        renderer.render(scene, camera);
      }

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          cancelAnimationFrame(animId);
        } else {
          animate();
        }
      });

      animate();
    })
    .catch(err => console.warn("Three.js failed to load", err));
}

// ================================
// NAVIGATION (HAMBURGER MENU)
// ================================
function initNav() {
  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("nav-links");
  const navItems  = document.querySelectorAll(".nav-link");

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("active");
    navLinks.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  const closeNav = () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
  };

  navItems.forEach(link => link.addEventListener("click", closeNav));

  document.addEventListener("click", e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) closeNav();
  });
}

// ================================
// HEADER SCROLL EFFECT
// OPTIMIZED: Used IntersectionObserver instead of scroll event
// to avoid firing on every scroll tick
// ================================
function initHeaderScroll() {
  const header  = document.querySelector(".header");
  const sentinel = document.createElement("div");
  sentinel.style.cssText = "position:absolute;top:100px;height:1px;pointer-events:none;";
  document.body.prepend(sentinel);

  new IntersectionObserver(
    ([entry]) => header?.classList.toggle("scrolled", !entry.isIntersecting),
    { threshold: 0 }
  ).observe(sentinel);
}

// ================================
// SMOOTH SCROLL
// ================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
    });
  });
}

// ================================
// ACTIVE NAV LINK ON SCROLL
// OPTIMIZED: Single IntersectionObserver instead of
// scroll event that loops over all sections every tick
// ================================
function initActiveNavHighlight() {
  const sections = document.querySelectorAll("section[id]");
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (link) link.classList.toggle("active", entry.isIntersecting);
    });
  }, { rootMargin: "-30% 0px -60% 0px", threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

// ================================
// CUSTOM CURSOR (DESKTOP ONLY)
// OPTIMIZED: Throttled via rAF — cursor and follower
// updated at most once per frame, not per mousemove event
// ================================
function initCustomCursor() {
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

  const cursor   = Object.assign(document.createElement("div"), { className: "custom-cursor" });
  const follower = Object.assign(document.createElement("div"), { className: "cursor-follower" });
  document.body.append(cursor, follower);

  let mouseX = 0, mouseY = 0, fx = 0, fy = 0, ticking = false;

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // OPTIMIZED: Only schedule one rAF per frame even if mousemove fires many times
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        cursor.style.transform  = `translate(${mouseX - 10}px, ${mouseY - 10}px)`;
        cursor.style.opacity    = "1";
        follower.style.opacity  = "1";
        ticking = false;
      });
    }
  }, { passive: true });

  // OPTIMIZED: Follower uses its own separate rAF loop (lerp), independent of mousemove
  function animateFollower() {
    fx += (mouseX - fx) * 0.12;
    fy += (mouseY - fy) * 0.12;
    follower.style.transform = `translate(${fx - 4}px, ${fy - 4}px)`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();
}

// ================================
// PARALLAX ORBS
// OPTIMIZED: Throttled with rAF — was firing raw on every
// scroll event (could be 60-120 events/sec)
// ================================
function initParallaxOrbs() {
  const orbs = document.querySelectorAll(".gradient-orb");
  if (!orbs.length) return;

  let lastScrollY = 0, orbTicking = false;

  window.addEventListener("scroll", () => {
    lastScrollY = window.pageYOffset;
    if (!orbTicking) {
      orbTicking = true;
      requestAnimationFrame(() => {
        orbs.forEach((orb, i) => {
          // OPTIMIZED: Use translate3d — forces GPU compositing layer
          orb.style.transform = `translate3d(0, ${lastScrollY * (i + 1) * 0.04}px, 0)`;
        });
        orbTicking = false;
      });
    }
  }, { passive: true });
}

// ================================
// STATS COUNT ANIMATION
// (unchanged — already uses IntersectionObserver correctly)
// ================================
function initStatsAnimation() {
  function animateValue(el, start, end, duration) {
    let startTime = null;
    function step(time) {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      el.textContent = Math.floor(progress * (end - start) + start);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      animateValue(el, 0, parseInt(el.dataset.value, 10), 2000);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".stat-number").forEach(stat => {
    stat.dataset.value = stat.textContent.trim();
    observer.observe(stat);
  });
}

// ================================
// PROJECT CARD TILT EFFECT
// OPTIMIZED: Throttled via rAF — mousemove was previously
// calling style.transform on every pixel of mouse movement
// ================================
function initCardTilt() {
  document.querySelectorAll(".project-card").forEach(card => {
    let tiltTicking = false;
    let clientX = 0, clientY = 0;

    card.addEventListener("mousemove", e => {
      clientX = e.clientX;
      clientY = e.clientY;
      if (!tiltTicking) {
        tiltTicking = true;
        requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = clientX - rect.left;
          const y = clientY - rect.top;
          const rotateX = ((y - rect.height / 2) / rect.height) * 15;
          const rotateY = ((rect.width / 2 - x) / rect.width) * 15;
          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
          tiltTicking = false;
        });
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    });
  });
}

// ================================
// PAGE LOAD — Init everything
// OPTIMIZED: Three.js loaded AFTER page is interactive
// Everything else deferred to DOMContentLoaded
// ================================
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initHeaderScroll();
  initSmoothScroll();
  initActiveNavHighlight();
  initCustomCursor();
  initParallaxOrbs();
  initStatsAnimation();
  initCardTilt();
});

// Three.js deferred to after full page load (images, fonts done)
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  // Small delay so LCP is already painted before heavy WebGL init
  setTimeout(loadThreeJS, 200);
});

console.log(
  "%c👋 Welcome to Muhammad's Portfolio!",
  "color:#6366f1;font-size:18px;font-weight:bold"
);
