/* Free PTE 本地后端
 * 零依赖 Node 服务：
 *   - 静态托管项目根目录（index.html / css / js / assets）
 *   - GET /api/wfd        返回 WFD 题库（来自视频切分）
 *   - GET /api/health     健康检查
 *   - 音频文件支持 HTTP Range（浏览器播放/拖动进度）
 * 启动：node server/server.js   →   http://localhost:3000
 */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PORT = process.env.PORT || 3000;
const QS_FILE = path.join(__dirname, "data", "wfd-questions.json");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".md": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function sendJson(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Content-Length": Buffer.byteLength(body) });
  res.end(body);
}

function serveFile(res, filePath, rangeHeader) {
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";
    const total = stat.size;
    let start = 0, end = total - 1, status = 200;
    const headers = {
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-cache",
    };
    if (rangeHeader) {
      const m = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
      if (m) {
        const rs = m[1] === "" ? null : parseInt(m[1], 10);
        const re = m[2] === "" ? null : parseInt(m[2], 10);
        if (rs === null && re !== null) start = Math.max(0, total - re);
        else if (rs !== null) start = rs;
        if (re !== null) end = Math.min(re, total - 1);
        if (start > end || start >= total) {
          res.writeHead(416, { "Content-Range": "bytes */" + total });
          res.end();
          return;
        }
        status = 206;
        headers["Content-Range"] = "bytes " + start + "-" + end + "/" + total;
      }
    }
    headers["Content-Length"] = end - start + 1;
    res.writeHead(status, headers);
    const stream = fs.createReadStream(filePath, { start, end });
    stream.pipe(res);
    stream.on("error", () => res.destroy());
  });
}

const server = http.createServer((req, res) => {
  let url;
  try { url = new URL(req.url, "http://localhost:" + PORT); }
  catch (e) { res.writeHead(400); res.end("Bad Request"); return; }

  const pathname = decodeURIComponent(url.pathname);

  /* API */
  if (pathname === "/api/health") {
    sendJson(res, 200, { ok: true, service: "pte-doubao", time: new Date().toISOString() });
    return;
  }
  if (pathname === "/api/wfd") {
    fs.readFile(QS_FILE, "utf8", (err, txt) => {
      if (err) { sendJson(res, 500, { error: "wfd-questions.json not found: " + err.message }); return; }
      try { sendJson(res, 200, JSON.parse(txt)); }
      catch (e) { sendJson(res, 500, { error: "invalid json" }); }
    });
    return;
  }

  /* 静态文件（防目录穿越） */
  let filePath = path.normalize(path.join(ROOT, pathname));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403); res.end("Forbidden"); return;
  }
  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) filePath = path.join(filePath, "index.html");
    serveFile(res, filePath, req.headers.range);
  });
});

server.listen(PORT, () => {
  console.log("Free PTE server running: http://localhost:" + PORT);
});
