Requirements:
- Python 3.9 or newer
- A free Gemini API key from Google AI Studio

Setup:
Create and activate a virtual environment:
   python -m venv .venv
   .venv\Scripts\activate        # Windows
   source .venv/bin/activate     # macOS / Linux
Install the dependencies:
   pip install -r requirements.txt
Create a .env file in the project folder and add your key:
   GEMINI_API_KEY=your-api-key-here

Start the app:
   python app.py
Open http://127.0.0.1:5000 in your browser.

Usage:
Type an ingredient and press Enter to add it. Click an ingredient to remove it. Press Find recipes to get suggestions.


Free API tiers have rate limits, so wait a moment if you see a quota error.
