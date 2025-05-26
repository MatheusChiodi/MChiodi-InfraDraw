import { toPng, toSvg } from "html-to-image";
import jsPDF from "jspdf";

const watermarkText = "InfraDraw.app";

export const exportAsPng = (element: HTMLElement) => {
  toPng(element, { backgroundColor: "#ffffff" })
    .then((dataUrl) => downloadFile(dataUrl, "diagram.png"))
    .catch((err) => console.error("PNG Export Error:", err));
};

export const exportAsSvg = (element: HTMLElement) => {
  toSvg(element, { backgroundColor: "#ffffff" })
    .then((dataUrl) => downloadFile(dataUrl, "diagram.svg"))
    .catch((err) => console.error("SVG Export Error:", err));
};

export const exportAsPdf = (element: HTMLElement) => {
  toPng(element, { backgroundColor: "#ffffff" })
    .then((dataUrl) => {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [element.clientWidth + 40, element.clientHeight + 40],
      });

      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, element.clientWidth + 40, element.clientHeight + 40, "F");

      pdf.addImage(
        dataUrl,
        "PNG",
        20,
        20,
        element.clientWidth,
        element.clientHeight,
      );
      pdf.setFontSize(10);
      pdf.setTextColor(150);
      pdf.text(watermarkText, 20, element.clientHeight + 35);

      pdf.save("diagram.pdf");
    })
    .catch((err) => console.error("PDF Export Error:", err));
};

const downloadFile = (dataUrl: string, filename: string) => {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
};
