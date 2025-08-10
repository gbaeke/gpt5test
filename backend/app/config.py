import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    default_model_gpt5: str = os.getenv("MODEL_GPT5", "gpt-5")
    default_model_gpt5_mini: str = os.getenv("MODEL_GPT5_MINI", "gpt-5-mini")
    default_model_gpt5_nano: str = os.getenv("MODEL_GPT5_NANO", "gpt-5-nano")

settings = Settings()
