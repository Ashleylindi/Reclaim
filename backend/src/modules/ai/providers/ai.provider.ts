type GroqResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
};

type GroqError = {
  error?: {
    message?: string;
  };
};

export class AiProvider {
  private apiKey = process.env.GROQ_API_KEY;
  private url = 'https://api.groq.com/openai/v1/chat/completions';

  async chat(messages: { role: string; content: string }[]) {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 500,
        messages,
      }),
    });

    const data: unknown = await response.json();

    if (!response.ok) {
      const error = data as GroqError;

      console.error('Groq error:', error);

      throw new Error(
        `${response.status}: ${error.error?.message || 'Groq API error'}`,
      );
    }

    const success = data as GroqResponse;

    return success.choices[0]?.message?.content || '';
  }
}
