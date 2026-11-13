/* =====================================
   ALR STEEL DIGITAL CARD — MARKETING EDITION
   Editable personal information
===================================== */

const CONFIG = {
  name: "Jenny Joven Beria",
  title: "Sales Representative",
  organization: "ALR Steel Fabrication and Services OPC",
  phone: "0993 323 4360", // Also update CONTACT in contact.js
  email: "alr_kitssa@yahoo.com", // Also update CONTACT in contact.js
  website: "", // Add the business website, or leave blank

  // Paste the public https link of this page after you host the folder.
  // Example: "https://yourname.github.io/my-digital-card/index.html"
  publicUrl: ""
};

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =====================================
   WORK CAROUSEL (horizontal swipe)
===================================== */

const carousel = document.getElementById("workCarousel");
const dots = [...document.querySelectorAll(".work-dot")];

function getSlides() {
  if (!carousel) return [];
  return [...carousel.querySelectorAll(".slide")];
}

function getCurrentSlide() {
  const slides = getSlides();
  if (!slides.length) return 0;

  const center = carousel.scrollLeft + carousel.clientWidth / 2;
  let best = 0;
  let bestDistance = Infinity;

  slides.forEach((slide, index) => {
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    const distance = Math.abs(slideCenter - center);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = index;
    }
  });

  return best;
}

function goToSlide(index) {
  const slides = getSlides();
  if (!slides.length) return;

  const total = slides.length;
  const safeIndex = ((index % total) + total) % total;
  const slide = slides[safeIndex];

  carousel.scrollTo({
    left: slide.offsetLeft - (carousel.clientWidth - slide.clientWidth) / 2,
    behavior: REDUCED_MOTION ? "auto" : "smooth"
  });

  updateDots(safeIndex);
}

function updateDots(index = getCurrentSlide()) {
  dots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === index;
    dot.classList.toggle("active", isActive);
    if (isActive) {
      dot.setAttribute("aria-current", "true");
    } else {
      dot.removeAttribute("aria-current");
    }
  });
}

if (carousel) {
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      goToSlide(Number(dot.dataset.slide));
    });
  });

  carousel.querySelectorAll(".slide-next").forEach((button) => {
    button.addEventListener("click", () => {
      goToSlide(getCurrentSlide() + 1);
    });
  });

  let scrollFrame;
  carousel.addEventListener("scroll", () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => updateDots());
  }, { passive: true });

  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") goToSlide(getCurrentSlide() + 1);
    if (event.key === "ArrowLeft") goToSlide(getCurrentSlide() - 1);
  });

  updateDots(0);
}

/* =====================================
   SCROLL REVEAL — fade sections in
===================================== */

const revealTargets = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && !REDUCED_MOTION) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("visible"));
}

/* =====================================
   COUNT-UP STATS
===================================== */

const statNums = document.querySelectorAll(".stat-num");

function animateCount(element) {
  const target = Number(element.dataset.target || 0);
  const suffix = element.dataset.suffix || "";

  if (REDUCED_MOTION || target <= 0) {
    element.textContent = target + suffix;
    return;
  }

  const duration = 1400;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
    element.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

if ("IntersectionObserver" in window && !REDUCED_MOTION) {
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNums.forEach((stat) => statObserver.observe(stat));
} else {
  statNums.forEach((stat) => animateCount(stat));
}

/* =====================================
   SAVE CONTACT — opens the contact page
===================================== */

/* ---------- SAVE CONTACT ----------
   Tapping either Save button now saves the FULL business contact
   (name, company, job title, mobile, Viber and email) straight to
   the phone. In-app browsers cannot download files, so those
   visitors are sent to contact.html, which explains what to do. */

const saveButton = document.getElementById("saveContact");
const quickSave = document.getElementById("quickSave");
const saveMessage = document.getElementById("saveMessage");
const ALL_CONTACTS_VCF = "Jenny-Joven-Beria-ALR.vcf";

function openContactPage() {
  window.location.href = "contact.html";
}

function isIOS() {
  const ua = navigator.userAgent || "";
  return /iPad|iPhone|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && (navigator.maxTouchPoints || 0) > 1);
}

function isAndroid() {
  return /android/i.test(navigator.userAgent || "");
}

function detectInApp() {
  const ua = navigator.userAgent || "";
  if (window.navigator.standalone === true) return false;
  if (/FBAN|FBAV|FB_IAB|FB4A|Instagram|Line\/|Snapchat|TikTok|Musical\.ly|Pinterest/i.test(ua)) return true;
  return /; wv\)/.test(ua); // Android WebView
}

function say(message) {
  if (saveMessage) saveMessage.textContent = message;
}

async function downloadVcf(url, filename) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return "missing";
    const blob = new Blob([await response.text()], { type: "text/vcard;charset=utf-8" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
    return "ok";
  } catch (error) {
    return "error";
  }
}

async function saveAllContacts() {
  say("Preparing contact…");
  const result = await downloadVcf(ALL_CONTACTS_VCF, ALL_CONTACTS_VCF);

  if (result === "ok") {
    if (isIOS()) {
      say("Tap \u201CAdd All Contacts\u201D to save Jenny to your phone.");
    } else if (isAndroid()) {
      say("File saved - tap Open File to import it into Contacts.");
    } else {
      say("Contact file downloading. Open it to save the contact.");
    }
    return;
  }

  /* The contact file is missing on the server: say so instead of
     silently bouncing the visitor to another page. */
  if (result === "missing") {
    say("Contact file not found on the server - upload Jenny-Joven-Beria-ALR.vcf next to index.html.");
    return;
  }

  /* Blob download was blocked (in-app browser, or opened from a file).
     Hand the file to the browser directly - never redirect to
     contact.html from here, the visitor asked to SAVE. */
  window.location.href = ALL_CONTACTS_VCF;

  if (detectInApp()) {
    say("If nothing downloads, open this card in " + (isIOS() ? "Safari" : "Chrome") +
        " (tap \u22EF above) and tap Save again.");
  } else {
    say("Contact file downloading. Open it to save the contact.");
  }
}

if (saveButton) saveButton.addEventListener("click", saveAllContacts);
if (quickSave) quickSave.addEventListener("click", saveAllContacts);

/* =====================================
   SHARE CARD
===================================== */

const shareButton = document.getElementById("shareCard");
const shareMessage = document.getElementById("shareMessage");

function cardUrl() {
  const configured = (CONFIG.publicUrl || "").trim();
  if (/^https:\/\//i.test(configured)) return configured;
  return window.location.href;
}

function setShareMessage(message) {
  if (shareMessage) {
    shareMessage.textContent = message;
    shareMessage.setAttribute("role", "status");
  }
}

if (shareButton) {
  shareButton.addEventListener("click", async () => {
    const url = cardUrl();
    const shareData = {
      title: CONFIG.name + " | ALR Steel Fabrication",
      text: "Connect with " + CONFIG.name + " — " + CONFIG.organization,
      url: url
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareMessage("Thanks for sharing!");
      } catch (error) {
        if (error && error.name !== "AbortError") {
          setShareMessage("Share was blocked by the browser.");
        }
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareMessage("Card link copied — paste it anywhere to share.");
    } catch (error) {
      setShareMessage("Copy this page address to share the card.");
    }
  });
}

/* =====================================
   FOOTER YEAR
===================================== */

const year = document.getElementById("currentYear");
if (year) year.textContent = new Date().getFullYear();
