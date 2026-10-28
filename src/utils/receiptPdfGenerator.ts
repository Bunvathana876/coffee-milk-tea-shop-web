import { jsPDF } from 'jspdf';
import { formatUsd, formatKhr, usdToKhr } from '../config/currency';
import { generateQrMatrix } from './qrCode';
import type { Order } from '../types';

/**
 * Formats order date safely for the receipt
 */
function formatReceiptDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Draws a clean dashed divider line on the PDF document
 */
function drawDashedDivider(doc: jsPDF, x1: number, y: number, x2: number) {
  const dashLen = 1.2;
  const gapLen = 0.8;
  let curX = x1;
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.25);
  while (curX < x2) {
    const nextX = Math.min(curX + dashLen, x2);
    doc.line(curX, y, nextX, y);
    curX = nextX + gapLen;
  }
}

/**
 * Generates and downloads a clean, professional PDF café receipt on the client side.
 * Runs 100% offline in the browser without uploading any customer data or contacting servers.
 */
export function downloadReceiptPdf(order: Order, paymentStatus = 'PENDING'): void {
  const items = order.items || [];

  // Calculate dynamic page height to fit all items and QR code comfortably
  const baseHeight = 165;
  const itemHeightEstimate = items.length * 15;
  const pageHeight = Math.max(190, baseHeight + itemHeightEstimate);
  const pageWidth = 80; // Standard 80mm POS thermal slip format
  const margin = 6;
  const contentWidth = pageWidth - margin * 2;
  const centerX = pageWidth / 2;
  const rightX = pageWidth - margin;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pageWidth, pageHeight],
    compress: true,
  });

  let y = 10;

  // --- 1. CAFÉ HEADER ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(28, 25, 23); // Dark charcoal
  doc.text('BREW & BOBA CAFÉ', centerX, y, { align: 'center' });

  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(87, 83, 78);
  doc.text('Specialty Coffee & Artisanal Boba Lab', centerX, y, { align: 'center' });

  y += 3.5;
  doc.setFontSize(6.5);
  doc.setTextColor(120, 113, 108);
  doc.text('Street 214, BKK1, Phnom Penh, Cambodia', centerX, y, { align: 'center' });
  y += 3.2;
  doc.text('Tel: +855 23 999 888 • Order Receipt', centerX, y, { align: 'center' });

  y += 4;
  drawDashedDivider(doc, margin, y, rightX);
  y += 5;

  // --- 2. ORDER & CUSTOMER METADATA ---
  doc.setFontSize(7.5);

  // Order Number
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(87, 83, 78);
  doc.text('Order Number:', margin, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(28, 25, 23);
  doc.text(`#${order.order_number}`, rightX, y, { align: 'right' });
  y += 4;

  // Date
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(87, 83, 78);
  doc.text('Date:', margin, y);
  doc.setTextColor(28, 25, 23);
  doc.text(formatReceiptDate(order.created_at), rightX, y, { align: 'right' });
  y += 4;

  // Customer Name
  doc.setTextColor(87, 83, 78);
  doc.text('Customer:', margin, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(28, 25, 23);
  doc.text(order.customer_name || 'Guest', rightX, y, { align: 'right' });
  y += 4;

  // Customer Phone
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(87, 83, 78);
  doc.text('Phone:', margin, y);
  doc.setTextColor(28, 25, 23);
  doc.text(order.customer_phone || 'N/A', rightX, y, { align: 'right' });

  y += 4;
  drawDashedDivider(doc, margin, y, rightX);
  y += 4.5;

  // --- 3. ITEMS SECTION ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 113, 108);
  doc.text('ITEMS', margin, y);
  doc.text('PRICE', rightX, y, { align: 'right' });

  y += 4;

  // Item List
  items.forEach((item, index) => {
    // Drink Name & Quantity
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(28, 25, 23);
    const itemTitle = `${index + 1}. ${item.quantity}x ${item.product_name}`;
    doc.text(itemTitle, margin, y);

    // Item Subtotal (USD)
    doc.text(formatUsd(item.subtotal_usd), rightX, y, { align: 'right' });
    y += 3.5;

    // Customization details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 95, 90);
    const customLine = `${item.size} | ${item.sugar_level} Sugar | ${item.ice_level}`;
    doc.text(customLine, margin + 2.5, y);

    // KHR Subtotal
    doc.setFontSize(6);
    doc.setTextColor(140, 135, 130);
    doc.text(formatKhr(item.subtotal_usd), rightX, y, { align: 'right' });
    y += 4.5;
  });

  drawDashedDivider(doc, margin, y, rightX);
  y += 4.5;

  // --- 4. SUBTOTAL & TOTALS (DUAL CURRENCY) ---
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(87, 83, 78);
  doc.text('Subtotal:', margin, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(28, 25, 23);
  doc.text(`${formatUsd(order.subtotal_usd)} (${formatKhr(order.subtotal_usd)})`, rightX, y, {
    align: 'right',
  });
  y += 5;

  // Total USD
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(28, 25, 23);
  doc.text('TOTAL DUE (USD):', margin, y);
  doc.setFontSize(11);
  doc.text(formatUsd(order.total_usd), rightX, y, { align: 'right' });
  y += 4.5;

  // Total KHR
  doc.setFontSize(8);
  doc.setTextColor(120, 53, 15); // Warm amber
  doc.text('TOTAL IN KHR:', margin, y);
  doc.setFontSize(9.5);
  doc.text(formatKhr(order.total_usd), rightX, y, { align: 'right' });
  y += 3.5;

  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140, 135, 130);
  doc.text(`Exchange Rate: $1 = ${formatKhr(1)}`, margin, y);

  y += 3.5;
  drawDashedDivider(doc, margin, y, rightX);
  y += 4.5;

  // --- 5. PAYMENT METHOD & STATUS ---
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(87, 83, 78);
  doc.text('Payment Method:', margin, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 79, 113); // ABA Blue
  doc.text('ABA KHQR', rightX, y, { align: 'right' });
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(87, 83, 78);
  doc.text('Payment Status:', margin, y);

  const isPending = paymentStatus.toUpperCase().includes('PENDING');
  doc.setFont('helvetica', 'bold');
  if (isPending) {
    doc.setTextColor(180, 83, 9); // Amber
    doc.text('PENDING (Awaiting Scan)', rightX, y, { align: 'right' });
  } else {
    doc.setTextColor(21, 128, 61); // Emerald
    doc.text('PAID (DEMO ONLY)', rightX, y, { align: 'right' });
  }

  y += 4;
  drawDashedDivider(doc, margin, y, rightX);
  y += 4;

  // --- 6. MOCK ABA KHQR CODE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(0, 79, 113); // ABA Blue
  doc.text('ABA KHQR (DEMO SCAN)', centerX, y, { align: 'center' });
  y += 3;

  // Generate Safe Synthetic QR Payload
  const computedKhr = order.total_khr ?? usdToKhr(order.total_usd);
  const demoPayload = `khqr-demo://mock-pay?merchant=Coffee%20%26%20Milk%20Tea%20Caf%C3%A9&order=${order.order_number}&usd=${order.total_usd.toFixed(2)}&khr=${computedKhr}&demo_notice=DEMO_QR_NO_REAL_PAYMENT`;

  try {
    const matrix = generateQrMatrix(demoPayload);
    const qrSize = 30; // 30 mm square
    const qrX = (pageWidth - qrSize) / 2;
    const qrY = y;
    const modSize = qrSize / matrix.length;

    // White QR Background Box
    doc.setFillColor(255, 255, 255);
    doc.rect(qrX - 1, qrY - 1, qrSize + 2, qrSize + 2, 'F');

    // Draw Vector QR Modules
    doc.setFillColor(0, 0, 0);
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c]) {
          doc.rect(qrX + c * modSize, qrY + r * modSize, modSize, modSize, 'F');
        }
      }
    }

    // Corner Alignment Brackets
    doc.setDrawColor(0, 79, 113);
    doc.setLineWidth(0.4);
    // Top-Left
    doc.line(qrX - 2, qrY - 2, qrX + 2, qrY - 2);
    doc.line(qrX - 2, qrY - 2, qrX - 2, qrY + 2);
    // Top-Right
    doc.line(qrX + qrSize + 2, qrY - 2, qrX + qrSize - 2, qrY - 2);
    doc.line(qrX + qrSize + 2, qrY - 2, qrX + qrSize + 2, qrY + 2);
    // Bottom-Left
    doc.line(qrX - 2, qrY + qrSize + 2, qrX + 2, qrY + qrSize + 2);
    doc.line(qrX - 2, qrY + qrSize + 2, qrX - 2, qrY + qrSize - 2);
    // Bottom-Right
    doc.line(qrX + qrSize + 2, qrY + qrSize + 2, qrX + qrSize - 2, qrY + qrSize + 2);
    doc.line(qrX + qrSize + 2, qrY + qrSize + 2, qrX + qrSize + 2, qrY + qrSize - 2);

    // Center Red KHQR Emblem
    const emblemSize = 6;
    const emblemX = centerX - emblemSize / 2;
    const emblemY = qrY + (qrSize - emblemSize) / 2;
    doc.setFillColor(225, 37, 27); // KHQR Red
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.3);
    doc.rect(emblemX, emblemY, emblemSize, emblemSize, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4);
    doc.setTextColor(255, 255, 255);
    doc.text('KHQR', centerX, emblemY + 2.5, { align: 'center' });
    doc.text('៛ / $', centerX, emblemY + 4.5, { align: 'center' });

    y += qrSize + 3;
  } catch {
    y += 10;
  }

  // --- 7. DEMO PAYMENT WARNING BANNER ---
  doc.setFillColor(254, 242, 242); // Rose tint
  doc.setDrawColor(248, 113, 113); // Rose border
  doc.setLineWidth(0.2);
  const warnBoxWidth = contentWidth;
  const warnBoxX = margin;
  doc.rect(warnBoxX, y, warnBoxWidth, 7, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(185, 28, 28); // Dark red
  doc.text('DEMO QR — NO REAL PAYMENT', centerX, y + 3, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5);
  doc.setTextColor(153, 27, 27);
  doc.text('Demonstration code only. No financial transaction or bank connection.', centerX, y + 5.5, {
    align: 'center',
  });

  y += 9.5;
  drawDashedDivider(doc, margin, y, rightX);
  y += 4;

  // --- 8. FOOTER ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(87, 83, 78);
  doc.text('Thank you for visiting Brew & Boba Café!', centerX, y, { align: 'center' });

  y += 3;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(120, 113, 108);
  doc.text('WiFi: BrewAndBoba_Guest  |  Pass: barista2026', centerX, y, { align: 'center' });

  y += 2.8;
  doc.text(`Present Order #${order.order_number} to collect your drinks.`, centerX, y, {
    align: 'center',
  });

  // Save PDF locally to user's browser download
  doc.save(`Receipt-${order.order_number}.pdf`);
}
