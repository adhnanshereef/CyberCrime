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
    const { imageBase64, expectedName } = await req.json();

    if (!imageBase64 || !expectedName) {
      throw new Error('imageBase64 and expectedName are required');
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is missing');

    const base64Data = imageBase64.split(',')[1] || imageBase64;
    const mimeType = imageBase64.includes('jpeg') || imageBase64.includes('jpg') ? 'image/jpeg' : 'image/png';

    const prompt = `You are a verification system. 
You are given an image of a National ID card (e.g., Aadhar, PAN Card, Passport, Voter ID, Driving License) and a user-provided name: "${expectedName}".
1. Detect the type of the ID card.
2. Check if the name on the ID card matches the user-provided name (allow for minor spelling variations or missing middle names).

Output STRICTLY in the following JSON schema:
{
  "id_type": "string or null",
  "name_match": boolean
}
`;

    const modelsToTry = ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash'];
    let geminiData: any = null;
    let geminiRes: Response | null = null;

    for (const model of modelsToTry) {
      geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                { inline_data: { mime_type: mimeType, data: base64Data } }
              ]
            }
          ],
          generationConfig: {
            response_mime_type: "application/json"
          }
        })
      });

      geminiData = await geminiRes.json();
      
      if (geminiRes.status === 503 || geminiRes.status === 429) {
        console.log(`${model} failed with ${geminiRes.status}, trying next...`);
        continue;
      }
      break;
    }

    if (!geminiRes || !geminiRes.ok) {
      throw new Error(`Gemini Error: ${JSON.stringify(geminiData)}`);
    }

    const jsonString = geminiData.candidates[0].content.parts[0].text;
    const finalResult = JSON.parse(jsonString);

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
