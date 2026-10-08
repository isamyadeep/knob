/**
 * Knob – Light Mode for YouTube Music — content script
 * Handles theme switching by observing and overriding attributes on <html>.
 */
(() => {
  'use strict';

  if (window.__knobLoaded) return;
  window.__knobLoaded = true;

  const MODES = ['light', 'system', 'off'];
  const DEFAULT_MODE = 'light';
  const LEGACY_MODES = { auto: 'system', dark: 'system' };

  const MIRROR_KEY = '__knob';
  const STORAGE_KEY = 'mode';

  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  let mode = readMirror() ?? DEFAULT_MODE;
  let resolved = resolve(mode);

  // ---------------------------------------------------------------- helpers

  function resolve(value) {
    if (value === 'off') return 'off';
    return value === 'system' && prefersDark.matches ? 'dark' : 'light';
  }

  function normalise(stored) {
    if (MODES.includes(stored)) return stored;
    return LEGACY_MODES[stored] ?? null;
  }

  function readMirror() {
    try {
      const stored = window.localStorage.getItem(MIRROR_KEY);
      return normalise(stored);
    } catch {
      return null;
    }
  }

  function writeMirror(value) {
    try {
      window.localStorage.setItem(MIRROR_KEY, value);
    } catch {
      /* storage cache failed; chrome.storage remains the source of truth */
    }
  }

  // ---------------------------------------------------------------- logo

  const LOGO_SRC = 'https://music.youtube.com/img/on_platform_logo_dark.svg';
  const LOGO_LIGHT = "<svg width=\"77\" height=\"26\" viewBox=\"0 0 77 26\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"> <g clip-path=\"url(#clip0_1_16)\"> <mask id=\"mask0_1_16\" style=\"mask-type:luminance\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"77\" height=\"26\"> <path d=\"M0 0H77V26H0V0Z\" fill=\"white\"/> </mask> <g mask=\"url(#mask0_1_16)\"> <path d=\"M30.112 21.8671H32.432V14.5771C32.432 12.5371 32.392 10.3671 32.232 7.46715H32.492L32.922 9.24715L35.662 21.8671H38.022L40.712 9.24715L41.182 7.46715H41.422C41.302 10.0371 41.232 12.3571 41.232 14.5771V21.8671H43.562V5.06715H39.602L38.182 11.2771C37.582 13.8571 37.152 17.0571 36.902 18.6871H36.712C36.532 17.0271 36.082 13.8371 35.492 11.2971L34.032 5.06715H30.112V21.8671Z\" fill=\"black\"/> <path d=\"M48.202 22.0571C49.662 22.0571 50.572 21.4471 51.322 20.3471H51.432L51.542 21.8671H53.532V9.50715H50.892V19.4371C50.612 19.9271 49.962 20.2871 49.352 20.2871C48.582 20.2871 48.342 19.6771 48.342 18.6571V9.50715H45.712V18.7771C45.712 20.7871 46.292 22.0571 48.202 22.0571Z\" fill=\"black\"/> <path d=\"M58.7536 22.1271C61.1736 22.1271 62.5236 21.0571 62.5236 18.8671C62.5236 16.8771 61.5236 16.0671 59.1436 14.4471C58.0536 13.7271 57.4636 13.2771 57.4636 12.2171C57.4636 11.4271 57.9536 11.0071 58.8436 11.0071C59.8136 11.0071 60.1436 11.6471 60.1836 13.4671L62.3436 13.3471C62.5236 10.4971 61.5036 9.27715 58.8836 9.27715C56.4036 9.27715 55.2136 10.3471 55.2136 12.4671C55.2136 14.4271 56.1436 15.3171 57.8936 16.5371C59.4436 17.6071 60.2936 18.2771 60.2936 19.1671C60.2936 19.8971 59.7836 20.4271 58.8936 20.4271C57.8736 20.4271 57.2936 19.5471 57.3936 18.2171L55.2036 18.2571C54.8636 20.8171 56.0636 22.1271 58.7536 22.1271Z\" fill=\"black\"/> <path d=\"M65.387 7.93715C66.287 7.93715 66.707 7.63715 66.707 6.39715C66.707 5.23715 66.257 4.87715 65.387 4.87715C64.507 4.87715 64.077 5.19715 64.077 6.39715C64.077 7.63715 64.487 7.93715 65.387 7.93715ZM64.167 21.8671H66.697V9.50715H64.167V21.8671Z\" fill=\"black\"/> <path d=\"M72.3428 22.0671C73.6028 22.0671 74.3128 21.9172 74.8828 21.3771C75.7328 20.6371 76.0828 19.4871 76.0228 17.5471L73.7128 17.4271C73.7128 19.5471 73.3728 20.3471 72.3828 20.3471C71.2928 20.3471 71.1128 19.1571 71.1128 16.9971V14.4371C71.1128 12.0771 71.3428 10.9571 72.4028 10.9571C73.2828 10.9571 73.6328 11.6971 73.6328 14.0571L75.9228 13.8971C76.0828 12.2071 75.9128 10.8271 75.1128 10.0571C74.5128 9.49715 73.6228 9.27715 72.4428 9.27715C69.4128 9.27715 68.4728 11.1971 68.4728 14.8471V16.5371C68.4728 20.1871 69.1828 22.0671 72.3428 22.0671Z\" fill=\"black\"/> <path d=\"M13 26C20.176 26 26 20.176 26 13C26 5.824 20.176 0 13 0C5.824 0 0 5.824 0 13C0 20.176 5.824 26 13 26Z\" fill=\"#FF0033\"/> <path d=\"M20.5 13C20.5 17.1439 17.1439 20.5 13 20.5C8.85614 20.5 5.5 17.1439 5.5 13C5.5 8.85614 8.85614 5.5 13 5.5C17.1439 5.5 20.5 8.85614 20.5 13Z\" stroke=\"white\"/> <path d=\"M17.75 13L10.25 8.75V17.25L17.75 13Z\" fill=\"white\"/> </g> </g> <defs> <clipPath id=\"clip0_1_16\"> <rect width=\"77\" height=\"26\" fill=\"white\"/> </clipPath> </defs> </svg>";
  const LOGO_LIGHT_SRC = 'data:image/svg+xml,' + encodeURIComponent(LOGO_LIGHT);

  function paintLogo() {
    const logos = () => document.querySelectorAll(
      'img[src*="on_platform_logo"], img[data-ytm-logo]',
    );

    if (resolved === 'off') {
      for (const img of logos()) {
        if (!img.dataset.ytmLogo) continue;
        delete img.dataset.ytmLogo;
        img.src = LOGO_SRC;
      }
      return;
    }

    const want = resolved === 'light' ? LOGO_LIGHT_SRC : LOGO_SRC;
    for (const img of logos()) {
      if (img.dataset.ytmLogo === want) continue;
      img.dataset.ytmLogo = want;
      img.src = want;
    }
  }

  // ---------------------------------------------------------------- theming

  function applyTheme(options = {}) {
    resolved = resolve(mode);

    if (resolved === 'off') {
      root.removeAttribute('light');
      if (!root.hasAttribute('dark')) root.setAttribute('dark', '');
      root.classList.remove(
        'ytm-theme-light',
        'ytm-theme-dark',
        'ytm-theme-force-light',
        'ytm-theme-force-dark',
      );
      paintLogo();
      scheduleSelfCheck();
      return;
    }

    if (resolved === 'dark') {
      root.setAttribute('dark', '');
      root.removeAttribute('light');
      root.classList.add('ytm-theme-dark');
      root.classList.remove('ytm-theme-light');
      paintLogo();
    } else {
      root.removeAttribute('dark');
      root.setAttribute('light', 'true');
      root.classList.add('ytm-theme-light');
      root.classList.remove('ytm-theme-dark');
      paintLogo();
    }

    scheduleSelfCheck();
  }

  // Guard against YouTube resetting the DOM theme attributes.
  const themeGuard = new MutationObserver(() => {
    if (mode === 'off') return;

    const wantsDark = resolved === 'dark';
    const isDark = root.hasAttribute('dark');
    if (wantsDark !== isDark) applyTheme();
  });

  themeGuard.observe(root, {
    attributes: true,
    attributeFilter: ['dark', 'light'],
  });

  // ---------------------------------------------------------------- persistence

  function setMode(next, options = {}) {
    next = normalise(next);
    if (!next) return;
    mode = next;
    writeMirror(mode);
    applyTheme(options);
    chrome.storage.sync.set({ [STORAGE_KEY]: mode });
  }

  chrome.storage.sync.get({ [STORAGE_KEY]: DEFAULT_MODE }, (items) => {
    const raw = items?.[STORAGE_KEY];
    const stored = normalise(raw);
    if (stored && stored !== mode) {
      mode = stored;
      writeMirror(mode);
      applyTheme();
    }
    if (raw !== undefined && raw !== stored) {
      chrome.storage.sync.set({ [STORAGE_KEY]: stored ?? DEFAULT_MODE });
    }
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    const next = normalise(changes[STORAGE_KEY]?.newValue);
    if (next && next !== mode) {
      mode = next;
      writeMirror(mode);
      applyTheme();
    }
  });

  prefersDark.addEventListener('change', () => {
    if (mode === 'system') applyTheme();
  });

  // ---------------------------------------------------------------- self-check

  let selfCheckTimer = null;

  function scheduleSelfCheck() {
    clearTimeout(selfCheckTimer);
    selfCheckTimer = setTimeout(runSelfCheck, 400);
  }

  function runSelfCheck() {
    if (!document.body) return;
    paintLogo();

    if (mode === 'off') return;

    const background = getComputedStyle(document.body).backgroundColor;
    const luminance = perceivedLuminance(background);
    if (luminance === null) return;

    const looksDark = luminance < 0.35;
    const wantsDark = resolved === 'dark';

    root.classList.toggle('ytm-theme-force-light', !wantsDark && looksDark);
    root.classList.toggle('ytm-theme-force-dark', wantsDark && !looksDark);
  }

  function perceivedLuminance(rgb) {
    const match = rgb.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const parts = match[1].split(',').map((part) => parseFloat(part));
    if (parts.length < 3 || parts.some(Number.isNaN)) return null;
    if (parts.length === 4 && parts[3] < 0.1) return null;
    const [r, g, b] = parts.map((channel) => {
      const normalised = channel / 255;
      return normalised <= 0.03928
        ? normalised / 12.92
        : Math.pow((normalised + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleSelfCheck, { once: true });
  } else {
    scheduleSelfCheck();
  }
  window.addEventListener('load', scheduleSelfCheck, { once: true });

  // ---------------------------------------------------------------- messages

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === 'ytm:setMode') {
      setMode(message.mode, { animate: message.animate === true });
      sendResponse({ ok: true, mode });
      return true;
    }
    if (message?.type === 'ytm:getMode') {
      sendResponse({ ok: true, mode });
      return true;
    }
    return false;
  });

  applyTheme();
})();