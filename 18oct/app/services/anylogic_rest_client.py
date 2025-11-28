import logging
import os
from typing import Any, Dict

import requests
from fastapi import HTTPException

logger = logging.getLogger(__name__)


class AnyLogicRESTClient:
    def __init__(self) -> None:
        self.api_key = os.getenv("ANYLOGIC_API_KEY")
        if not self.api_key:
            raise ValueError("ANYLOGIC_API_KEY environment variable is required")
        self.base_url = "https://cloud.anylogic.com/api/open/8.5.0"
        self.headers = {
            "Authorization": self.api_key,
            "Content-Type": "application/json"
        }

    def get_models(self) -> Dict[str, Any]:
        try:
            response = requests.get(
                f"{self.base_url}/models",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as exc:
            logger.error("Ошибка получения моделей: %s", exc)
            raise HTTPException(status_code=500, detail="Ошибка подключения к AnyLogic Cloud") from exc

    def run_simulation(self, version_id: str, inputs: Dict[str, Any]) -> Dict[str, Any]:
        try:
            run_response = requests.post(
                f"{self.base_url}/versions/{version_id}/runs",
                headers=self.headers,
                json=inputs
            )
            run_response.raise_for_status()
            run_data = run_response.json()

            results_response = requests.post(
                f"{self.base_url}/versions/{version_id}/results",
                headers=self.headers,
                json={"runId": run_data["id"]}
            )
            results_response.raise_for_status()

            return results_response.json()

        except requests.RequestException as exc:
            logger.error("Ошибка выполнения симуляции: %s", exc)
            raise HTTPException(status_code=500, detail="Ошибка выполнения симуляции") from exc
