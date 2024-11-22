import express from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import bodyParser from "body-parser";
import apirouter from './router.js'
app.use(
  cors({
    origin: ["https://www.study-hub.xyz","https://study-hub-frontend.vercel.app","http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
  })
);

// Your other middleware or route handlers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apirouter);
const port = 8000;
app.get("/", (req, res) => {
  res.send("hello");
});
app.listen(port, () => {
  console.log("started");
});