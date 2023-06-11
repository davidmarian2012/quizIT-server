import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Database } from "./dbConnection.js";

import UserRoutes from "./routes/userRoutes.js";
import MessageRoutes from "./routes/messageRoutes.js";
import MultiQuestionRoutes from "./routes/multiQuestionRoutes.js";
import NumericalQuestionRoutes from "./routes/numericalQuestionRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/avatar", express.static("avatar"));

const db = new Database();
db.connect();

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/user", UserRoutes);
app.use("/message", MessageRoutes);
app.use("/multiquestion", MultiQuestionRoutes);
app.use("/numericalquestion", NumericalQuestionRoutes);

const port = 8080;
app.listen(port, () =>
  console.log(`Backend application listening at http://localhost:${port}`)
);
