#!/usr/bin/env node
import { turkishCultureMCPServer } from "./mcp/turkishCultureMCP";

turkishCultureMCPServer.startStdio().catch((error) => {
  console.error("Error running Turkish Culture MCP server:", error);
  process.exit(1);
}); 