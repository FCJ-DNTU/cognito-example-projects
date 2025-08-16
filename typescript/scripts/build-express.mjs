import fs from "fs";
import path from "path";

import * as esbuild from "esbuild";

const SRC_DIR_NAME = "src";
const BUILD_DIR_NAME = "build/runtime/express";
const ENTRY_POINT_DIR_NAME = "runtimes/express";
const ENTRY_POINT_NAME = "app.ts";

const ROOT_PATH = process.cwd();
const SRC_PATH = path.resolve(ROOT_PATH, SRC_DIR_NAME);
const ENTRY_POINT_PATH = path.resolve(
  SRC_PATH,
  ENTRY_POINT_DIR_NAME,
  ENTRY_POINT_NAME,
);
const BUILD_PATH = path.resolve(ROOT_PATH, BUILD_DIR_NAME);

const _rootPathParts = ROOT_PATH.split("/");
if (_rootPathParts[_rootPathParts.length - 1] !== "typescript")
  throw new Error(
    "build-express.mjs should be executed in /typescript directory",
  );

console.log("Root Path:", ROOT_PATH);
console.log("Source Path:", SRC_PATH);
console.log("Entry Point Path:", ENTRY_POINT_PATH);

const buildOptions = {
  entryPoints: [ENTRY_POINT_PATH],
  outdir: BUILD_PATH,
  bundle: true,
  minify: true,
  platform: "node",
  format: "cjs",
};

console.log("Build options:", buildOptions);
