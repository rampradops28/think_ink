const STORAGE_KEY = 'thinkink-theme';

/**
 * Applies a colour mode by flipping a single `data-theme` attribute on <html>.
 *
 * The previous version wrote five custom properties individually with
 * `style.setProperty`, which meant only those five could ever change between
 * themes - the rest of the palette stayed on its light values. Driving the
 * whole token set from one attribute lets every surface, border and text
 * colour re-theme together.
 */
function setCSSValues(mode) {
	if (mode !== 'dark' && mode !== 'light') {
		console.warn(`Invalid color mode: ${mode}`);
		return;
	}

	document.documentElement.setAttribute('data-theme', mode);

	// Keep the browser UI (form controls, scrollbars) in step.
	const meta = document.querySelector('meta[name="theme-color"]');
	if (meta) meta.setAttribute('content', mode === 'dark' ? '#0f172a' : '#ffffff');

	try {
		localStorage.setItem(STORAGE_KEY, mode);
	} catch {
		// Private browsing or a full quota - the theme just will not persist.
	}
}

/**
 * Resolves the initial mode: an explicit past choice wins, otherwise fall back
 * to the operating system preference.
 */
export function getInitialColorMode() {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'dark' || stored === 'light') return stored;
	} catch {
		// Ignore and fall through to the OS preference.
	}

	return window.matchMedia?.('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
}

export default setCSSValues;
