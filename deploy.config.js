module.exports = {
  apps : [
      {
        name: "zubhub",
        script: "./index.js",
        watch: true,
        env: {
          "NODE_ENV": "production",
        }
      }
  ]
}

