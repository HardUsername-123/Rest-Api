const app = require("./src/app");
const connectDB = require("./src/config/db");

//connect to MongoDB
connectDB();

//start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server run on port http://localhost:${port}`);
});
