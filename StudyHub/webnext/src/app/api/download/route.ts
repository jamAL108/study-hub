import { NextRequest } from "next/server";

// Services
import { generatePdfService } from "@/services/downloadPDF/generatePdfService";

export async function POST(req: NextRequest) {
    const result:any = await generatePdfService(req);
    console.log(result)
    return result;
}
