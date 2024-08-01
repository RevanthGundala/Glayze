const { createRequestHandler } = require("@expo/server/adapter/vercel");
const path = require("path");

const buildPath = path.join(__dirname, "../dist/server");

// Patched respond function
async function patchedRespond(res: any, expoRes: any) {
  res.statusMessage = expoRes.statusText;
  res.writeHead(
    expoRes.status,
    expoRes.statusText,
    [...expoRes.headers.entries()].flat()
  );
  res.end(expoRes.body);
}

const requestHandler = createRequestHandler({
  build: buildPath,
  mode: process.env.NODE_ENV,
  respond: patchedRespond, // Use the patched respond function
});

module.exports = async (req: any, res: any) => {
  try {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    await requestHandler(req, res);
  } catch (error) {
    console.error("Error in request handler:", error);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
  }
};
