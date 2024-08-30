import { env } from "../../env";
import { dbConnectionCreate } from "../../../api/config/db";
import express from "express";
import bodyParser from "body-parser";
import { createRouter } from "./v1/routes";
import { glogger } from "../../../api/helpers/logger";

const app = express();
const http = require("http").Server(app);
//const io = require("socket.io")(http);

/** create server module */
export const createServer = (): void => {
  const port = env.APPPORT;
  const host = env.HOST;

  /* To handle invalid JSON data request */
  app.use(bodyParser.json({ limit: "50mb" }));

  /* For parsing urlencoded data */
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  /** add header */
  app.use(function (req, res, next) {
    glogger("DEB", "0", "index", "Request URL:" + req.originalUrl);
    glogger("DEB", "0", "index", "Body:" + JSON.stringify(req.body));
    /*CORS headers*/
    var responseSettings = {
      AccessControlAllowOrigin: req.headers.origin,
      AccessControlAllowHeaders: "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
      AccessControlAllowMethods: "POST, GET, PUT, DELETE, OPTIONS",
      AccessControlAllowCredentials: "true",
    };
    // Set custom headers for CORS
    res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
    res.header("Access-Control-Allow-Origin", responseSettings.AccessControlAllowOrigin);
    res.header("Access-Control-Allow-Headers", req.headers["access-control-request-headers"] ? req.headers["access-control-request-headers"] : "x-requested-with");
    res.header("Access-Control-Allow-Methods", req.headers["access-control-request-method"] ? req.headers["access-control-request-method"] : responseSettings.AccessControlAllowMethods);
    if ("OPTIONS" == req.method) {
        res.sendStatus(200).end();
    } else {
      next();
    }
  });

  /** create database connection */
  dbConnectionCreate();
  /** router */
  app.use("/v1", createRouter());

  /** listen server */
  http.listen(port, () => {
    glogger("IMP", "0", "index", `APP listening on port http://${host}:${port}`);
  });
};
