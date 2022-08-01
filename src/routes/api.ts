import express from "express";
import indexesRouter from "./indexes";
import linksRouter from "./links";

const apiRouter = express.Router();

apiRouter.use("/indexes", indexesRouter);
apiRouter.use("/links", linksRouter);

export default apiRouter;
