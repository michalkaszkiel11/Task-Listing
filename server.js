import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import router from "./routes/router.js";
dotenv.config();
const app = express();

app.set("port", process.env.PORT || 4000);

app.use(express.json());
app.use(cors());
app.use("/api/task-list", router);
mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log("Database connection successful 🤠");
    })
    .catch((error) => {
        console.log(
            "An error occurred while connecting to the database 😵‍💫",
            error
        );
    });

app.all("*", (req, res) => {
    res.status(500);
    res.send("Invalid path");
});

app.listen(app.get("port"), () => {
    console.log("The server is listening 🐒 on port " + app.get("port"));
});
