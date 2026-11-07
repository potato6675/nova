
const urlInput = document.getElementById("urlInput");
const homeInput = document.getElementById("homeInput");
const searchForm = document.getElementById("searchForm");
const homeForm = document.getElementById("homeForm");

const home = document.getElementById("home");
const viewer = document.getElementById("viewer");
const frame = document.getElementById("webFrame");
const frameMessage = document.getElementById("frameMessage");
const externalLink = document.getElementById("externalLink");

let history = [];
let historyIndex = -1;

function getURL(value) {
  value = value.trim();

  if (!value) return null;

  // Search terms go to Google.
  if (!value.includes(".") || value.includes(" ")) {
    return "https://www.google.com/search?q=" +
      encodeURIComponent(value);
  }

  // Add HTTPS if no protocol was provided.
  if (!/^https?:\/\//i.test(value)) {
    value = "https://" + value;
  }

  try {
    return new URL(value).href;
  } catch {
    return "https://www.google.com/search?q=" +
      encodeURIComponent(value);
  }
}

function navigate(value, save = true) {
  const url = getURL(value);
  if (!url) return;

  urlInput.value = url;

  if (save) {
    history = history.slice(0, historyIndex + 1);
    history.push(url);
    historyIndex++;
  }

  home.hidden = true;
  viewer.hidden = false;

  externalLink.href = url;
  frameMessage.style.display = "none";
  frame.style.display = "block";

  // Some websites prevent iframe embedding.
  frame.src = url;
}

searchForm.addEventListener("submit", e => {
  e.preventDefault();
  navigate(urlInput.value);
});

homeForm.addEventListener("submit", e => {
  e.preventDefault();
  navigate(homeInput.value);
});

document.getElementById("back").onclick = () => {
  if (historyIndex > 0) {
    historyIndex--;
    navigate(history[historyIndex], false);
  }
};

document.getElementById("forward").onclick = () => {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    navigate(history[historyIndex], false);
  }
};

document.getElementById("refresh").onclick = () => {
  if (historyIndex >= 0) {
    navigate(history[historyIndex], false);
  }
};

// Show a fallback when a page cannot be embedded.
frame.addEventListener("error", () => {
  frame.style.display = "none";
  frameMessage.style.display = "block";
});

// Timeout fallback for sites that refuse iframe embedding.
function showFallback() {
  if (!viewer.hidden && frame.src) {
    frameMessage.style.display = "block";
  }
}

const fullscreenBtn =
  document.getElementById("fullscreenBtn");

const browser =
  document.querySelector(".browser");

fullscreenBtn.addEventListener("click", () => {
  const isFullscreen =
    browser.classList.toggle("fullscreen");

  fullscreenBtn.textContent =
    isFullscreen ? "⊡" : "⛶";

  fullscreenBtn.title =
    isFullscreen ? "Exit fullscreen" : "Toggle fullscreen";
});