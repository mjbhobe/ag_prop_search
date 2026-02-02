# PropertyHub

A MagicBricks-style property search website for Indian properties (Mumbai & Bangalore).

## Features

- 🏠 Property search by city, locality, listing type, budget, bedrooms
- 🌓 Light/dark mode theme toggle
- 📱 Responsive design for all devices
- 🔍 Advanced filtering with cascading city → locality dropdowns
- 📄 Detailed property pages

## Tech Stack

- **Backend**: FastAPI + SQLAlchemy + SQLite
- **Frontend**: React + Vite + React Router

## Quick Start

### Prerequisites

- Python 3.12+
- Node.js 18+
- [uv](https://docs.astral.sh/uv/) (Python package manager)

### Backend Setup

```bash
cd backend

# Create virtual environment
uv venv --python 3.12
.venv\Scripts\activate  # Windows

# Install dependencies
uv pip install -r requirements.txt

# Seed database with sample data
python seed_data.py

# Start server
uvicorn app.main:app --reload
```

Backend runs at: http://localhost:8000

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: http://localhost:5173

## Project Structure

```
website-magic/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── database.py      # SQLite connection
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── crud.py          # Database operations
│   │   └── routers/         # API endpoints
│   ├── sql/                  # SQL scripts
│   ├── seed_data.py         # Data generator
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── context/         # Theme context
    │   ├── pages/           # Page components
    │   ├── services/        # API client
    │   └── styles/          # CSS files
    ├── package.json
    └── vite.config.js
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| GET /api/cities | List all cities |
| GET /api/cities/{id}/localities | Localities in a city |
| GET /api/properties | Search with filters |
| GET /api/properties/{id} | Property details |

## Sample Data

- **Cities**: Mumbai, Bangalore
- **Localities**: 16 in Mumbai, 8 in Bangalore
- **Properties**: ~280 total (10-15 per locality)
