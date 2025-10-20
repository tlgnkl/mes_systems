from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routers import simulations

load_dotenv()

app = FastAPI(
    title="AnyLogic Cloud API Integration",
    description="FastAPI приложение для работы с AnyLogic Cloud",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(simulations.router, prefix="/api/v1", tags=["simulations"])


@app.get("/")
async def root():
    """
    Корневой эндпоинт для проверки работы API.
    """
    return {
        "message": "AnyLogic Cloud API Integration Service"
    }


@app.get("/health")
async def health_check():
    """
    Проверка состояния сервиса.
    """
    return {"status": "healthy"}
