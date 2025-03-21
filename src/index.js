const http = require("http");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
