module.exports = {
	'*.{ts,js,css,json,md}': ['prettier --write'],
	'*.{ts,js}': ['eslint --format=pretty --fix']
};
