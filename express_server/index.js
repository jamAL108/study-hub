import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import bodyParser from "body-parser";
import apirouter from './router.js'
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "https://www.study-hub.xyz",
    // origin:"http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use("/api", apirouter);
const port = 8000;
app.get("/", (req, res) => {
  res.send("hello");
});
app.listen(port, () => {
  console.log("started");
});