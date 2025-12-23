import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict


class LogService:
    """
    Minimal logging service that writes JSONL logs and echoes to stdout.
    """

    def __init__(self, log_file: str = None) -> None:
        # Use a path relative to project root or absolute path
        if log_file is None:
            # Default to logs directory relative to the recruitment_agent app
            base_dir = Path(__file__).parent
            log_file = str(base_dir / "logs" / "cv_parser_logs.jsonl")
        log_path = Path(log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        self.log_file = log_path

    def log_event(self, event_name: str, metadata: Dict[str, Any]) -> None:
        entry = self._build_entry("info", event_name, metadata)
        self._write(entry)

    def log_error(self, error_message: str, metadata: Dict[str, Any]) -> None:
        entry = self._build_entry("error", error_message, metadata)
        self._write(entry)
    
    def _log_step(self, step_name: str, metadata: Dict[str, Any]) -> None:
        """Alias for log_event for backward compatibility"""
        self.log_event(step_name, metadata)
    
    def _log_error(self, error_message: str, exc: Exception, metadata: Dict[str, Any]) -> None:
        """Alias for log_error with exception"""
        error_metadata = {**metadata, "exception": str(exc), "exception_type": type(exc).__name__}
        self.log_error(error_message, error_metadata)

    def _build_entry(self, level: str, event: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": level,
            "event": event,
            "metadata": metadata,
        }

    def _write(self, entry: Dict[str, Any]) -> None:
        try:
            with self.log_file.open("a", encoding="utf-8") as f:
                f.write(json.dumps(entry, ensure_ascii=False) + "\n")
        except Exception:
            # Fallback to console if file write fails
            print(f"[LOG FALLBACK] {entry}")

