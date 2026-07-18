import { Injectable } from '@nitrostack/core';
import { GoogleGenAI } from '@google/genai';

export interface StructuredResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
}

export interface CompletionResponse {
  success: boolean;
  response: string | null;
  error?: string;
}

@Injectable()
export class LLMService {
  private readonly ai: GoogleGenAI;
  private readonly routingModel: string;
  private readonly reportModel: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    
    // Initialize the modern @google/genai SDK
    this.ai = new GoogleGenAI({ apiKey });
    
    this.routingModel = process.env.GEMINI_ROUTING_MODEL ?? 'gemini-2.5-flash';
    this.reportModel = process.env.GEMINI_REPORT_MODEL ?? 'gemini-2.5-pro';
  }

  /**
   * Generates a strictly typed structured response using Gemini's native JSON schema.
   * 
   * @param systemPrompt The system instructions.
   * @param userPrompt The specific contextual prompt.
   * @param schema The JSON Schema defining the strict structure required.
   * @returns A structured response object containing the success status and data.
   */
  async generateStructuredResponse<T>(
    systemPrompt: string,
    userPrompt: string,
    // Using standard Record types or generic object for schema compatibility 
    // with the @google/genai TypeSchema standard
    schema: Record<string, any> 
  ): Promise<StructuredResponse<T>> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.routingModel,
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.1,
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });

      const responseText = response.text;
      
      if (!responseText) {
        return { 
          success: false, 
          data: null, 
          error: "API returned an empty response." 
        };
      }

      try {
        const parsedData = JSON.parse(responseText) as T;
        return { success: true, data: parsedData };
      } catch (parseError) {
        return { 
          success: false, 
          data: null, 
          error: `JSON parsing failed: ${(parseError as Error).message}. Raw output: ${responseText}` 
        };
      }
      
    } catch (error) {
      return { 
        success: false, 
        data: null, 
        error: `API generation failed: ${(error as Error).message}` 
      };
    }
  }

  /**
   * Generates a standard text completion.
   * 
   * @param systemPrompt The system instructions.
   * @param userPrompt The user prompt or combined context.
   * @returns A completion response object containing the success status and text.
   */
  async generateCompletion(
    systemPrompt: string,
    userPrompt: string
  ): Promise<CompletionResponse> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.reportModel,
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.4,
        },
      });

      return { 
        success: true, 
        response: response.text || null 
      };

    } catch (error) {
      return { 
        success: false, 
        response: null, 
        error: `API generation failed: ${(error as Error).message}` 
      };
    }
  }
}