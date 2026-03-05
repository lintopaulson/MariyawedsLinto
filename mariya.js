/* =========================
   COUNTDOWN TIMER
========================= */
const weddingDate = new Date("April 29, 2026 16:00:00").getTime();

const timer = setInterval(() => {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;

  if (distance < 0) {
    clearInterval(timer);
    document.getElementById("countdown").textContent = "TODAY IS THE DAY!";
  }
}, 1000);



/* =========================
   GSAP HERO ANIMATION
========================= */
gsap.to(".hero-content", {
  opacity: 1,
  y: 0,
  duration: 1.5,
  ease: "power3.out",
  delay: 0.4
});

gsap.from(".monogram", {
  scale: 0.7,
  opacity: 0,
  duration: 1.2,
  ease: "back.out(1.7)"
});


/* =========================
   PARALLAX BACKGROUND
========================= */
const bg = document.querySelector(".hero-bg");

document.addEventListener("mousemove", (e) => {
  if (!bg) return;
  let x = (e.clientX / window.innerWidth - 0.5) * 20;
  let y = (e.clientY / window.innerHeight - 0.5) * 20;

  gsap.to(bg, {
    x,
    y,
    duration: 1.2,
    ease: "power3.out"
  });
});


/* =========================
   SCROLL TO DETAILS
========================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});


/* =========================
   FLOATING AUDIO CONTROL (ANDROID & IOS FIX)
========================= */

const music = document.getElementById("music");
const toggle = document.getElementById("soundToggle");
const icon = toggle ? toggle.querySelector("i") : null;

let isPlaying = false;

// Function to attempt playing
async function playMusic() {
  if (music && !isPlaying) {
    try {
      // Unmute and play
      music.muted = false;
      await music.play();
      isPlaying = true;

      // Update UI
      if (icon) {
        icon.classList.remove("fa-volume-xmark");
        icon.classList.add("fa-volume-high");
      }

      // Cleanup listeners once playing successfully
      document.removeEventListener("click", playMusic);
      document.removeEventListener("touchstart", playMusic);
      document.removeEventListener("scroll", playMusic);
    } catch (err) {
      console.log("Waiting for user interaction to play audio...");
    }
  }
}

// Android/iOS: Unlock audio on any interaction
document.addEventListener("click", playMusic);
document.addEventListener("touchstart", playMusic);
document.addEventListener("scroll", playMusic, { passive: true });

// Toggle mute/unmute
if (toggle && music && icon) {
  toggle.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent triggering the playMusic listeners

    if (music.paused) {
      music.play();
      music.muted = false;
      icon.classList.replace("fa-volume-xmark", "fa-volume-high");
      isPlaying = true;
    } else {
      music.muted = !music.muted;
      if (music.muted) {
        icon.classList.replace("fa-volume-high", "fa-volume-xmark");
      } else {
        icon.classList.replace("fa-volume-xmark", "fa-volume-high");
      }
    }
  });
}

// Android Chrome "Unfreeze" - ensures audio plays when returning to tab
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && isPlaying) {
    music.play().catch(() => {});
  }
});


/* =========================
   RING ❤️ LETTER PRELOADER
========================= */

window.addEventListener("load", () => {

  const ring = document.querySelector(".ring");
  const heart = document.querySelector(".pre-heart");
  const letterL = document.querySelector(".letter-l");
  const letterM = document.querySelector(".letter-m");
  const percent = document.getElementById("loadPercent");
  const heroMonogram = document.querySelector(".monogram");
  const preloader = document.getElementById("preloader");
  const scene = document.querySelector(".ring-scene");

  if (!ring || !heroMonogram || !preloader) return;

  /* loading percentage */
  let progress = { value: 0 };

  gsap.to(progress, {
    value: 100,
    duration: 2.8,
    ease: "power1.out",
    onUpdate: () => percent.textContent = Math.floor(progress.value)
  });

  /* cinematic timeline */
  const tl = gsap.timeline();

  /* ring drop */
  tl.from(ring, {
    y: -350,
    opacity: 0,
    duration: 1,
    ease: "bounce.out"
  })

  /* glow hit impact */
  .to(ring, {
    boxShadow: "0 0 50px rgba(212,178,92,1)",
    duration: 0.3,
    yoyo: true,
    repeat: 1
  })

  /* ❤️ HEART APPEARS */
  .to(heart, {
    scale: 1,
    duration: 0.4,
    ease: "back.out(2)"
  })

  /* cinematic heartbeat */
  .to(heart, { scale: 1.3, duration: 0.25 })
  .to(heart, { scale: 1, duration: 0.2 })
  .to(heart, { scale: 1.2, duration: 0.2 })
  .to(heart, { scale: 1, duration: 0.25 })

  /* letters reveal AFTER heart */
  .to(letterL, {
    x: -20,
    opacity: 1,
    duration: 0.6,
    ease: "power3.out"
  })

  .to(letterM, {
    x: 20,
    opacity: 1,
    duration: 0.6,
    ease: "power3.out"
  }, "-=0.6")

  /* subtle settle */
  .to(scene, {
    scale: 0.92,
    duration: 0.4
  });

  /* === ALIGN PERFECTLY TO HERO MONOGRAM === */

  const heroRect = heroMonogram.getBoundingClientRect();
  const sceneRect = scene.getBoundingClientRect();

  const dx = heroRect.left + heroRect.width/2 - (sceneRect.left + sceneRect.width/2);
  const dy = heroRect.top + heroRect.height/2 - (sceneRect.top + sceneRect.height/2);

  tl.to(scene, {
    x: dx,
    y: dy,
    scale: heroRect.width / sceneRect.width,
    duration: 1.2,
    ease: "power3.inOut"
  })

  /* reveal hero monogram */
  .to(heroMonogram, { opacity: 1, duration: 0.4 }, "-=0.6")

  /* hide preloader */
  .to(preloader, {
    opacity: 0,
    duration: 0.6,
    pointerEvents: "none"
  });

});


