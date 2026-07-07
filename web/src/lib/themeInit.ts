function applyTheme() {
  try {
    let theme = localStorage.getItem("ws-theme");
    if (theme !== "light" && theme !== "dark") {
      theme = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    document.documentElement.dataset.theme = theme;
  } catch {
    document.documentElement.dataset.theme = "dark";
  }
}

applyTheme();
document.addEventListener("astro:after-swap", applyTheme);
