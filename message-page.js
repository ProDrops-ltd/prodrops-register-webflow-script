const handler = (event) => {
  const searchParams = new URLSearchParams(window.location.search);

  const titleText = decodeURIComponent(searchParams.get("title"));
  const subtitleText = decodeURIComponent(searchParams.get("subtitle"));
  const actionText = decodeURIComponent(searchParams.get("actionText"));
  const actionUrl = decodeURIComponent(searchParams.get("actionUrl"));

  const title = document.getElementById("title");
  const subtitle = document.getElementById("subtitle");
  const button = document.getElementById("cta-button");

  title.innerText = titleText;
  subtitle.innerText = subtitleText;
  button.innerText = actionText;

  if (actionUrl) {
    button.addEventListener("click", () => {
      window.href = actionUrl;
    });
  }
};

addEventListener("load", handler);
