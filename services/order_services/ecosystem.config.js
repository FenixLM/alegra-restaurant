module.exports = {
  apps: [
    {
      name: "order-service",
      script: "./src/index.js",
      instances: 1,
      exec_mode: "cluster",
      watch: false,
    },
  ],
};
