from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict, Any

VerbosityLevel = Literal['low', 'medium', 'high']

class VerbosityRequest(BaseModel):
    model: str = Field(default='gpt-5-mini')
    prompt: str
    verbosities: List[VerbosityLevel] = Field(default_factory=lambda: ['low','medium','high'])

class VerbosityResult(BaseModel):
    verbosity: VerbosityLevel
    text: str
    usage: Dict[str, Any]

class FreeformToolRequest(BaseModel):
    model: str = Field(default='gpt-5-mini')
    instruction: str
    tool_name: str = 'code_exec'
    description: str = 'Executes arbitrary python code'

class FreeformToolResponse(BaseModel):
    tool_name: str
    code: str
    raw: Dict[str, Any]

class GrammarRequest(BaseModel):
    model: str = Field(default='gpt-5')
    grammar_name: str
    grammar_definition: str
    grammar_syntax: Literal['lark','regex'] = 'lark'
    prompt: str

class GrammarResponse(BaseModel):
    grammar_name: str
    output: str
    raw: Dict[str, Any]

class MinimalReasoningRequest(BaseModel):
    model: str = Field(default='gpt-5')
    system_prompt: str
    user_input: str

class MinimalReasoningResponse(BaseModel):
    output: str
    usage: Dict[str, Any]
    raw: Dict[str, Any]
