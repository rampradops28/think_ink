/**
 * Lightweight request sanitizer.
 *
 * Replaces the deprecated and unmaintained `xss-clean` package, which also
 * breaks on Express 5 because `req.query` is now a read-only getter.
 *
 * Strips HTML-significant characters from string values in `req.body` and
 * `req.params` so user input can never be reflected as markup, and drops
 * MongoDB operator keys (`$gt`, `$where`, ...) to block query injection.
 */

const ENTITIES = {
	'<': '&lt;',
	'>': '&gt;',
};

// Only the angle brackets are escaped. They are what turns text into markup;
// escaping quotes and slashes as well would store "O&#x27;Brien" for a user
// named O'Brien. React escapes on render, so this is defence in depth rather
// than the only guard.
const escapeString = (value) => value.replace(/[<>]/g, (char) => ENTITIES[char]);

const isPlainObject = (value) =>
	typeof value === 'object' && value !== null && !Buffer.isBuffer(value);

const sanitizeValue = (value, depth = 0) => {
	// Guard against deeply nested payloads crafted to exhaust the stack.
	if (depth > 10) return value;

	if (typeof value === 'string') return escapeString(value);
	if (Array.isArray(value)) return value.map((item) => sanitizeValue(item, depth + 1));

	if (isPlainObject(value)) {
		let stripped = false;

		for (const key of Object.keys(value)) {
			// NoSQL injection: keys beginning with `$` or containing `.` are
			// interpreted as operators/paths by MongoDB.
			if (key.startsWith('$') || key.includes('.')) {
				delete value[key];
				stripped = true;
				continue;
			}
			value[key] = sanitizeValue(value[key], depth + 1);
		}

		// A payload like `{"email": {"$ne": null}}` is left as an empty object,
		// which is truthy - it would sail past the controllers' `if (!email)`
		// guards and only fail later as a confusing cast error. Collapsing it to
		// an empty string makes it fail validation cleanly instead.
		if (stripped && Object.keys(value).length === 0 && depth > 0) return '';
	}

	return value;
};

// Exported as a factory so it reads like the other security middleware.
const sanitize = () => (req, res, next) => {
	if (req.body) req.body = sanitizeValue(req.body);
	if (req.params) sanitizeValue(req.params);
	next();
};

module.exports = sanitize;
