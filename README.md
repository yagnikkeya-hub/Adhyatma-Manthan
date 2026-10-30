# Adhyatma Manthan
### AI-Powered Spiritual Guidance Platform

**5th Semester IT Project | Institute of Advanced Research (IAR), Gandhinagar**

---

## About the Project

Adhyatma Manthan is a web-based spiritual guidance platform that combines the timeless wisdom of **Sanatan Dharma** with modern technology. It helps users — especially teenagers and college students — connect with ancient scriptures like the **Bhagavad Gita**, **Upanishads**, **Ramayana**, **Mahabharata**, and **Vedas** in a simple, practical, and meaningful way.

The name "Adhyatma Manthan" means **"Churning of the Inner Self"** — inspired by the concept of Samudra Manthan, symbolizing the process of discovering deeper wisdom, discipline, and mental clarity within.

---

## All 10 Core Modules (As per Current Project Implementation)

| Module | Name | Features & Description |
|---|---|---|
| **Module 1** | **AI Spiritual Guide** | Conversational spiritual mentor addressing natural questions (*e.g., "Why am I afraid?", "How do I control anger?", "Scared of failing exams"*). Each response includes: Relevant Shloka, Source Scripture, Meaning, Simple Explanation, Real-life Application, and Practical Action. |
| **Module 2** | **Daily Shloka** | Compulsory daily rotating shloka complete with Sanskrit text in authentic Devanagari typography, pronunciation guide, English & Hindi translations, deeper meaning, real-life application, and a daily reflection question. |
| **Module 3** | **Shloka Library** | Filterable by life situations & emotions: *Fear, Courage, Anger, Discipline, Wisdom, Success, Failure, Patience, Gratitude, Friendship, Relationships, Devotion, Peace, and Self-confidence* with instant search and category filtering. |
| **Module 4** | **Daily Spiritual Check-in** | Morning reflections (*feeling & daily goal/Swadharma*) and Evening reflections (*challenges faced, helping others, gratitude, anger management, and lessons learned*) with AI spiritual recommendations. |
| **Module 5** | **Explore the Bhagavad Gita** | In-depth exploration of the Bhagavad Gita — featuring historical context, 7 core teachings, and a complete verse-by-verse study of Chapter 12 (*Bhakti Yoga - 20 Shlokas*) with Devanagari text, transliteration, English & Hindi meanings, and practical life applications. |
| **Module 6** | **Youth Corner** | Dedicated student guidance addressing: *Why pray?, Understanding the Divine, Connecting with God while studying, Handling negative peer pressure, Science & Sanatan Dharma, Building discipline, and Balancing modern digital life.* |
| **Module 7** | **Festival Companion** | Explores major festivals (*Diwali, Maha Shivaratri, Janmashtami, Navratri & Dussehra*) with history, spiritual significance, sacred stories, ritual meaning, regional traditions, charity ideas, moral lessons, and interactive quizzes. |
| **Module 8** | **Audio & Meditation** | Calming 432Hz Om vibrations, tanpura drones, temple bells, sacred mantras (*Maha Mrityunjaya, Gayatri, Shanti Mantra*), and guided Vedic pranayama breathing using the browser's Web Audio API. |
| **Module 9** | **Spiritual Growth Dashboard** | Tracks personal habit consistency: meditation streak, shloka reading, journal check-ins, active days, and non-competitive self-improvement. |
| **Module 10** | **Daily Dharma Challenge** | Practical daily challenges (*speaking kindly, nishkama seva, 10 minutes silence, parents gratitude, digital fasting*) with a submission box to save personal reflections directly into file storage. |

---

## Additional Institutional Pages

- **About Us Page (`/about`)**: Explains the vision, problem statement, academic course details, and affiliation with Institute of Advanced Research (IAR), Gandhinagar.
- **Contact Us Page (`/contact`)**: Allows students and visitors to submit feedback, questions, or suggestions, which are stored directly into `data/user_contact_messages.json`.

---

## Tech Stack (Tailored for 5th Sem IT Level - IAR, Gandhinagar)

| Layer | Technology | Why Chosen for 5th Sem Student |
|---|---|---|
| **Frontend** | HTML5, Modern & Scoped CSS3, Vanilla JavaScript | Responsive layouts, sacred editorial palette (midnight plum, warm parchment, antique gold), dropdown navigation, and clean layout structures taught in university labs. |
| **Backend** | Python 3, Flask | Simple, readable Python routing matching basic curriculum. |
| **Data Storage** | Normal JSON Files (`.json`) | **No database required.** Uses Python standard library file handling (`open()`, `json.load()`, `json.dump()`). Easy to inspect in Notepad and explain in viva. |
| **Audio Engine** | Web Audio API (Synthesizer) | Generates peaceful, meditative 432Hz tones and harmonic resonance natively in the browser without heavy external audio files. |
| **AI / Logic** | Keyword matching + Curated Scripture Knowledge Base | Clean, beginner-friendly Python logic (`if/else`, dictionaries) that is 100% understandable in viva/evaluations. |

---

## Data Storage Files (`/data` directory)

The project uses normal human-readable `.json` files for storage:

- **Static Reference Files:**
  - `shlokas.json` — Curated shlokas with Hindi & English translations
  - `scriptures.json` — Bhagavad Gita background, 7 teachings, and Chapter 12 shlokas (12.1 to 12.20)
  - `youth.json` — 6 student life guidance topics
  - `festivals.json` — 4 festivals with quiz questions
  - `audio_meditation.json` — Mantras and meditation techniques
  - `challenges.json` — Daily Dharma challenges
- **User Activity Files (Created & Updated Automatically):**
  - `user_checkins.json` — Morning & evening emotional reflection records
  - `user_growth.json` — Daily habit completion records (meditation, shloka, etc.)
  - `user_reflections.json` — Dharma challenge reflection notes
  - `user_chat_history.json` — Log of spiritual guide chatbot questions & answers
  - `user_contact_messages.json` — Contact form messages submitted by visitors

---

## Project Structure