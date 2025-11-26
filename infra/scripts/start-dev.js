#!/usr/bin/env node

const { spawn } = require("child_process");
const { execSync } = require("child_process");

function stopServices() {
  console.log("\n🛑 Stopping services...");
  try {
    execSync("npm run services:stop", { stdio: "inherit" });
    console.log("✅ Services stopped successfully");
  } catch (error) {
    console.error("❌ Error stopping services:", error.message);
  }
  process.exit(0);
}

process.on("SIGINT", stopServices); // Ctrl+C
process.on("SIGTERM", stopServices); // kill command
process.on("SIGHUP", stopServices); // terminal closed

console.log("🚀 Starting development server...\n");

const nextProcess = spawn("npx", ["next", "dev"], {
  stdio: "inherit",
});

nextProcess.on("error", (error) => {
  console.error("❌ Failed to start Next.js:", error.message);
  stopServices();
});

nextProcess.on("exit", () => {
  stopServices();
});
