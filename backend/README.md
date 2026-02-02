# PropertyHub Backend

FastAPI backend for PropertyHub property search application.

## Prerequisites

- Python 3.12+
- [uv](https://docs.astral.sh/uv/) - Python package manager

## Setup Instructions

### 1. Install uv (if not already installed)

```bash
# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Or using pip
pip install uv
```

### 2. Create virtual environment and install dependencies

```bash
cd backend

# Create virtual environment with Python 3.12
uv venv --python 3.12

# Activate virtual environment
# Windows:
.venv\Scripts\activate

# Install dependencies
uv pip install -r requirements.txt
```

### 3. Initialize database with schema and sample data

```bash
# Create tables
python -c "from app.database import engine, Base; from app.models import *; Base.metadata.create_all(bind=engine)"

# Seed sample data
python seed_data.py
```

### 4. Run the server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
