# SupportPilot AI

An AI-powered customer support dashboard built with **React, FastAPI, and Python**. SupportPilot AI provides a foundation for managing customer support tickets through a clean dashboard and REST API.

## Features

- **Ticket Management:** Create, view, update, and delete support tickets.
- **Ticket Status:** Track open, in-progress, resolved, and closed tickets.
- **Priority Management:** Organize tickets by priority.
- **Category Organization:** Categorize tickets for easier management.
- **Dashboard UI:** Responsive interface with ticket statistics, filters, and a ticket creation form.
- **REST API:** FastAPI endpoints for ticket operations.
- **Database Integration:** SQLAlchemy with SQLite for local development.
- **API Documentation:** Interactive Swagger documentation.

## Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Backend**
- Python
- FastAPI
- SQLAlchemy
- Pydantic

**Database**
- SQLite


## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mhussnainashiq/supportpilot-ai.git
cd supportpilot-ai
```

### 2. Start the backend

Open a terminal:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m app.db.init_db
uvicorn app.main:app --reload
```





### 3. Start the frontend

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/health` | Check API health |
| GET | `/api/v1/tickets` | Retrieve tickets |
| POST | `/api/v1/tickets` | Create a ticket |
| GET | `/api/v1/tickets/{ticket_id}` | Retrieve one ticket |
| PATCH | `/api/v1/tickets/{ticket_id}` | Update a ticket |
| DELETE | `/api/v1/tickets/{ticket_id}` | Delete a ticket |

## Roadmap

Planned enhancements include:

- AI-generated reply suggestions
- Automatic ticket classification and sentiment analysis
- AI-powered ticket summaries
- User authentication and workspace-based access control
- Support analytics and reporting
- PostgreSQL support
- Automated tests and deployment

## Security Note

The current version is intended for local development and portfolio demonstration. Authentication and authorization must be implemented before exposing ticket operations publicly. AI integrations should use server-side API keys and require human review of generated replies.

## Author

**Muhammad Husnain Ashiq**

Full-Stack Developer | React, Python, FastAPI & AI Applications

- GitHub: https://github.com/mhussnainashiq

---

*SupportPilot AI is an ongoing portfolio project demonstrating full-stack application development and REST API integration.*
