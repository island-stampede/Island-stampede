from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone
from pathlib import Path
import os
import logging
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME", "island_stampede")
if not MONGO_URL:
    raise RuntimeError("Missing MONGO_URL environment variable")

client = AsyncIOMotorClient(
    MONGO_URL,
    maxPoolSize=10,
    serverSelectionTimeoutMS=5000
)

db = client[DB_NAME]

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("island-stampede-api")

app = FastAPI(title="Island Stampede API", version="1.0.0")
api_router = APIRouter(prefix="/api")


def now_iso():
    return datetime.now(timezone.utc).isoformat()


class LeadCreate(BaseModel):
    name: str = Field(min_length=2)
    email: EmailStr
    phone: Optional[str] = ""
    type: str = Field(description="ticket or sponsor")
    party_size: Optional[str] = ""
    company: Optional[str] = ""
    message: Optional[str] = ""


class Lead(LeadCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)


@api_router.get("/")
async def root():
    return {"status": "online", "message": "Island Stampede API live", "event": "LET'S RIDE TASMANIA"}


@api_router.get("/health")
async def health():
    return {"status": "healthy", "timestamp": now_iso()}


@api_router.post("/leads", response_model=Lead, status_code=201)
async def create_lead(payload: LeadCreate):
    if payload.type not in ["ticket", "sponsor"]:
        raise HTTPException(status_code=400, detail="type must be ticket or sponsor")
    if payload.phone and not payload.phone.replace('+', '').replace('-', '').isdigit():
        raise HTTPException(status_code=400, detail="phone must contain only digits, + or -")
    lead = Lead(**payload.model_dump())
    await db.leads.insert_one(lead.model_dump())
    logger.info(f"New {lead.type} lead created: {lead.email}")
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def list_leads(type: Optional[str] = None):
    query = {}
    if type:
        query["type"] = type
    docs = await db.leads.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Lead(**doc) for doc in docs]


@api_router.get("/stats")
async def stats():
    tickets = await db.leads.count_documents({"type": "ticket"})
    sponsors = await db.leads.count_documents({"type": "sponsor"})
    return {"ticket_leads": tickets, "sponsor_leads": sponsors, "total": tickets + sponsors}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://island-stampede.vercel.app",
        "http://localhost:8081",
        "http://localhost:19006",
        "http://localhost:19002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    # create indexes
    await db.leads.create_index("email")
    await db.leads.create_index("created_at")
    logger.info("Island Stampede API started")


@app.on_event("shutdown")
async def shutdown():
    client.close()
    logger.info("Mongo connection closed")
