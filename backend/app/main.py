from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import (
    VerbosityRequest, VerbosityResult,
    FreeformToolRequest, FreeformToolResponse,
    GrammarRequest, GrammarResponse,
    MinimalReasoningRequest, MinimalReasoningResponse
)
from .azure_openai import get_client
from typing import List

app = FastAPI(title="GPT-5 Feature Explorer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status":"ok"}

@app.get("/versions")
async def versions():
    try:
        import openai, sys
        return {"openai": getattr(openai, "__version__", "unknown"), "python": sys.version}
    except Exception as e:
        return {"error": str(e)}

@app.post("/verbosity", response_model=List[VerbosityResult])
async def test_verbosity(req: VerbosityRequest):
    client = get_client()
    results: List[VerbosityResult] = []
    for v in req.verbosities:
        body = {"input": req.prompt, "text": {"verbosity": v}}
        try:
            resp = await client.responses_create(model=req.model, body=body)  # resp is dict
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"verbosity error ({v}): {e}")
        text_out = extract_text(resp)
        usage = resp.get('usage', {})
        results.append(VerbosityResult(verbosity=v, text=text_out, usage=usage))
    return results

@app.post("/freeform", response_model=FreeformToolResponse)
async def freeform(req: FreeformToolRequest):
    client = get_client()
    body = {
        "input": req.instruction,
        "text": {"format": {"type":"text"}},
        "tools": [
            {"type":"custom", "name": req.tool_name, "description": req.description}
        ],
        "parallel_tool_calls": False
    }
    try:
        resp = await client.responses_create(model=req.model, body=body)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"freeform error: {e}")
    code = ''
    output = resp.get('output', [])
    if len(output) > 1 and output[1].get('type') == 'custom_tool_call':
        code = output[1].get('input', '') or output[1].get('arguments', '')
    return FreeformToolResponse(tool_name=req.tool_name, code=code, raw=resp)

@app.post("/grammar", response_model=GrammarResponse)
async def grammar(req: GrammarRequest):
    client = get_client()
    body = {
        "input": req.prompt,
        "text": {"format": {"type": "text"}},
        "tools": [
            {
                "type":"custom",
                "name": req.grammar_name,
                "description": "Grammar constrained output",
                "format": {"type":"grammar", "syntax": req.grammar_syntax, "definition": req.grammar_definition}
            }
        ],
        "parallel_tool_calls": False
    }
    try:
        resp = await client.responses_create(model=req.model, body=body)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"grammar error: {e}")
    gram_out = ''
    output = resp.get('output', [])
    if len(output) > 1 and output[1].get('type') == 'custom_tool_call':
        gram_out = output[1].get('input','')
    return GrammarResponse(grammar_name=req.grammar_name, output=gram_out, raw=resp)

@app.post("/minimal", response_model=MinimalReasoningResponse)
async def minimal(req: MinimalReasoningRequest):
    client = get_client()
    body = {
        "input": [
            {"role":"developer", "content": req.system_prompt},
            {"role":"user", "content": req.user_input}
        ],
        "reasoning": {"effort": "minimal"}
    }
    try:
        resp = await client.responses_create(model=req.model, body=body)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"minimal reasoning error: {e}")
    text_out = extract_text(resp)
    usage = resp.get('usage', {})
    return MinimalReasoningResponse(output=text_out, usage=usage, raw=resp)

def extract_text(resp_dict):
    pieces = []
    for item in resp_dict.get('output', []) or []:
        for content in item.get('content', []) or []:
            if isinstance(content, dict) and 'text' in content:
                pieces.append(content['text'])
    return ''.join(pieces)
