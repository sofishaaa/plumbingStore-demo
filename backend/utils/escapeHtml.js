const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

// Екранування даних користувача перед вставкою в HTML (листи, meta-теги)
const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);

export default escapeHtml;
