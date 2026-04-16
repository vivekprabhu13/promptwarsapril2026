export async function getAssistantResponse(prompt: string, context: string) {
  try {
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, context }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
  }
}

export async function processTicketImage(base64Image: string, mimeType: string = 'image/jpeg') {
  try {
    const response = await fetch('/api/process-ticket', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: base64Image, mimeType }),
    });
    
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.details || errData.error || 'Failed to process ticket');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Gemini Error processing ticket:", error);
    throw error;
  }
}
