const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

//express setup
const app = express();
app.use(cors());
app.use(express.json());

//database setup
mongoose.connect(
  process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) console.log(err);
    console.log("Database Connected");
  }
);

//middleware

//router
app.use("/users", require("./routes/user.route"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
