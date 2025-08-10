## GPT-5 Feature Explorer

Interactive demo (FastAPI + React) showcasing several OpenAI Responses API features that might appear in GPT‑5 style models:

- Verbosity control (low / medium / high output)
- Freeform custom tool (function) calls with generated code
- Grammar‑constrained generation (Lark or regex)
- Minimal reasoning effort setting

The backend is a FastAPI service exposing a few focused endpoints. The frontend (Create React App) gives a simple tabbed UI that calls those endpoints via a development proxy.

---

## 1. Prerequisites

- macOS / Linux / WSL (Windows also fine)
- Python 3.11+ (tested with 3.12)
- Node.js 18+ (Create React App requirement)
- An OpenAI API key with access to the target models

---

## 2. Environment Variables

Create a `backend/.env` file (loaded via `python-dotenv`) with at least:

```
OPENAI_API_KEY=sk-...
# Optional overrides (defaults shown)
MODEL_GPT5=gpt-5
MODEL_GPT5_MINI=gpt-5-mini
MODEL_GPT5_NANO=gpt-5-nano
```

If you only set `OPENAI_API_KEY`, defaults in `app/config.py` are used for model names.

---

## 3. Backend Setup (FastAPI)

From the project root:

```bash
cd backend

# 1. Create & activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate  # (On Windows: .venv\Scripts\activate)

# 2. Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# 3. Create your environment file (if not already)
cp .env.example .env 2>/dev/null || true  # (optional if you make an example) OR manually create .env

# 4. Run the API (reload enabled)
python run.py
```

The API listens on `http://localhost:8000` by default.

### Health Check
`GET /health` → `{ "status": "ok" }`

### Version Info
`GET /versions` → returns python & openai library versions.

Key POST endpoints (all accept JSON):
- `/verbosity`
- `/freeform`
- `/grammar`
- `/minimal`

---

## 4. Frontend Setup (React)

Open a second terminal (keep backend running), then:

```bash
cd frontend
npm install
npm start
```

This starts the dev server on port 3000 (or next available). The proxy (`src/setupProxy.js`) rewrites `/api/*` calls to `http://localhost:8000`.

Example network flow from browser:
```
Browser -> http://localhost:3000/api/verbosity -> (proxy) -> http://localhost:8000/verbosity
```

---

## 5. Quick Start (All-in-One)

From project root in two shells:

Shell 1 (backend):
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
echo "OPENAI_API_KEY=sk-..." > .env  # set your real key
python run.py
```

Shell 2 (frontend):
```bash
cd frontend
npm install
npm start
```

Visit: http://localhost:3000

---

## 6. Endpoint Shapes (Reference)

### POST /verbosity
```
{
	"model": "gpt-5-mini",
	"prompt": "Explain gravity",
	"verbosities": ["low", "medium", "high"]
}
```
Response: array of objects `{ verbosity, text, usage }`.

### POST /freeform
Generates a custom tool call with arbitrary code.
```
{
	"model": "gpt-5-mini",
	"instruction": "Write a quick sort in Python",
	"tool_name": "code_exec",
	"description": "Executes arbitrary python code"
}
```
Returns `{ tool_name, code, raw }`.

### POST /grammar
Grammar constrained output (Lark or regex):
```
{
	"model": "gpt-5",
	"grammar_name": "color_pair",
	"grammar_syntax": "lark",
	"grammar_definition": "start: WORD ",
	"prompt": "Return a single simple word"
}
```

### POST /minimal
Minimal reasoning effort demonstration:
```
{
	"model": "gpt-5",
	"system_prompt": "You are concise.",
	"user_input": "Summarize black holes in one sentence."
}
```

---

## 7. Development Tips

- Adjust port or host: edit `backend/run.py` or use env vars with uvicorn flags.
- Hot reload: already enabled (reload=True in `run.py`).
- Add new endpoints in `backend/app/main.py` then call them via `/api/your-endpoint` in the frontend.
- If CORS issues arise outside the proxy, see the `CORSMiddleware` config in `main.py`.

---

## 8. Troubleshooting

| Issue | Fix |
|-------|-----|
| 401 / auth errors | Confirm `OPENAI_API_KEY` and that the key has model access. |
| Module not found | Re‑activate virtual env; run `pip install -r requirements.txt`. |
| Proxy not working | Ensure backend is on 8000; restart frontend dev server. |
| Different Node version warnings | Use Node 18 LTS or later. |

---

## 9. License

Add your desired license here (e.g., MIT).

---

## 10. Next Ideas

- Add Dockerfiles for backend & frontend
- Integrate simple rate limiting
- Add unit tests for parsing / response extraction

---

Happy hacking!

