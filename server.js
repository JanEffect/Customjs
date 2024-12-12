const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware om JSON-data te verwerken
app.use(bodyParser.json());

// Endpoint om de GPT API aan te roepen
app.post('/process', async (req, res) => {
    const { prompt } = req.body; // Ontvang de prompt vanuit het verzoek

    if (!prompt) {
        return res.status(400).json({ error: 'Geen prompt meegegeven in het verzoek.' });
    }

    try {
        // Roep de OpenAI API aan
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Gebruik de API-sleutel uit de omgeving
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "text-davinci-003", // Of een ander model dat je wilt gebruiken
                prompt: prompt,
                max_tokens: 150
            })
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Fout bij het ophalen van GPT-antwoord.' });
        }

        const data = await response.json();
        const generatedText = data.choices[0].text.trim();

        // Stuur het gegenereerde antwoord terug naar de client
        res.json({ generatedText });
    } catch (error) {
        console.error('Fout bij het verwerken van de GPT-aanroep:', error);
        res.status(500).json({ error: 'Interne serverfout.' });
    }
});

// Start de server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
