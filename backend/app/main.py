
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.init_db import init_db
from app.routes.tickets import router as tickets_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="SupportPilot AI API",
    description="AI-assisted customer support and ticket management.",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Welcome to SupportPilot AI API",
        "docs": "/docs",
    }


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "ok",
        "service": "SupportPilot AI API",
    }


app.include_router(tickets_router, prefix="/api/v1")
