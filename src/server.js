/* server.js starts the server. Run using node server.js. */

import { app } from "./app.js";

app.listen(3000, function () {
  console.log("Listening on 3000");
});