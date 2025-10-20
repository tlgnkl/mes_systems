import logging

from anylogiccloudclient.client.cloud_client import CloudClient
from anylogiccloudclient.client.single_run_outputs import SingleRunOutputs
from fastapi import APIRouter, Depends, HTTPException

from typing import Any, Dict, List

from app.dependencies import get_cloud_client
from app.models import ErrorResponse, SimulationRequest, SimulationResponse
from app.services.anylogic_rest_client import AnyLogicRESTClient

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/simulations/run",
    response_model=SimulationResponse,
    responses={500: {"model": ErrorResponse}}
)
async def run_simulation(
    request: SimulationRequest,
    client: CloudClient = Depends(get_cloud_client)
):
    try:
        logger.info("Запуск симуляции с параметрами: %s", request.model_dump())

        version = client.get_latest_model_version(request.model_name)
        logger.info("Найдена версия модели: %s", version.id)

        inputs = client.create_inputs_from_experiment(version, request.experiment_name)

        overrides = request.input_overrides or {}
        applied_inputs: Dict[str, Any] = {}

        for name, value in overrides.items():
            inputs.set_input(name, value)
            try:
                applied_inputs[name] = inputs.get_input(name)
            except Exception:
                applied_inputs[name] = value

        if "Server capacity" not in applied_inputs:
            try:
                applied_inputs["Server capacity"] = inputs.get_input("Server capacity")
            except Exception:
                applied_inputs["Server capacity"] = overrides.get("Server capacity", 8)

        server_capacity_value = applied_inputs.get("Server capacity")

        try:
            server_capacity_int = int(server_capacity_value)
        except (TypeError, ValueError):
            raise HTTPException(
                status_code=422,
                detail="Параметр 'Server capacity' должен быть целым числом"
            )

        simulation = client.create_simulation(inputs)
        run_state = simulation.get_status()
        simulation_id = None

        if hasattr(simulation, "_run_state") and simulation._run_state and "id" in simulation._run_state:
            simulation_id = simulation._run_state["id"]

        logger.info("Создана симуляция, состояние: %s", run_state)

        outputs = simulation.get_outputs_and_run_if_absent()
        logger.info("Симуляция завершена, получены результаты")

        mean_queue_size = outputs.value("Mean queue size|Mean queue size")
        server_utilization = outputs.value("Utilization|Server utilization")

        raw_outputs = _serialize_outputs(outputs)

        return SimulationResponse(
            simulation_id=simulation_id or "unknown",
            server_capacity=server_capacity_int,
            mean_queue_size=mean_queue_size,
            server_utilization=server_utilization,
            raw_outputs=raw_outputs,
            applied_inputs=applied_inputs,
            status="completed"
        )

    except Exception as exc:
        logger.error("Ошибка при выполнении симуляции: %s", exc)
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка моделирования: {exc}"
        ) from exc


def _serialize_outputs(outputs: SingleRunOutputs) -> List[Dict[str, Any]]:
    raw_list = outputs.get_raw_outputs()
    serialized = []

    for item in raw_list:
        serialized.append({
            "name": getattr(item, "name", None),
            "type": getattr(item, "type", None),
            "value": getattr(item, "value", None),
            "units": getattr(item, "units", None)
        })

    return serialized


@router.post(
    "/simulations/run-rest",
    responses={500: {"model": ErrorResponse}}
)
async def run_simulation_rest(
    request: SimulationRequest,
    client: CloudClient = Depends(get_cloud_client)
):
    try:
        logger.info("REST запуск симуляции с параметрами: %s", request.model_dump())

        version = client.get_latest_model_version(request.model_name)
        inputs = client.create_inputs_from_experiment(version, request.experiment_name)

        overrides = request.input_overrides or {}
        applied_inputs: Dict[str, Any] = {}

        for name, value in overrides.items():
            inputs.set_input(name, value)
            try:
                applied_inputs[name] = inputs.get_input(name)
            except Exception:
                applied_inputs[name] = value

        if "Server capacity" not in applied_inputs:
            try:
                applied_inputs["Server capacity"] = inputs.get_input("Server capacity")
            except Exception:
                applied_inputs["Server capacity"] = overrides.get("Server capacity", 8)

        rest_client = AnyLogicRESTClient()
        rest_inputs = {
            "inputs": inputs.inputs_array,
            "experimentType": "SIMULATION"
        }

        run_results = rest_client.run_simulation(version.id, rest_inputs)

        outputs = run_results.get("outputs", [])

        return {
            "simulation_version": version.id,
            "inputs": rest_inputs,
            "outputs": outputs,
            "applied_inputs": applied_inputs
        }

    except Exception as exc:
        logger.error("REST ошибка выполнения симуляции: %s", exc)
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка моделирования через REST: {exc}"
        ) from exc


@router.get("/models")
async def get_models(client: CloudClient = Depends(get_cloud_client)):
    try:
        models = client.get_models()
        models_list = []

        for model in models:
            models_list.append({
                "id": model.id,
                "name": model.name,
                "latest_version_id": model.latest_version.id if model.latest_version else None
            })

        return {"models": models_list}

    except Exception as exc:
        logger.error("Ошибка получения списка моделей: %s", exc)
        raise HTTPException(
            status_code=500,
            detail=f"Ошибка получения списка моделей: {exc}"
        ) from exc
