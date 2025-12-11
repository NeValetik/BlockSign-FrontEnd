# BlockSign Email Templates

This directory contains HTML email templates for all emails sent by the BlockSign application. All templates are designed to match the BlockSign brand identity with the brand color `#6266ea` and DM Sans font family.

## Available Templates

### 1. `otp-verification.html`
**Purpose:** Email verification code sent during registration  
**Variables:**
- `{{CODE}}` - 6-digit verification code

**Usage:** Sent when user requests email verification during registration.

---

### 2. `finalize-registration.html`
**Purpose:** Registration approval email with finalization link  
**Variables:**
- `{{LINK}}` - Complete registration URL with token and email

**Usage:** Sent by admin when approving a registration request.

---

### 3. `document-review-sign.html`
**Purpose:** Notification when a document is shared for signing  
**Variables:**
- `{{DOCUMENT_TITLE}}` - Title of the document
- `{{APP_URL}}` - Base URL of the application

**Usage:** Sent to participants when a document is created and shared with them.

---

### 4. `document-signed.html`
**Purpose:** Notification when all parties have signed a document  
**Variables:**
- `{{DOCUMENT_TITLE}}` - Title of the document
- `{{APP_URL}}` - Base URL of the application
- `{{#BLOCKCHAIN_INFO}}...{{/BLOCKCHAIN_INFO}}` - Conditional block for blockchain info
  - `{{TX_ID}}` - Blockchain transaction ID
  - `{{EXPLORER_URL}}` - Link to view transaction on PolygonScan

**Usage:** Sent to all participants (including owner) when document is fully signed.

---

### 5. `document-rejected.html`
**Purpose:** Notification when a document is rejected by a participant  
**Variables:**
- `{{DOCUMENT_TITLE}}` - Title of the document
- `{{APP_URL}}` - Base URL of the application
- `{{#REJECTER_NAME}}...{{/REJECTER_NAME}}` - Conditional block for rejecter name
  - `{{REJECTER_NAME}}` - Name of the person who rejected
- `{{#REJECTION_REASON}}...{{/REJECTION_REASON}}` - Conditional block for rejection reason
  - `{{REJECTION_REASON}}` - Reason for rejection (if provided)

**Usage:** Sent to all participants (including owner) when a document is rejected.

---

## Design Specifications

- **Brand Color:** `#6266ea` (Purple/Indigo)
- **Font Family:** DM Sans (with fallbacks)
- **Border Radius:** `10px` for main container, `6px` for inner elements
- **Max Width:** `600px` for email content
- **Responsive:** Mobile-friendly with padding adjustments

## Integration Notes

These templates use placeholder syntax (`{{VARIABLE}}`) that should be replaced when sending emails. You can use any templating engine like Handlebars, Mustache, or simple string replacement.

### Example Integration (Node.js)

```javascript
import fs from 'fs';
import path from 'path';

function loadTemplate(templateName, variables) {
    const templatePath = path.join(__dirname, 'emails', `${templateName}.html`);
    let html = fs.readFileSync(templatePath, 'utf8');
    
    // Simple variable replacement
    Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, variables[key]);
    });
    
    // Handle conditional blocks (simple implementation)
    // For production, consider using a proper templating engine
    
    return html;
}

// Usage
const html = loadTemplate('otp-verification', { CODE: '123456' });
```

## Email Client Compatibility

These templates are designed to work across major email clients:
- Gmail
- Outlook (desktop and web)
- Apple Mail
- Yahoo Mail
- Mobile email clients

The templates use:
- Table-based layout for maximum compatibility
- Inline styles (required for email)
- Web-safe fonts with fallbacks
- No external CSS dependencies

