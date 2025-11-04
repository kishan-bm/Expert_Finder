
# Smart Expert Discovery Platform (Assignment)

- "Smart Expert Discovery Platform" that allows users to search for experts on a given topic. The platform features a React frontend and a Node.js backend that integrates with the Google Gemini GenAI to provide dynamic, intelligent insights for each expert.

# Features
1. Full-Stack Application: A complete solution with a React frontend and a Node.js (Express) backend.

2. Real GenAI Integration: Used the Google Gemini 2.5 Flash model to generate unique, relevant "AI Insights" for each expert based on the user's search query.

3. Intelligent Caching: Implemented an in-memory cache to store AI-generated insights. Subsequent searches for the same expert/topic pair are instantaneous, reducing API costs and wait times.

4. Robust Fallback System: If the GenAI model fails (due to network issues, API limits, etc.), the system automatically and seamlessly falls back to a mock insight, ensuring the user always gets a response.

# Tech Stack
- Frontend: React.js, Axios (for API requests), CSS (for custom styling)
- Backend: Node.js, Express.js, Google Gemini AI (@google/generative-ai), dotenv (for secure API key management), cors (for cross-origin requests)

# Getting Started
To get this project up and running on your local machine, follow these steps.

Prerequisites
- Node.js (v14.0 or later)
- npm (Node Package Manager)
- Google Gemini API Key or any other AI model API Key and make the changes accordingly in the backend.

Step 1: Clone the Repository
Clone this project to your local machine.

Step 2: Backend Setup
First, we will set up and start the backend server.

Navigate to the backend directory:
cd expert-finder-backend
Install the necessary dependencies:

npm install

Create your Environment File: Create a new file named .env in the root of the expert-finder-backend folder. Paste your AI model API key into it like this:
GEMINI_API_KEY=YOUR_API_KEY_HERE

Start the backend server:
npm run dev

The server will start on http://localhost:8000. You should see a message: Server is running on http://localhost:8000.

Step 3: Frontend Setup
Open a new terminal window for this step. (Leave your backend server running in the first terminal).

Navigate to the frontend directory:

cd expert-finder-frontend
Install the necessary dependencies:

npm install
Start the frontend application:

npm start
Your default browser should automatically open http://localhost:3000.

You can now use the application!


# How It Works
1. Start Both Servers: Run the backend (npm run dev) and the frontend (npm start) in two separate terminals as described in the "Getting Started" section.

2. Open the App: Navigate to http://localhost:3000 in your browser.

3. Enter a Topic: Type a topic or skill you are interested in (e.g., "fitness," "career," "art") into the search bar. 

4. Find Experts: click the "Find Experts" button. 

5. View Results: The application will fetch the 3-5 most relevant experts  from the database. Each expert card will display their name , category , bio , rating , location , and a unique "AI Insight"  explaining why they are a good match for your topic.

6. Loading & Errors: While the results are being fetched, a "Loading..." message will appear. If the search field is empty or an API error occurs, the app will display a clear and helpful message.


# Future Enhancements
While this application fulfills all the core requirements, here are several enhancements that could be implemented to scale it into a production-grade platform:

1. Real Database Integration: Replace the in-memory data.json file with a scalable database like PostgreSQL or MongoDB. This would allow for thousands of experts and real-time updates.

2. Pagination: Instead of limiting results to 5, implement frontend pagination (< 1, 2, 3 ... >) or an "infinite scroll" feature to allow users to browse through all matching experts.

3. Advanced AI Matching: 
Embeddings: For a much more powerful search, convert each expert's bio into a vector embedding. This would allow for semantic search (e.g., a search for "getting a new job" would match an expert in "career transitions" even if the words don't match).

4. AI Chat: Allow users to click a button to open a chat modal and ask the expert (or an AI agent) a follow-up question.

5. Persistent Caching: The current in-memory cache is fast but resets every time the server restarts. Implementing a Redis cache would make the cached insights persistent and shareable across multiple server instances.

6. User Authentication: Add user login (e.g., with JWT) to allow users to save their favorite experts, write reviews, and book appointments.

7. Dedicated UI Components: Split the App.js file into smaller, reusable components (e.g., SearchBar.js, ExpertList.js, ExpertCard.js) for better maintainability.


# Author
Name: Kishan B M
Email: kishanbm22@gmail.com
LinkedIn: linkedin.com/in/kishanbm