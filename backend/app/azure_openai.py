from typing import Any, Dict, Optional
from openai import AsyncOpenAI
from .config import settings


class OpenAIClient:
    """Minimal wrapper using the OpenAI SDK Responses API."""

    def __init__(self):
        key = settings.openai_api_key
        if not key:
            raise ValueError("OPENAI_API_KEY not configured")
        self.client = AsyncOpenAI(api_key=key)

    async def responses_create(self, *, model: str, body: Dict[str, Any]) -> Dict[str, Any]:
        r = await self.client.responses.create(model=model, **body)
        # Convert SDK object to plain dict
        return getattr(r, "model_dump", lambda **_: dict(r))(exclude_none=True)

client_singleton: Optional[OpenAIClient] = None

def get_client() -> OpenAIClient:
    global client_singleton
    if client_singleton is None:
        client_singleton = OpenAIClient()
    return client_singleton
