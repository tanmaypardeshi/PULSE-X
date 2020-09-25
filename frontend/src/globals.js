let context = "PROD"; //TEST (for testing) and PROD (for Production)

export const APP_HOST_NAME =
  context === "PROD"
    ? ""
    : window.location.hostname === "localhost"
    ? "http://localhost:8000/api"
    : "https://api.pulsex.tk/api";

