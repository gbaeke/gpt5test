# GPT-5 Feature Explorer

A full-stack demo (FastAPI + React) showcasing new GPT-5 features via the OpenAI Responses API:

1. Verbosity Parameter
2. Freeform Function Calling
3. Context-Free Grammar (CFG)
4. Minimal Reasoning

## Backend

FastAPI endpoints:
- `POST /verbosity` – compare low/medium/high outputs
- `POST /freeform` – single custom tool call returning raw code
- `POST /grammar` – grammar constrained output (lark or regex)
- `POST /minimal` – minimal reasoning sentiment style task

Configure environment variables (`.env`):
```
OPENAI_API_KEY=sk-...
MODEL_GPT5=gpt-5
MODEL_GPT5_MINI=gpt-5-mini
MODEL_GPT5_NANO=gpt-5-nano
```

Install & run:
```
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

## Frontend

```
cd frontend
npm install
npm start
```

Dev proxy suggestion (create `frontend/src/setupProxy.js` if using CRA) to map `/api` to backend at port 8000.

## Notes
- Freeform panel only displays the emitted code (no execution sandbox provided).
- Grammar panel ships with tiny sample grammars; replace with real ones for production.
- Ensure your account has access to the specified GPT-5 models.

## License
MIT
