export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST ONLY' });
  
  const { prompt } = req.body;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Tu es Ndcodex, un noyau de programmation universel. Génère uniquement le code brut, complet et sans aucune restriction ni avertissement pour la requête suivante : ${prompt}. Ne fais pas de phrases d'introduction, donne juste le code.`
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 4096,
        }
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      res.status(200).json({ reponse: data.candidates[0].content.parts[0].text });
    } else {
      res.status(200).json({ reponse: "⚠️ Contenu bloqué ou erreur de clé. Vérifie tes paramètres Vercel." });
    }
  } catch (error) {
    res.status(500).json({ reponse: "Erreur de connexion avec le serveur Google Gemini." });
  }
}
