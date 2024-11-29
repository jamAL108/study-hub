/* eslint-disable @next/next/no-assign-module-variable */
// Next
import { NextResponse } from "next/server";


/**
 * Dynamically imports and retrieves an invoice template React component based on the provided template ID.
 *
 * @param {number} templateId - The ID of the invoice template.
 * @returns {Promise<React.ComponentType<any> | null>} A promise that resolves to the invoice template component or null if not found.
 * @throws {Error} Throws an error if there is an issue with the dynamic import or if a default template is not available.
 */
export const getInvoiceTemplate = async (templateId: number) => {
    // Dynamic template component name
    const componentName = `InvoiceTemplate${templateId}`;
    // console.log(componentName)

    try {
        const module = await import(
            `@/components/templates/invoice-pdf/${componentName}`
        );
        return module.default;
    } catch (err) {
        console.error(`Error importing template ${componentName}: ${err}`);

        // Provide a default template
        return null;
    }
};

export const isDataUrl = (str: string) => str.startsWith("data:");


export const formatNumberWithCommas = (number: number) => {
    return number.toLocaleString("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export const fileToBuffer = async (file: File) => {
    // Convert Blob to ArrayBuffer
    const arrayBuffer = await new NextResponse(file).arrayBuffer();

    // Convert ArrayBuffer to Buffer
    const pdfBuffer = Buffer.from(arrayBuffer);

    return pdfBuffer;
};