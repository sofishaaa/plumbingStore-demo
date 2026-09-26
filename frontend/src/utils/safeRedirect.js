// Дозволяємо переходити лише на внутрішні шляхи сайту.
// Захист від open redirect: /login?redirect=//evil.com або /\evil.com
export const getSafeRedirect = (value) =>
  typeof value === 'string' &&
  /^\/(?![/\\])/.test(value) &&
  !value.includes('\\')
    ? value
    : '/';
