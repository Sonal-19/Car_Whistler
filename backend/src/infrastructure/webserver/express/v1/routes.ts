import express, { Request, Response } from "express";
import { ApiDocsRoute } from "../../../../api/interface/routes/v1/apiDocs";
import { VEHICLE } from "../../../../api/interface/routes/v1/vehicle";
/** crate global router */
export const createRouter = (): express.Router => {
  const router = express.Router();
  ApiDocsRoute(router);
  VEHICLE(router);
  return router;
};
