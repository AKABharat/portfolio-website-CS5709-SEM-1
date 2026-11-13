require("dotenv").config();

const app = require("./app");
const { connectDB } = require("./dbConnection");

/** Entry point: connects to MongoDB, then starts the HTTP server. */
(async () => {
  await connectDB();
  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`Server listening on port ${port}`));
})();
