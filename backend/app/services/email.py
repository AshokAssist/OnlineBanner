import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from typing import List
from fastapi import UploadFile
import os
from decimal import Decimal

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.email = os.getenv("BUSINESS_EMAIL", "your-business@gmail.com")
        self.password = os.getenv("EMAIL_PASSWORD", "your-app-password")
    
    async def send_order_email(self, order_data: dict, files: List[UploadFile]):
        """Send order details and files to business email."""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.email
            msg['To'] = self.email
            msg['Subject'] = f"New Banner Order - Order ID: {order_data['order_id']}"
            
            # Create email body
            body = self._create_email_body(order_data)
            msg.attach(MIMEText(body, 'html'))
            
            # Attach files
            for i, file in enumerate(files):
                file_content = await file.read()
                await file.seek(0)  # Reset file pointer
                
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(file_content)
                encoders.encode_base64(part)
                part.add_header(
                    'Content-Disposition',
                    f'attachment; filename= order_{order_data["order_id"]}_file_{i+1}_{file.filename}'
                )
                msg.attach(part)
            
            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email, self.password)
            text = msg.as_string()
            server.sendmail(self.email, self.email, text)
            server.quit()
            
            return True
        except Exception as e:
            print(f"Email sending failed: {e}")
            return False
    
    def generate_order_email_content(self, order) -> str:
        """Generate email content for admin viewing."""
        items_html = ""
        for i, item in enumerate(order.items):
            items_html += f"""
            <tr>
                <td>{i+1}</td>
                <td>{item.banner_config.width_cm} x {item.banner_config.height_cm} cm</td>
                <td>{item.banner_config.material.title()}</td>
                <td>{'Yes' if item.banner_config.grommets else 'No'}</td>
                <td>{'Yes' if item.banner_config.lamination else 'No'}</td>
                <td>₹{item.price}</td>
            </tr>
            """
        
        customer_name = order.user.name if hasattr(order, 'user') and order.user else "N/A"
        customer_email = order.user.email if hasattr(order, 'user') and order.user else "N/A"
        
        return f"""
        <html>
        <body>
            <h2>Banner Order Details</h2>
            
            <h3>Customer Details:</h3>
            <p><strong>Name:</strong> {customer_name}</p>
            <p><strong>Email:</strong> {customer_email}</p>
            <p><strong>Contact Number:</strong> {order.contact_number or 'Not provided'}</p>
            
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total Amount:</strong> ₹{order.total_price}</p>
            <p><strong>Order Date:</strong> {order.created_at.strftime('%d/%m/%Y %I:%M %p')}</p>
            
            <h3>Banner Specifications:</h3>
            <table border="1" style="border-collapse: collapse; width: 100%;">
                <tr>
                    <th>Item</th>
                    <th>Size</th>
                    <th>Material</th>
                    <th>Grommets</th>
                    <th>Lamination</th>
                    <th>Price</th>
                </tr>
                {items_html}
            </table>
            
            <p><strong>Note:</strong> {len(order.items)} design file(s) were sent as email attachments when this order was placed.</p>
        </body>
        </html>
        """
    
    def _create_email_body(self, order_data: dict) -> str:
        """Create HTML email body with order details."""
        items_html = ""
        for i, item in enumerate(order_data['items']):
            items_html += f"""
            <tr>
                <td>{i+1}</td>
                <td>{item['width_cm']} x {item['height_cm']} cm</td>
                <td>{item['material'].title()}</td>
                <td>{'Yes' if item['grommets'] else 'No'}</td>
                <td>{'Yes' if item['lamination'] else 'No'}</td>
                <td>₹{item['price']}</td>
            </tr>
            """
        
        return f"""
        <html>
        <body>
            <h2>New Banner Order Received</h2>
            
            <h3>Customer Details:</h3>
            <p><strong>Name:</strong> {order_data['customer_name']}</p>
            <p><strong>Email:</strong> {order_data['customer_email']}</p>
            <p><strong>Contact Number:</strong> {order_data['contact_number']}</p>
            
            <h3>Order Details:</h3>
            <p><strong>Order ID:</strong> {order_data['order_id']}</p>
            <p><strong>Total Amount:</strong> ₹{order_data['total_price']}</p>
            
            <h3>Banner Specifications:</h3>
            <table border="1" style="border-collapse: collapse; width: 100%;">
                <tr>
                    <th>Item</th>
                    <th>Size</th>
                    <th>Material</th>
                    <th>Grommets</th>
                    <th>Lamination</th>
                    <th>Price</th>
                </tr>
                {items_html}
            </table>
            
            <p><strong>Note:</strong> Design files are attached to this email.</p>
            
            <p>Please contact the customer at {order_data['contact_number']} for any clarifications.</p>
        </body>
        </html>
        """