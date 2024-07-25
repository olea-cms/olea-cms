module.exports = {
	apps: [
		{
			name: "frontend-watch",
			script: "bun",
			args: "run watch",
			cwd: "./frontend",
			env: {
				NODE_ENV: "development",
			},
		},
		{
			name: "backend-dev",
			script: "bun",
			args: "run dev",
			cwd: "./backend",
			env: {
				NODE_ENV: "development",
			},
		},
	]
};
