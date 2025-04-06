const API_KEY = 'AIzaSyAXiO-3nKD9QUNNIiAYHwcw5GE7NDeLa8c';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

document.getElementById('preferenceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const game = document.getElementById('game').value;
    const playstyle = document.getElementById('playstyle').value;
    const preferences = document.getElementById('preferences').value;
    
    const recommendationsContainer = document.getElementById('recommendations');
    recommendationsContainer.innerHTML = '<div class="loading">Generating recommendations...</div>';
    
    try {
        const prompt = `As a game skin recommender, suggest appropriate skins and costumes for a ${playstyle} player in ${game}. 
        Additional preferences: ${preferences}. 
        Please provide specific skin names and their descriptions, focusing on how they benefit the player's playstyle.
        Format the response with clear sections for character skins and weapon skins.`;
        
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const recommendations = data.candidates[0].content.parts[0].text;
            displayRecommendations(recommendations);
        } else {
            throw new Error('No recommendations found');
        }
    } catch (error) {
        recommendationsContainer.innerHTML = `
            <div class="error">
                <p>Sorry, there was an error generating recommendations. Please try again later.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
});

function displayRecommendations(recommendations) {
    const recommendationsContainer = document.getElementById('recommendations');
    
    // Split the recommendations into sections
    const sections = recommendations.split('\n\n');
    
    let html = '';
    
    sections.forEach(section => {
        if (section.trim()) {
            const lines = section.split('\n');
            const title = lines[0];
            const description = lines.slice(1).join('<br>');
            
            html += `
                <div class="recommendation-card">
                    <div class="recommendation-title">${title}</div>
                    <div class="recommendation-description">${description}</div>
                </div>
            `;
        }
    });
    
    recommendationsContainer.innerHTML = html || '<p>No recommendations found. Please try different preferences.</p>';
}
