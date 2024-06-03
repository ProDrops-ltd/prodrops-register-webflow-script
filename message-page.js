const handler = (_event) => {
  const searchParams = new URLSearchParams(window.location.search);

  const titleText = decodeURIComponent(searchParams.get("title") || "");
  const subtitleText = decodeURIComponent(searchParams.get("subtitle") || "");
  const deepLink = decodeURIComponent(searchParams.get("deepLink") || "");

  const title = document.getElementById("title");
  const subtitle = document.getElementById("subtitle");

  if (title instanceof HTMLElement) {
    title.innerText = titleText;
  }

  if (subtitle instanceof HTMLElement) {
    subtitle.innerText = subtitleText;
  }
  if (deepLink) {
    setTimeout(() => {
      window.location.href = deepLink;
    }, 500);
  }
};

addEventListener("DOMContentLoaded", handler);
