from typing import Dict, Any, Optional, List

from pydantic import BaseModel, Field


class SimulationRequest(BaseModel):
    model_name: str = "Service System Demo"
    experiment_name: str = "Baseline"
    input_overrides: Dict[str, Any] = Field(default_factory=lambda: {"Server capacity": 8})


class SimulationResponse(BaseModel):
    simulation_id: str
    server_capacity: int
    mean_queue_size: float
    server_utilization: float
    raw_outputs: List[Dict[str, Any]]
    applied_inputs: Dict[str, Any]
    status: str


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
