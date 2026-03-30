import React from "react";
import {render} from "ink";
import {App} from "./app.js";

render(
  <App
    boot={{
      productName: "PigLet CLI",
      version: "0.1.0",
      model: "gpt-5.4-mini",
      cwd: process.cwd()
    }}
  />
);
