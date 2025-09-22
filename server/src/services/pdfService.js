const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const generateBookingPDF = async (bookingData) => {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Create HTML content for the PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Booking Confirmation - CeylonEye</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f8fff8;
                color: #2d5a27;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding: 20px;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(74, 124, 89, 0.1);
            }
            .logo {
                font-size: 2.5rem;
                font-weight: bold;
                color: #2d5a27;
                margin-bottom: 10px;
                letter-spacing: 2px;
            }
            .subtitle {
                color: #4a7c59;
                font-size: 1.1rem;
                margin: 0;
            }
            .content {
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(74, 124, 89, 0.1);
                margin-bottom: 20px;
            }
            .booking-id {
                background-color: #f0f7f0;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
                margin-bottom: 25px;
                border: 2px solid #4a7c59;
            }
            .booking-id h2 {
                margin: 0;
                color: #2d5a27;
                font-size: 1.5rem;
            }
            .section {
                margin-bottom: 25px;
            }
            .section h3 {
                color: #4a7c59;
                border-bottom: 2px solid #e8f5e8;
                padding-bottom: 8px;
                margin-bottom: 15px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            .info-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #f0f7f0;
            }
            .info-label {
                font-weight: 600;
                color: #666;
            }
            .info-value {
                color: #2d5a27;
                font-weight: 500;
            }
            .total-price {
                background-color: #f0f7f0;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                border: 2px solid #4a7c59;
                margin-top: 20px;
            }
            .total-price h3 {
                margin: 0 0 10px 0;
                color: #2d5a27;
            }
            .price-amount {
                font-size: 2rem;
                font-weight: bold;
                color: #4a7c59;
            }
            .footer {
                text-align: center;
                color: #666;
                font-size: 0.9rem;
                margin-top: 30px;
                padding: 20px;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(74, 124, 89, 0.1);
            }
            .status {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: bold;
                background-color: #d4edda;
                color: #2d5a27;
                border: 1px solid #4a7c59;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">CEYLONEYE</div>
            <p class="subtitle">Tourism Management System - Transport Booking Confirmation</p>
        </div>
        
        <div class="content">
            <div class="booking-id">
                <h2>Booking ID: ${bookingData.bookingId}</h2>
                <span class="status">CONFIRMED</span>
            </div>
            
            <div class="section">
                <h3>🚗 Transport Details</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Provider:</span>
                        <span class="info-value">${bookingData.provider.name}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Vehicle Type:</span>
                        <span class="info-value">${bookingData.provider.vehicleType}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Seats:</span>
                        <span class="info-value">${bookingData.provider.seats}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Price:</span>
                        <span class="info-value">$${bookingData.provider.price} ${bookingData.provider.priceUnit}</span>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h3>👤 Customer Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Name:</span>
                        <span class="info-value">${bookingData.customer.customerName}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Email:</span>
                        <span class="info-value">${bookingData.customer.customerEmail}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Phone:</span>
                        <span class="info-value">${bookingData.customer.customerPhone}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Passengers:</span>
                        <span class="info-value">${bookingData.customer.numberOfPassengers}</span>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h3>📍 Trip Details</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Pickup Location:</span>
                        <span class="info-value">${bookingData.customer.pickupLocation}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Drop-off Location:</span>
                        <span class="info-value">${bookingData.customer.dropoffLocation}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Date:</span>
                        <span class="info-value">${new Date(bookingData.customer.bookingDate).toLocaleDateString()}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Time:</span>
                        <span class="info-value">${bookingData.customer.bookingTime}</span>
                    </div>
                </div>
                ${bookingData.customer.specialRequests ? `
                <div style="margin-top: 15px;">
                    <span class="info-label">Special Requests:</span>
                    <p style="margin: 5px 0 0 0; color: #2d5a27; font-style: italic;">${bookingData.customer.specialRequests}</p>
                </div>
                ` : ''}
            </div>
            
            <div class="total-price">
                <h3>Total Amount</h3>
                <div class="price-amount">$${bookingData.totalPrice}</div>
                <p style="margin: 10px 0 0 0; color: #666;">For ${bookingData.customer.numberOfPassengers} passenger(s)</p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Thank you for choosing CeylonEye!</strong></p>
            <p>For any queries, please contact us with your Booking ID: ${bookingData.bookingId}</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
    </body>
    </html>
    `;
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    return pdfBuffer;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = { generateBookingPDF };
