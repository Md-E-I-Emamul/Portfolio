// ================================
// THREE.JS HERO ANIMATION
// ================================
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js";

const canvasContainer = document.getElementById("hero-canvas");

if (canvasContainer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  canvasContainer.appendChild(renderer.domElement);

  function resizeRenderer() {
    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight || width;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  resizeRenderer();
  window.addEventListener("resize", resizeRenderer);

  const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  const material = new THREE.MeshStandardMaterial({
    color: 0x7a5cff,
    emissive: 0x4422aa,
    roughness: 0.3,
    metalness: 0.7,
  });

  const torusKnot = new THREE.Mesh(geometry, material);
  scene.add(torusKnot);

  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(20, 20, 20);
  scene.add(light);

  camera.position.z = 40;

  function animate() {
    requestAnimationFrame(animate);
    torusKnot.rotation.x += 0.01;
    torusKnot.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();
}

// ================================
// NAVIGATION (HAMBURGER MENU)
// ================================
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const header = document.querySelector(".header");
const navItems = document.querySelectorAll(".nav-link");

hamburger?.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

navItems.forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
  });
});

document.addEventListener("click", e => {
  if (
    hamburger &&
    navLinks &&
    !hamburger.contains(e.target) &&
    !navLinks.contains(e.target)
  ) {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
  }
});

// ================================
// HEADER SCROLL EFFECT
// ================================
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header?.classList.add("scrolled");
  } else {
    header?.classList.remove("scrolled");
  }
});

// ================================
// SMOOTH SCROLL
// ================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;

    e.preventDefault();
    const offset = target.offsetTop - 80;
    window.scrollTo({
      top: offset,
      behavior: "smooth",
    });
  });
});

// ================================
// ACTIVE NAV LINK ON SCROLL
// ================================
const sections = document.querySelectorAll("section[id]");

function highlightNavLink() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;
    const id = section.getAttribute("id");
    const link = document.querySelector(`.nav-link[href="#${id}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      link?.classList.add("active");
    } else {
      link?.classList.remove("active");
    }
  });
}

window.addEventListener("scroll", highlightNavLink);

// ================================
// CUSTOM CURSOR (DESKTOP ONLY)
// ================================
const isTouchDevice =
  "ontouchstart" in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
  const cursor = document.createElement("div");
  const follower = document.createElement("div");

  cursor.className = "custom-cursor";
  follower.className = "cursor-follower";

  document.body.append(cursor, follower);

  let x = 0,
    y = 0,
    fx = 0,
    fy = 0;

  document.addEventListener("mousemove", e => {
    x = e.clientX;
    y = e.clientY;
    cursor.style.opacity = "1";
    follower.style.opacity = "1";
  });

  function animateCursor() {
    fx += (x - fx) * 0.1;
    fy += (y - fy) * 0.1;

    cursor.style.transform = `translate(${x - 10}px, ${y - 10}px)`;
    follower.style.transform = `translate(${fx - 4}px, ${fy - 4}px)`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

// ================================
// PARALLAX ORBS
// ================================
const orbs = document.querySelectorAll(".gradient-orb");

window.addEventListener("scroll", () => {
  const scrollY = window.pageYOffset;
  orbs.forEach((orb, i) => {
    orb.style.transform = `translateY(${scrollY * (i + 1) * 0.05}px)`;
  });
});

// ================================
// STATS COUNT ANIMATION
// ================================
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
    if (entry.isIntersecting) {
      const el = entry.target;
      animateValue(el, 0, parseInt(el.dataset.value), 2000);
      observer.unobserve(el);
    }
  });
});

document.querySelectorAll(".stat-number").forEach(stat => {
  stat.dataset.value = stat.textContent;
  observer.observe(stat);
});

// ================================
// PROJECT CARD TILT EFFECT
// ================================
document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y - rect.height / 2) / 20;
    const rotateY = (rect.width / 2 - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0)";
  });
});

// ================================
// PAGE LOAD
// ================================
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// ================================
// CONSOLE MESSAGE
// ================================
console.log(
  "%c👋 Welcome to Muhammad's Portfolio!",
  "color:#6366f1;font-size:18px;font-weight:bold"
);
