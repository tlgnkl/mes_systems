import os

from anylogiccloudclient.client.cloud_client import CloudClient
from fastapi import HTTPException


def get_cloud_client() -> CloudClient:
    """Возвращает экземпляр клиента AnyLogic Cloud."""
    api_key = os.getenv("ANYLOGIC_API_KEY")
    if not api_key:
        raise ValueError("ANYLOGIC_API_KEY environment variable is required")
    try:
        return CloudClient(api_key)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка инициализации клиента AnyLogic: {exc}"
        ) from exc
