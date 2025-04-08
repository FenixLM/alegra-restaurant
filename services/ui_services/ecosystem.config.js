module.exports = {
  apps: [
    {
      name: "ui-service",
      script: "./dist/src/index.js",
      instances: 1,
      exec_mode: "cluster",
      watch: false,
    },
  ],
};
