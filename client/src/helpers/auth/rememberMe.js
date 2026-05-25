const USERNAME_KEY = 'bl_remember_username';
const ENABLED_KEY = 'bl_remember_me';

export function getRememberedLogin() {
  try {
    if (localStorage.getItem(ENABLED_KEY) !== '1') {
      return null;
    }
    const username = localStorage.getItem(USERNAME_KEY);
    if (!username?.trim()) {
      return null;
    }
    return { username: username.trim() };
  } catch {
    return null;
  }
}

export function saveRememberedLogin(username) {
  try {
    const value = String(username ?? '').trim();
    if (!value) {
      return;
    }
    localStorage.setItem(ENABLED_KEY, '1');
    localStorage.setItem(USERNAME_KEY, value);
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearRememberedLogin() {
  try {
    localStorage.removeItem(ENABLED_KEY);
    localStorage.removeItem(USERNAME_KEY);
  } catch {
    /* ignore */
  }
}
