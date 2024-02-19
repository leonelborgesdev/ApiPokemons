import express from "express";
import morgan from "morgan";
import cors from "cors";
import fileupload from "express-fileupload";

const app = express();

//Middelwares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  })
);

// app.use(router);

export default app;
