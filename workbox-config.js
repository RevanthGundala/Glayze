module.exports = {
	globDirectory: 'app/',
	globPatterns: [
		'**/*.{tsx,ts}'
	],
	swDest: 'app/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};