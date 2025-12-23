import json
import os
from typing import Any, Dict, Optional

import requests


class GroqClientError(Exception):
    """Custom exception for Groq client failures."""


class GroqClient:
    """
    Thin wrapper around Groq's chat completion API for structured JSON extraction.
    Uses GROQ_REC_API_KEY from environment for recruitment agent.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        base_url: Optional[str] = None,
        timeout: int = 30,
    ) -> None:
        # Use GROQ_REC_API_KEY for recruitment agent, fallback to GROQ_API_KEY
        self.api_key = api_key or os.environ.get("GROQ_REC_API_KEY") or os.environ.get("GROQ_API_KEY")
        if not self.api_key:
            raise GroqClientError(
                "GROQ_REC_API_KEY or GROQ_API_KEY is required. Set it in environment variables."
            )
        self.model = model or os.environ.get("GROQ_MODEL", "llama-3.1-8b-instant")
        self.base_url = base_url or os.environ.get(
            "GROQ_BASE_URL", "https://api.groq.com/openai/v1/chat/completions"
        )
        self.timeout = timeout

    def send_prompt(self, system_prompt: str, text: str) -> Dict[str, Any]:
        """
        Send a prompt and text to Groq and return parsed JSON.
        """
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text},
            ],
            "temperature": 0,
            "response_format": {"type": "json_object"},
        }

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        try:
            response = requests.post(
                self.base_url, headers=headers, json=payload, timeout=self.timeout
            )
            response.raise_for_status()
        except requests.RequestException as exc:  # pragma: no cover - propagated
            detail = ""
            if getattr(exc, "response", None) is not None:
                try:
                    detail = f" | body: {exc.response.text}"
                except Exception:
                    detail = ""
            raise GroqClientError(f"Groq API request failed: {exc}{detail}") from exc

        try:
            content = response.json()
            message = content["choices"][0]["message"]["content"]
            return json.loads(message)
        except (KeyError, ValueError, json.JSONDecodeError) as exc:
            raise GroqClientError(f"Unable to parse Groq response: {exc}") from exc


