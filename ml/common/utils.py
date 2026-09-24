import json
from pathlib import Path
from typing import Any


def ensure_directory(path: Path):
    """
    Create a directory if it does not exist.
    """

    path.mkdir(parents=True, exist_ok=True)


def save_json(data: Any, filepath: Path):
    """
    Save Python data as JSON.
    """

    ensure_directory(filepath.parent)

    with open(filepath, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)


def load_json(filepath: Path):
    """
    Load JSON file.
    """

    with open(filepath, "r", encoding="utf-8") as file:
        return json.load(file)


def clamp(value: float, minimum: float, maximum: float) -> float:
    """
    Keep a value within a specified range.
    """

    return max(minimum, min(value, maximum))


def calculate_risk_score(pm25: float) -> float:
    """
    Convert PM2.5 concentration into a normalized
    0-1 risk score.

    This is an application-level risk score,
    not a medical prediction.
    """

    score = pm25 / 300.0

    return clamp(score, 0.0, 1.0)