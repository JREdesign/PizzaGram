import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/user.js";
import { recipesRouter } from "./routes/recipes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

mongoose.connect(
  "mongodb+srv://root:recipes123456@recipes.olew0we.mongodb.net/recipes?retryWrites=true&w=majority&appName=recipes"
)
.then(() => console.log("Connected to MongoDB!"))
.catch(err => console.error("Could not connect to MongoDB:", err));


app.listen(3001, () => console.log("SERVER STARTED!"));
