const logger = {
	debug: function(val) {
		if (process.env.NODE_ENV === 'development') {
			console.log(val)
		}
	},
	warn: function(val) {
		console.warn(val);
	},
	error: function(val) {
		console.error(val);
	}
};

export default logger;