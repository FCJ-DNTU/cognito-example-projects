import { Readable } from "stream";

import { AppError } from "../../../core/error/AppError";
import { initializeRuntimeContext } from "../../../core/context/runtime-context";

// Import types
import type { Request, Response, NextFunction } from "express";
import type { TRuntimeContext } from "../../../core/context/runtime-context";

/**
 * Tạo Express Runtime từ Runtime Context rỗng.
 *
 * @param req
 * @param res
 * @param next
 *
 * @returns
 */
export function createContext(
  req: Request,
  res: Response,
  next: NextFunction,
): TRuntimeContext {
  const ctx = initializeRuntimeContext();

  ctx["runtime"] = "express";

  ctx["getBody"] = async function <T = typeof req.body>() {
    return req.body as Promise<T>;
  };

  ctx["getQuery"] = async function <T = typeof req.query>() {
    return req.query as unknown as Promise<T>;
  };

  ctx["getParams"] = async function <T = typeof req.params>() {
    return req.params as unknown as Promise<T>;
  };

  ctx["getHeaders"] = async function <T = typeof req.headers>() {
    return req.headers as unknown as Promise<T>;
  };

  ctx["setBody"] = function (update) {
    if (typeof update === "function") {
      req.body = update(req.body);
    }

    req.body = update;
  };

  ctx["setHTTPStatus"] = function (status) {
    res.status(status);
  };

  ctx["sendJson"] = function (data, meta) {
    return res.json({ data, meta });
  };

  ctx["sendHTML"] = function (htmlStr) {
    return res.send(htmlStr);
  };

  ctx["sendError"] = function (error) {
    return res.status(error.statusCode).json({ error: error.toPlain() });
  };

  ctx["sendStreaming"] = function (
    source,
    contentType = "application/octet-stream",
  ) {
    res.setHeader("Content-Type", contentType);
    res.setHeader("Transfer-Encoding", "chunked");

    if (Buffer.isBuffer(source)) {
      const stream = Readable.from(source);
      stream.pipe(res);

      stream.on("error", (err) => {
        const error = new AppError(err.message);
        res.status(500).json({ error: error.toPlain() });
      });
    } else if (typeof (source as Readable).pipe === "function") {
      source.pipe(res);

      source.on("error", (err) => {
        const error = new AppError(err.message);
        res.status(500).json({ error: error.toPlain() });
      });
    } else {
      res.status(500).end("Invalid stream source");
    }
  };

  ctx["next"] = next;

  return ctx as TRuntimeContext;
}
