import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.js";

import spotsRouter from "./routes/spots.js";
import newsRouter from "./routes/news.js";
import faqRouter from "./routes/faq.js";
import contactRouter from "./routes/contact.js";
import reservationsRouter from "./routes/reservations.js";

import adminSpotsRouter from "./routes/admin/spots.js";
import adminNewsRouter from "./routes/admin/news.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());


app.use(
    "/uploads",
    express.static("uploads")
);

app.get("/api/health", (_req, res) =>
{
    res.json({ status: "ok"});
});

app.use("/api/spots", spotsRouter);
app.use("/api/news", newsRouter);
app.use("/api/faq", faqRouter);
app.use("/api/contact", contactRouter);
app.use("/api/reservations", reservationsRouter);
//Admin
app.use("/api/admin/spots", adminSpotsRouter);
app.use("/api/admin/news", adminNewsRouter);

// Auth
app.use("/api/auth", authRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log("Api running on http://localhost:3000");
});