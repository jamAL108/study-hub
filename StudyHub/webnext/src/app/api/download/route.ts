import { NextRequest } from "next/server";

// Services
import { generatePdfService } from "@/services/downloadPDF/generatePdfService";

export async function POST(req: NextRequest) {
    
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    const result:any = await generatePdfService(req);
    console.log(result)
    return result;
}
