import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const GenerateReport = () => {
  const handleGenerateReport = () => {
    // Capture the dashboard content
    const input = document.getElementById("dashboard-content");

    if (input) {
      html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4"); // Create a new PDF in portrait mode with A4 size

        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate height to maintain aspect ratio

        // Add the image to the PDF
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        // Save the PDF
        pdf.save("dashboard-report.pdf");
      });
    }
  };

  return (
    <div className="o-card div15 generate-report">
      <button onClick={handleGenerateReport}>Generate Report</button>
    </div>
  );
};

export default GenerateReport;
