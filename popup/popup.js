/**
 * Knob – Light Mode for YouTube Music — popup
 * Manages UI interactions and syncs preference to chrome.storage.
 */
(() => {
  'use strict';

  const MODES = ['light', 'system', 'off'];
  const DEFAULT_MODE = 'light';
  const YTM_ORIGIN = 'https://music.youtube.com';
  const LEGACY_MODES = { auto: 'system', dark: 'system' };

  function normalise(stored) {
    if (MODES.includes(stored)) return stored;
    return LEGACY_MODES[stored] ?? null;
  }

  const radios = Array.from(document.querySelectorAll('input[name="mode"]'));
  const dial = document.getElementById('knob-dial');
  const knob = document.querySelector('.knob');
  const status = document.getElementById('status');

  let current = DEFAULT_MODE;

  async function broadcast(mode) {
    const tabs = await chrome.tabs.query({ url: `${YTM_ORIGIN}/*` });
    await Promise.all(
      tabs.map((tab) =>
        chrome.tabs
          .sendMessage(tab.id, { type: 'ytm:setMode', mode })
          .catch(() => {}),
      ),
    );
    return tabs.length;
  }

  function showStatus(text) {
    status.textContent = text;
  }

  function paint(mode) {
    document.body.dataset.mode = mode;
  }

  function select(mode) {
    current = mode;
    radios.forEach((radio) => {
      radio.checked = radio.value === mode;
    });
    paint(mode);
  }

  async function commit(mode) {
    select(mode);
    await chrome.storage.sync.set({ mode });

    let tabCount = 0;
    try {
      tabCount = await broadcast(mode);
    } catch {
      // Ignore broadcast errors
    }

    showStatus(
      tabCount === 0
        ? 'Open music.youtube.com to see the change.'
        : `Updated ${tabCount} YouTube Music tab${tabCount === 1 ? '' : 's'}.`,
    );
  }

  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      if (radio.checked) commit(radio.value);
    });
  });

  function advance() {
    commit(MODES[(MODES.indexOf(current) + 1) % MODES.length]);
  }

  knob.addEventListener('pointerdown', () => {
    knob.dataset.pointer = '';
  });

  document.addEventListener('keydown', () => {
    delete knob.dataset.pointer;
  }, true);

  dial.addEventListener('click', () => {
    advance();
    const checked = radios.find((radio) => radio.checked);
    if (checked) checked.focus();
  });

  document.addEventListener('keydown', (event) => {
    if (!event.key.startsWith('Arrow')) return;
    const checked = radios.find((radio) => radio.checked);
    if (!checked) return;
    paint(checked.value);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    const next = normalise(changes.mode?.newValue);
    if (next) select(next);
  });

  (async function init() {
    let mode = DEFAULT_MODE;
    try {
      const stored = await chrome.storage.sync.get({ mode: DEFAULT_MODE });
      mode = normalise(stored.mode) ?? DEFAULT_MODE;
      if (stored.mode !== mode) {
        chrome.storage.sync.set({ mode });
      }
    } catch {
      // Fallback to default
    }
    select(mode);
  })();
})();