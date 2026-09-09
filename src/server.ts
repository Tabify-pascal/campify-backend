import express, { Router } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.js";
import accountRouter from "./routes/account.js";

import spotsRouter from "./routes/spots.js";
import newsRouter from "./routes/news.js";
import faqRouter from "./routes/faq.js";
import contactRouter from "./routes/contact.js";
import reservationsRouter from "./routes/reservations.js";
import campingRouter from "./routes/campings.js";

// Admin
import adminDashboardRouter from "./routes/admin/dashboard.js";
import adminSpotsRouter from "./routes/admin/spots.js";
import adminNewsRouter from "./routes/admin/news.js";
import adminReservationRouter from "./routes/admin/reservations.js";
import adminFaqRouter from "./routes/admin/faqs.js";
import adminContactRouter from "./routes/admin/contact.js";
import adminCampingRouter from "./routes/admin/campings.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const apiRouter = Router();

const PORT = Number(process.env.PORT) || 3000;
const APP_BASE_PATH = process.env.APP_BASE_PATH ?? "";

app.use(
    cors({
        origin:
            process.env.FRONTEND_URL ??
            "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

// Static uploads
app.use(
    `${APP_BASE_PATH}/uploads`,
    express.static("uploads")
);

// Health
apiRouter.get("/health", (_req, res) => {
    res.json({
        status: "ok",
    });
});

// Public
apiRouter.use("/spots", spotsRouter);
apiRouter.use("/news", newsRouter);
apiRouter.use("/faq", faqRouter);
apiRouter.use("/contact", contactRouter);
apiRouter.use("/reservations", reservationsRouter);
apiRouter.use("/campings", campingRouter);

// Auth
apiRouter.use("/auth", authRouter);

// Account
apiRouter.use("/account", accountRouter);

// Admin
apiRouter.use(
    "/admin/dashboard",
    adminDashboardRouter
);
apiRouter.use("/admin/spots", adminSpotsRouter);
apiRouter.use("/admin/news", adminNewsRouter);
apiRouter.use(
    "/admin/reservations",
    adminReservationRouter
);
apiRouter.use("/admin/faqs", adminFaqRouter);
apiRouter.use(
    "/admin/messages",
    adminContactRouter
);
apiRouter.use(
    "/admin/campings",
    adminCampingRouter
);

// Mount API once
app.use(`${APP_BASE_PATH}/api`, apiRouter);

// Temporary routing debug
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
        originalUrl: req.originalUrl,
        url: req.url,
        baseUrl: req.baseUrl,
        path: req.path,
        appBasePath: APP_BASE_PATH,
    });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`);
});