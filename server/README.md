# 🔌 Padmashri Agro — Backend REST API

**Built by:** Anushka Shete (UI/UX & Backend Inquiry Lead)  
**Tech Stack:** Node.js + Express.js + SQLite (`node:sqlite` native)  
**Port:** `5000`

---

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Response:
```json
{
  "status": "OK",
  "app": "Padmashri Agro Backend API",
  "database": "SQLite (node:sqlite native)"
}
```

---

### 📋 Inquiries / Leads (Anushka Shete's Core Module)

#### Submit a Quote Inquiry
```
POST /api/inquiries
Content-Type: application/json

{
  "name": "Ramesh Patil",
  "phone": "9876543210",
  "village": "Sangamner, Ahmednagar",
  "product": "hydro-plough",
  "branch": "Main Factory (Sadatpur, Sangamner)",
  "message": "Need best price and delivery"
}
```
Response (`201 Created`):
```json
{
  "success": true,
  "message": "Quotation inquiry saved to database successfully",
  "inquiry": {
    "id": 1,
    "reference_no": "PAD-2026-4821",
    "name": "Ramesh Patil",
    "phone": "9876543210",
    "village": "Sangamner, Ahmednagar",
    "product_name": "Hydraulic Reversible MB Plough",
    "status": "Pending",
    "created_at": "2026-09-10 15:30:00"
  }
}
```

#### Get All Inquiries / Leads
```
GET /api/inquiries
GET /api/inquiries?status=Pending
GET /api/inquiries?limit=20
```

#### Get Single Inquiry
```
GET /api/inquiries/1
GET /api/inquiries/PAD-2026-4821
```

#### Update Lead Status
```
PATCH /api/inquiries/1/status
Content-Type: application/json

{ "status": "Contacted" }
```

---

### 🚜 Products API

```
GET /api/products
GET /api/products?category=ploughs
GET /api/products/hydro-plough
```

---

### 📍 Branches API

```
GET /api/branches
```

---

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `inquiries` | Customer quote requests & leads |
| `products` | Agricultural equipment catalog |
| `branches` | Office locations |

## ▶️ Run the Server

```bash
npm run server
# OR
node server/index.js
```
