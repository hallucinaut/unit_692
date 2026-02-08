// Theme toggle utility
export function initThemeToggle() {
	const html = document.documentElement;
	const checkbox = document.getElementById('theme-toggle');

	// Load theme from localStorage or default to light
	const theme = localStorage.getItem('theme') || 'light';
	html.setAttribute('data-theme', theme);
	checkbox.checked = theme === 'dark';

	// Toggle theme on change
	checkbox.addEventListener('change', () => {
		const newTheme = checkbox.checked ? 'dark' : 'light';
		html.setAttribute('data-theme', newTheme);
		localStorage.setItem('theme', newTheme);
	});
}
