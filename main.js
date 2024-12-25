document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("textContainer");
  const lines = [
    "Thankyou Tanu...😊",
    "for being with me....",
    "I know its been 3 months,",
    "of sharing our feelings🥰",
    "so today....",
    "i present you this small gift...",
    "I ❣️ U",
    "😊🥰",
  ];

  let currentLine = 0;

  const animateLine = (line) => {
    container.innerHTML = ""; // Clear previous content
    container.style.visibility = "visible"; // Make container visible

    // Create spans for each letter and set their fade-in animation
    line.split("").forEach((letter, index) => {
      const span = document.createElement("span");
      container.appendChild(span);
      span.textContent = letter;
      span.style.animation = `fadeIn 0.5s ease-in forwards`;
      span.style.animationDelay = `${index * 0.1}s`;
      // Add a non-breaking space for spaces
      if (letter === " ") {
        span.innerHTML = "&nbsp;"; // HTML entity for a non-breaking space
      }
    });

    // Calculate total time for fade-in and pause after all letters have appeared
    const totalTime = line.length * 0.1 * 1000 + 1000;

    // Fade out the line after the total time
    setTimeout(() => fadeOutLine(), totalTime);
  };

  const fadeOutLine = () => {
    const spans = container.querySelectorAll("span");

    // Set fade-out animation for each letter
    spans.forEach((span, index) => {
      span.style.animation = `fadeOut 0.5s ease-out forwards`;
      span.style.animationDelay = `${index * 0.05}s`;
    });

    // Wait for fade-out to complete before proceeding
    setTimeout(() => {
      if (currentLine < lines.length - 1) {
        // Show the next line
        currentLine += 1;
        animateLine(lines[currentLine]);
      } else {
        // Hide the container when all lines are finished
        document.getElementById("loader").style.display = "none";
        document.getElementById("skip").style.display = "none";
      }
    }, spans.length * 0.05 * 1000 + 1100);
  };

  // Start the animation with the first line
  animateLine(lines[currentLine]);
});

function skip() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("skip").style.display = "none";
}

class Pixel {
  constructor(canvas, context, x, y, color, speed, delay) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.5;
    this.maxSizeInteger = 2;
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  getRandomValue(min, max) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;

    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size
    );
  }

  appear() {
    this.isIdle = false;

    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }

    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }

    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }

    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;

    if (this.size <= 0) {
      this.isIdle = true;
      return;
    } else {
      this.size -= 0.1;
    }

    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }

    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

class PixelCanvas extends HTMLElement {
  static register(tag = "pixel-canvas") {
    if ("customElements" in window) {
      customElements.define(tag, this);
    }
  }

  static css = `
      :host {
        display: grid;
        inline-size: 100%;
        block-size: 100%;
        overflow: hidden;
      }
    `;

  get colors() {
    return this.dataset.colors?.split(",") || ["#f8fafc", "#f1f5f9", "#cbd5e1"];
  }

  get gap() {
    const value = this.dataset.gap || 5;
    const min = 4;
    const max = 50;

    if (value <= min) {
      return min;
    } else if (value >= max) {
      return max;
    } else {
      return parseInt(value);
    }
  }

  get speed() {
    const value = this.dataset.speed || 35;
    const min = 0;
    const max = 100;
    const throttle = 0.001;

    if (value <= min || this.reducedMotion) {
      return min;
    } else if (value >= max) {
      return max * throttle;
    } else {
      return parseInt(value) * throttle;
    }
  }

  get noFocus() {
    return this.hasAttribute("data-no-focus");
  }

  connectedCallback() {
    const canvas = document.createElement("canvas");
    const sheet = new CSSStyleSheet();

    this._parent = this.parentNode;
    this.shadowroot = this.attachShadow({ mode: "open" });

    sheet.replaceSync(PixelCanvas.css);

    this.shadowroot.adoptedStyleSheets = [sheet];
    this.shadowroot.append(canvas);
    this.canvas = this.shadowroot.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.timeInterval = 1000 / 60;
    this.timePrevious = performance.now();
    this.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    this.init();
    this.resizeObserver = new ResizeObserver(() => this.init());
    this.resizeObserver.observe(this);

    this._parent.addEventListener("mouseenter", this);
    this._parent.addEventListener("mouseleave", this);

    if (!this.noFocus) {
      this._parent.addEventListener("focusin", this);
      this._parent.addEventListener("focusout", this);
    }
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
    this._parent.removeEventListener("mouseenter", this);
    this._parent.removeEventListener("mouseleave", this);

    if (!this.noFocus) {
      this._parent.removeEventListener("focusin", this);
      this._parent.removeEventListener("focusout", this);
    }

    delete this._parent;
  }

  handleEvent(event) {
    this[`on${event.type}`](event);
  }

  onmouseenter() {
    this.handleAnimation("appear");
  }

  onmouseleave() {
    this.handleAnimation("disappear");
  }

  onfocusin(e) {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    this.handleAnimation("appear");
  }

  onfocusout(e) {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    this.handleAnimation("disappear");
  }

  handleAnimation(name) {
    cancelAnimationFrame(this.animation);
    this.animation = this.animate(name);
  }

  init() {
    const rect = this.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    this.pixels = [];
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.createPixels();
  }

  getDistanceToCanvasCenter(x, y) {
    const dx = x - this.canvas.width / 2;
    const dy = y - this.canvas.height / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance;
  }

  createPixels() {
    for (let x = 0; x < this.canvas.width; x += this.gap) {
      for (let y = 0; y < this.canvas.height; y += this.gap) {
        const color =
          this.colors[Math.floor(Math.random() * this.colors.length)];
        const delay = this.reducedMotion
          ? 0
          : this.getDistanceToCanvasCenter(x, y);

        this.pixels.push(
          new Pixel(this.canvas, this.ctx, x, y, color, this.speed, delay)
        );
      }
    }
  }

  animate(fnName) {
    this.animation = requestAnimationFrame(() => this.animate(fnName));

    const timeNow = performance.now();
    const timePassed = timeNow - this.timePrevious;

    if (timePassed < this.timeInterval) return;

    this.timePrevious = timeNow - (timePassed % this.timeInterval);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.pixels.length; i++) {
      this.pixels[i][fnName]();
    }

    if (this.pixels.every((pixel) => pixel.isIdle)) {
      cancelAnimationFrame(this.animation);
    }
  }
}

PixelCanvas.register();

function zoom(card) {
  // Get the card id
  card_id = card.id;
  console.log(card_id);

  // Apply styles to the clicked card to zoom and center it
  let opacity = 1;
  const clickedCard = document.getElementById(card_id);
  setTimeout(function () {
    clickedCard.style.transition = "0.5s ease-out";
    document.getElementById("main").style.setProperty("--count", 1);
    document.getElementById("main").style.setProperty("--max", "15rem");
    clickedCard.style.transform = "scale(1.3)";
    // Scale the clicked card back after 0.5s
    setTimeout(function () {
      clickedCard.style.transform = "scale(1.25)";
      setTimeout(function () {
        const fadeEffect = setInterval(() => {
          if (opacity <= 0) {
            clearInterval(fadeEffect); // Stop when fully transparent
            clickedCard.style.display = "none"; // Optionally hide the element
            setTimeout(function () {
              if (card.id == "card1") {
                window.location = "chat.html";
              } else if (card.id == "card2") {
                window.location = "img.html";
              } else if (card.id == "card3") {
                window.location = "old.html";
              }
            }, 300);
          } else {
            opacity -= 0.05; // Decrease opacity
            clickedCard.style.opacity = opacity; // Update element opacity
          }
        }, 50);
      }, 1500);
    }, 500);

    // Get all card elements
    const cards = document.querySelectorAll(".card");

    // Loop through all cards and scale the others to 0
    cards.forEach(function (otherCard) {
      if (otherCard.id !== card_id) {
        // Skip the clicked card
        otherCard.style.transition = "0.5s ease-out";
        otherCard.style.transform = "scale(0)";
        otherCard.style.display = "none";
      }
    });
  }, 800);
}
