const PROXY_CONFIG = [
  {
    context: "/api",
    target: "https://query2.finance.yahoo.com",
    pathRewrite: { "^/api": "" },
    secure: false,
    changeOrigin: true,
    logLevel: "debug",
  },
];

module.exports = PROXY_CONFIG;
