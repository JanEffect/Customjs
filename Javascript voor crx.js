function customInit() {
    document.addEventListener('DOMContentLoaded', function () {
        try {
            // Selecteer de elementen op basis van cx-data-additionalinfoid
            const customCheckbox = document.querySelector('[cx-data-additionalinfoid="7031"]');
            const customInputField = document.querySelector('[cx-data-additionalinfoid="7028"]');
            const customOutputField = document.querySelector('[cx-data-additionalinfoid="7029"]');

            // Controleer of alle velden beschikbaar zijn
            if (customCheckbox && customInputField && customOutputField) {
                customCheckbox.addEventListener('change', async function () {
                    if (this.checked) {
                        customOutputField.value = "Even geduld, de tekst wordt gegenereerd...";  // Laat gebruiker weten dat iets aan het gebeuren is
                        await customHandleCheckboxChange(customInputField.value, customOutputField);
                    } else {
                        customOutputField.value = '';
                    }
                });
            } else {
                throw new Error('Een of meerdere velden konden niet gevonden worden in de DOM.');
            }
        } catch (error) {
            console.error(error.message);
            alert('Er is een probleem opgetreden bij het initialiseren van de functionaliteit. Controleer of alle benodigde velden beschikbaar zijn.');
        }
    });
}

async function customHandleCheckboxChange(userInput, outputField) {
    if (!userInput) {
        alert('Vul een tekst in voordat je de checkbox inschakelt.');
        return;
    }

    const prompt = `
    Je bent een ervaren Nederlandse tekstschrijver gespecialiseerd in het schrijven van professionele, maar toegankelijke voorstelstukken voor kandidaten. Je tone of voice is professioneel, betrouwbaar, oplossingsgericht en subtiel enthousiasmerend. Gebruik de volgende richtlijnen bij het schrijven van het voorstelstuk:
    Persoonlijkheid: Laat het voorstelstuk energiek en betrouwbaar klinken. Positioneer de kandidaat als een waardevolle en direct inzetbare toevoeging voor het team.
    Taalgebruik: Schrijf in de jij-vorm en houd de tekst eenvoudig, helder en menselijk. Zorg dat de lezer zich direct aangesproken voelt, maar behoud een professionele ondertoon.
    Emotie en Toon: Zorg voor een enthousiaste en zelfverzekerde toon die vertrouwen opwekt en de kwaliteiten van de kandidaat benadrukt. Voeg een geruststellende onderlaag toe.
    Doelen: Benadruk de belangrijkste competenties en werkervaring van de kandidaat direct. Sluit af met een uitnodiging voor een kennismakingsgesprek.
    Vermijdingen: Gebruik geen formele taal zoals 'u,' geen overdreven superlatieven, en vermijd een negatieve of afwachtende toon.
    Schrijf een voorstelstuk op basis van de volgende notities: ${userInput}. Zorg dat het voorstelstuk goed gestructureerd is, met een inleiding, kernboodschap, en een afsluitende alinea. Gebruik een positieve en proactieve schrijfstijl.
    `;

    try {
        const response = await fetch('https://customjs.onrender.com/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        });

        if (response.ok) {
            const data = await response.json();
            const generatedText = data.generatedText.trim();
            outputField.value = generatedText;
        } else {
            console.error('Er is een fout opgetreden bij het ophalen van een antwoord.', response.statusText);
            outputField.value = 'Er ging iets mis bij het genereren van de tekst. Probeer het later opnieuw.';
        }
    } catch (error) {
        console.error('Er is een fout opgetreden:', error);
        outputField.value = 'Er ging iets mis bij het genereren van de tekst. Controleer je internetverbinding of probeer het later opnieuw.';
    }
}
