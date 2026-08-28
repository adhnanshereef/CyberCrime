import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { type, payload } = await req.json(); // payload is text or base64 audio string

    let englishText = '';

    if (type === 'text') {
      const DEEPL_API_KEY = Deno.env.get('DEEPL_API_KEY');
      if (!DEEPL_API_KEY) throw new Error('DEEPL_API_KEY is missing');

      const deepLRes = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: [payload],
          target_lang: 'EN-US'
        })
      });

      const deepLData = await deepLRes.json();
      if (!deepLRes.ok) throw new Error(`DeepL Error: ${JSON.stringify(deepLData)}`);
      
      englishText = deepLData.translations[0].text;

    } else if (type === 'voice') {
      const SARVAM_API_KEY = Deno.env.get('SARVAM_API_KEY');
      if (!SARVAM_API_KEY) throw new Error('SARVAM_API_KEY is missing');

      // payload is base64 string, format: data:audio/webm;base64,.....
      const base64Data = payload.split(',')[1] || payload;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/webm' });

      const formData = new FormData();
      formData.append('file', blob, 'audio.webm');
      formData.append('model', 'saaras:v3');
      formData.append('mode', 'translate');
      formData.append('language_code', 'unknown');

      const sarvamRes = await fetch('https://api.sarvam.ai/speech-to-text-translate', {
        method: 'POST',
        headers: {
          'api-subscription-key': SARVAM_API_KEY
        },
        body: formData
      });

      const sarvamData = await sarvamRes.json();
      if (!sarvamRes.ok) throw new Error(`Sarvam Error: ${JSON.stringify(sarvamData)}`);
      
      englishText = sarvamData.transcript || sarvamData.text; // Depends on exact response shape
      if (!englishText) throw new Error('No transcript returned from Sarvam AI');
    }

    // Now send to Gemini
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is missing');

    const prompt = `You are an expert Cybercrime Investigator AI. 
Analyze the user's statement and extract relevant details into a predefined JSON structure.
Then, formulate up to 7 follow-up questions to gather missing critical information.
Keep questions simple and jargon-free.

Required Output Schema:
{
  "extracted_details": {
    "category": "Financial Fraud | Women/Children | Other",
    "incident_date": "string or null",
    "amount_lost": "number or null",
    "platform": "string or null",
    "suspect_info": "string or null"
  },
  "follow_up_questions": [
    {
      "id": "q1",
      "question": "Where did the fraud happen? (e.g., GPay, Bank)",
      "type": "select",
      "options": ["GPay", "Bank App", "Other"],
      "condition": null
    },
    {
      "id": "q2_gpay",
      "question": "Please upload a screenshot of the GPay transaction, or type the UTR number if you know it.",
      "type": "file_or_text",
      "condition": { "dependsOn": "q1", "value": "GPay" }
    }
  ]
}

Rules:
1. Limit follow-up questions to a maximum of 7.
2. If financial fraud is detected but no transaction ID/UTR is provided, ask for a 'file_or_text' (screenshot or text input). Make sure to specify the file should be an image.
3. Use the 'condition' field to create branching logic based on previous answers.
4. Output STRICTLY JSON matching the schema.

User Statement: "${englishText}"`;

    const modelsToTry = ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash'];
    let geminiData: any = null;
    let geminiRes: Response | null = null;

    for (const model of modelsToTry) {
      geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: "application/json"
          }
        })
      });

      geminiData = await geminiRes.json();
      
      // If it's a 503 (high demand) or 429 (rate limit), continue to the next model
      if (geminiRes.status === 503 || geminiRes.status === 429) {
        console.log(`${model} failed with ${geminiRes.status}, trying next...`);
        continue;
      }
      
      // Otherwise, break (success or other hard error)
      break;
    }

    if (!geminiRes || !geminiRes.ok) {
      throw new Error(`Gemini Error: ${JSON.stringify(geminiData)}`);
    }

    const jsonString = geminiData.candidates[0].content.parts[0].text;
    const finalResult = JSON.parse(jsonString);
    finalResult.original_transcript = englishText;

    return new Response(JSON.stringify({ success: true, data: finalResult }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
