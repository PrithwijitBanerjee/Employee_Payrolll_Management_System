const PDFDocument = require("pdfkit");

const HEADER_COLOR = "#4a90e2";
const ROW_COLOR_ODD = "#f5f5f5";
const ROW_COLOR_EVEN = "#ffffff";

async function generateMISPDF(summaryData, titleText) {
  const pdf = new PDFDocument({ margin: 40, size: "A4" });

  pdf.fontSize(20).fillColor(HEADER_COLOR).text(titleText, { align: "center" });
  pdf.moveDown(1.5);

  if (summaryData.me) {
    pdf.fontSize(16).fillColor(HEADER_COLOR);
    pdf.moveDown(0.5);
    drawSummarySection(pdf, summaryData.me);
    drawPieChart(pdf, summaryData.me, 300, pdf.y + 100, 80);
  }

  if (summaryData.others) {
    pdf.moveDown(1);
    pdf.fontSize(16).fillColor(HEADER_COLOR);
    pdf.moveDown(0.5);
    drawSummarySection(pdf, summaryData.others);
    drawPieChart(pdf, summaryData.others, 300, pdf.y + 100, 80);
  }

  const range = pdf.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    pdf.switchToPage(i);
    pdf
      .fontSize(8)
      .fillColor("gray")
      .text(`Page ${i + 1} of ${range.count}`, 500, 780, { align: "right" });
  }

  return pdf;
}

function drawSummarySection(pdf, data) {
  const headers = [
    "Pending Tasks",
    "WIP Tasks",
    "Completed Tasks",
    "Total Duration (min)",
    "Avg Duration (min)",
    "Pending Alerts",
    "Overdue Tasks",
  ];

  const values = [
    data.pending,
    data.wip,
    data.completed,
    data.totalDuration,
    data.avgDuration,
    data.pendingAlerts,
    data.overdue,
  ];

  const rows = [values];
  drawColoredTable(pdf, headers, rows);
  pdf.moveDown();
}

function drawColoredTable(pdf, headers, rows) {
  const startX = pdf.page.margins.left;
  let y = pdf.y;
  const headerHeight = 30;
  const rowHeight = 25;

  const pageWidth = pdf.page.width;
  const margin = pdf.page.margins.left;
  const usableWidth = pageWidth - margin * 2;
  const colWidth = usableWidth / headers.length;

  pdf.fontSize(10);

  pdf.fillColor("#4a90e2");
  pdf.rect(startX, y, colWidth * headers.length, headerHeight).fill();

  headers.forEach((header, i) => {
    pdf.fillColor("white").text(header, startX + i * colWidth + 5, y + 8, {
      width: colWidth - 10,
      align: "center",
    });
  });

  pdf.strokeColor("black").lineWidth(1);
  pdf.rect(startX, y, colWidth * headers.length, headerHeight).stroke();

  y += headerHeight;

  rows.forEach((row, idx) => {
    const bgColor = idx % 2 === 0 ? "#ffffff" : "#f5f5f5";
    pdf.fillColor(bgColor).rect(startX, y, colWidth * headers.length, rowHeight).fill();

    pdf.fillColor("black");
    Object.values(row).forEach((val, i) => {
      pdf.text(String(val ?? ""), startX + i * colWidth + 5, y + 8, {
        width: colWidth - 10,
        align: "center",
      });
    });

    pdf.strokeColor("black").lineWidth(0.5);
    pdf.rect(startX, y, colWidth * headers.length, rowHeight).stroke();

    y += rowHeight;
  });

  pdf.moveDown();
}

function drawPieChart(pdf, summary, centerX = 300, centerY = 400, radius = 80) {
  const total = summary.pending + summary.wip + summary.completed;
  if (total === 0) return;

  const colors = {
    pending: "#f39c12",
    wip: "#3498db",
    completed: "#2ecc71",
  };

  const values = [
    { label: "Pending", value: summary.pending, color: colors.pending },
    { label: "WIP", value: summary.wip, color: colors.wip },
    { label: "Completed", value: summary.completed, color: colors.completed },
  ];

  let startAngle = 0;

  values.forEach((item) => {
    const sliceAngle = (item.value / total) * Math.PI * 2;

    pdf
      .moveTo(centerX, centerY)
      .fillColor(item.color)
      .arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      .lineTo(centerX, centerY)
      .fill();

    startAngle += sliceAngle;
  });

  let legendY = centerY - radius;
  values.forEach((item) => {
    pdf.rect(centerX + radius + 20, legendY, 10, 10).fill(item.color);
    pdf
      .fillColor("black")
      .fontSize(10)
      .text(`${item.label}: ${item.value}`, centerX + radius + 35, legendY - 2);
    legendY += 20;
  });

  pdf.moveDown(2);
}

module.exports = {
  generateMISPDF,
};
