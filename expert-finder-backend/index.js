const express = require('express');
const cors = require('cors');
const fs = require('fs');

require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = 8000;

// We use a Map for efficient storage and retrieval.
const insightCache = new Map();

const expertsData = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

app.use(cors());
app.use(express.json());

// --- Configure the Gemini API ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// "health check" route
app.get('/', (req, res) => {
  res.send('Expert Finder API is running!');
});

// --- Fallback: a mock response if in case the ai failes ---
const generateMockInsight = (expert, topic) => {
  return `This expert's focus on ${expert.category} makes them a strong match for your interest in ${topic}.`;
};

// --- GenAI insight with consistent cache mechanism ---
const getRealGenAIInsight = async (expert, searchTopic) => {
  try {
    const prompt = `
      You are an assistant on an expert discovery platform.
      A user is searching for an expert on the topic: "${searchTopic}".
      Here is an expert:
      - Name: ${expert.name}
      - Bio: ${expert.bio}
      - Category: ${expert.category}
      
      Your task is to write a two lines, professional "AI Insight" sentence (max 40 words)
      explaining WHY this expert is a good match for the topic.
      
      Do not use markdown. Do not use quotes.
      
      Example: This expert's experience in career coaching is ideal for professionals seeking a new role.
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const insight = text.trim();
    
    // --- searchTopic for the key ---
    const cacheKey = `${expert.id}-${searchTopic}`;
    insightCache.set(cacheKey, insight);
    
    return insight;

  } catch (error) {
    console.error(`Gemini API Error for expert ${expert.id}:`, error.message);
    return null;
  }
};



app.post('/experts', async (req, res) => {
  try {
    const searchTopic = (req.body.topic || '').toLowerCase();

    if (!searchTopic) {
      return res.status(400).json({ error: 'A topic is required in the request body.' });
    }

    // --- "whole word" Regular Expression for filtering and an case sensitive---
    const searchRegex = new RegExp(`\\b${searchTopic}\\b`, 'i');

    const filteredExperts = expertsData.filter(expert => {
      const categoryMatch = searchRegex.test(expert.category);
      const bioMatch = searchRegex.test(expert.bio);
      return categoryMatch || bioMatch;
    });

    const expertsWithInsights = await Promise.all(
      filteredExperts.map(async (expert) => {
        
        let insight;
        const cacheKey = `${expert.id}-${searchTopic}`;

        // 1. First, TRY to get the insight from the CACHE
        if (insightCache.has(cacheKey)) {
          
          insight = insightCache.get(cacheKey); // INSTANT!
        
        } else {
          
          // 2. If NOT in cache, TRY to get a real insight from the AI
          insight = await getRealGenAIInsight(expert, searchTopic);

          // 3. If the AI fails, use the MOCK insight
          if (!insight) {
            console.log(`FALLBACK: Using mock insight for expert ${expert.id}`);
            insight = generateMockInsight(expert, searchTopic);
          }
        }

        return {
          id: expert.id,
          name: expert.name,
          category: expert.category,
          bio: expert.bio,
          rating: expert.rating,
          location: expert.location,
          insight: insight
        };
      })
    );
    
    const finalExperts = expertsWithInsights.slice(0, 5);

    res.json({
      experts: finalExperts
    });

  } catch (serverError) {
    if (serverError instanceof SyntaxError) {
      res.status(400).json({ error: "Invalid search query. Please avoid special characters." });
    } else {
      console.error("Internal ServerError:", serverError);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Loaded ${expertsData.length} experts from data.json`);
});