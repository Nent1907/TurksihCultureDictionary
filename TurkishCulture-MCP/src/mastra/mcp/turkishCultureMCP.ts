import { MCPServer } from "@mastra/mcp";
import { 
  analyzeTurkishWordTool,
  translateTextTool,
  getEtymologyTool,
  getCulturalContextTool,
  getTurkishCultureInfoTool
} from "../tools/turkishCultureTools";

export const turkishCultureMCPServer = new MCPServer({
  name: "turkish-culture-mcp",
  version: "1.0.0",
  tools: {
    analyzeTurkishWord: analyzeTurkishWordTool,
    translateText: translateTextTool,
    getEtymology: getEtymologyTool,
    getCulturalContext: getCulturalContextTool,
    getTurkishCultureInfo: getTurkishCultureInfoTool
  }
}); 