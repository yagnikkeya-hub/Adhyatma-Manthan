import random

RESPONSES = {

    "fear": [
        {
            "shloka": "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः | आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत ||",
            "source": "Bhagavad Gita 2.14",
            "meaning": "Pleasure and pain, fear and sorrow are temporary. They come and go, so face them patiently and courageously.",
            "explanation": "Lord Krishna teaches Arjuna that difficult feelings and situations do not last forever. This verse reminds us to remain patient and face challenges with courage.",
            "application": "When you feel afraid about an exam, a presentation, or your future, remember that difficult situations can change.",
            "practical_action": "Take five slow, deep breaths. Remind yourself: 'This situation is temporary. I will stay calm and focus on my next step.'"
        },
        {
            "shloka": "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥",
            "source": "Rigveda 7.59.12 — Mahamrityunjaya Mantra",
            "meaning": "We pray to Lord Shiva for strength, well-being, and freedom from the fear of death.",
            "explanation": "This mantra is a prayer to Lord Shiva for strength and freedom from fear. It reminds devotees to face difficult moments with faith, courage, and a calm mind.",
            "application": "When you feel afraid about an uncertain future or a major change in life, take a moment to pray and gather your thoughts.",
            "practical_action": "Take five slow breaths and chant the mantra if you wish. Remind yourself: 'I will face this moment with faith and courage.'"
        },
        {
            "shloka": "मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम्। वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये॥",
            "source": "Traditional Hanuman Dhyana Shloka — Prayer to Lord Hanuman",
            "meaning": "I seek the protection of Lord Hanuman, who is swift, wise, self-controlled, and devoted to Lord Rama.",
            "explanation": "This prayer praises Hanuman ji for his courage, wisdom, and self-control. It reminds us that strength also means making wise choices and staying determined during difficult times.",
            "application": "When you feel nervous before an examination, presentation, or difficult conversation, remember Hanuman ji's courage and take the first step instead of avoiding the challenge.",
            "practical_action": "Choose one task you have been avoiding because of fear. Break it into a small step and complete it. Remind yourself: 'I can act with courage even when I feel nervous.'"
        },
        {
            "shloka": "या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता। नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः॥",
            "source": "Devi Mahatmya — Chapter 5, Devi Stuti",
            "meaning": "I bow again and again to the Goddess who lives in all beings as strength and power.",
            "explanation": "This verse honours the Divine Mother as a source of strength. It reminds us that even when we feel weak, we can find the courage to keep trying and begin again.",
            "application": "When you doubt yourself or feel incapable of doing something, remember this prayer and focus on the strength you can use now.",
            "practical_action": "Write down one thing you find difficult and one small step you can take to improve it. Remind yourself: 'I can learn, grow, and try again.'"
        },
        {
            "shloka": "सर्वस्वरूपे सर्वेशे सर्वशक्तिसमन्विते। भयेभ्यस्त्राहि नो देवि दुर्गे देवि नमोऽस्तु ते॥",
            "source": "Devi Mahatmya 11.24 — Prayer to Goddess Durga",
            "meaning": "O Goddess Durga, who possesses all forms and powers, please protect us from fear. We bow to You.",
            "explanation": "This prayer asks Goddess Durga for protection from fear and difficulties. It reminds devotees to seek strength through faith and to think calmly when facing uncertainty.",
            "application": "When you feel worried about what might happen or feel helpless, pray to Maa Durga and consider the next safe action you can take.",
            "practical_action": "Take five slow breaths and offer a prayer to Maa Durga. Identify one thing within your control and act on it."
        },
        {
            "shloka": "संकट कटै मिटै सब पीरा। जो सुमिरै हनुमत बलबीरा॥",
            "source": "Hanuman Chalisa — Chaupai traditionally numbered 36",
            "meaning": "Remembering the mighty and courageous Lord Hanuman is believed to bring relief from troubles and suffering.",
            "explanation": "This chaupai expresses faith in Hanuman ji's strength and his ability to help devotees through difficult times. Remembering him can encourage courage, patience, and determination.",
            "application": "When you feel nervous before an important task, face a setback, or feel like giving up, remember Hanuman ji's courage and dedication.",
            "practical_action": "Recite this chaupai if it is part of your devotional practice. Then choose one useful action to handle your problem. Remind yourself: 'I will move forward with courage and determination.'"
        }
    ],

    "anger": [
        {
            "shloka": "क्रोधाद्भवति सम्मोहः सम्मोहात्स्मृतिविभ्रमः | स्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति ||",
            "source": "Bhagavad Gita 2.63",
            "meaning": "Anger leads to clouded judgment, which destroys memory, and the loss of intellect leads to ruin.",
            "explanation": "Lord Krishna maps out how anger hijacks human psychology. When you react in anger, you lose the ability to think logically and make decisions you end up regretting deeply.",
            "application": "In college group work, family discussions, or social media arguments, do not let temporary anger ruin relationships or peace of mind.",
            "practical_action": "Practice the 10-second rule: Before sending an angry text or speaking in irritation, count backwards from 10 and drink a glass of water."
        }
    ],

    "career": [
        {
            "shloka": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन | मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ||",
            "source": "Bhagavad Gita 2.47",
            "meaning": "You have a right only to perform your actions, never to the fruits. Do not let outcomes be your motive, nor fall into inaction.",
            "explanation": "Lord Krishna gives the ultimate advice for career and academics: worrying about job placements, exam ranks, and packages only drains mental energy. Channel 100% of your energy into building skills and mastering your subjects.",
            "application": "Focus sincerely on today's study or coding tasks rather than anxiously predicting what will happen months down the line.",
            "practical_action": "Set a dedicated timer for 45 minutes right now. Study or work without touching your phone. Offer the effort to God."
        }
    ],

    "motivation": [
        {
            "shloka": "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् | आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ||",
            "source": "Bhagavad Gita 6.5",
            "meaning": "Elevate yourself through your own mind; do not pull yourself down. The mind is your best friend and worst enemy.",
            "explanation": "Lack of motivation often stems from negative self-talk, procrastination, and feeling overwhelmed. Krishna says you possess the inner spark to reignite your purpose whenever you choose.",
            "application": "Stop waiting for external inspiration or relying on short video reels. Reconnect with why you started and take small, steady steps.",
            "practical_action": "Write down your single most important goal for today on a piece of paper, place it on your desk, and complete just the first 10 minutes of it."
        }
    ],

    "discipline": [
        {
            "shloka": "युक्ताहारविहारस्य युक्तचेष्टस्य कर्मसु | युक्तस्वप्नावबोधस्य योगो भवति दुःखहा ||",
            "source": "Bhagavad Gita 6.17",
            "meaning": "For one who is disciplined in eating, resting, working, and sleeping, Yoga eliminates all sorrow.",
            "explanation": "Discipline is not torture; it is healthy balance (Yukta). Modern student life gets disrupted by late-night scrolling and irregular routines. Divine wisdom advocates balanced daily habits.",
            "application": "Build a simple daily routine with fixed sleep and study hours to maintain mental clarity and high academic performance.",
            "practical_action": "Commit to putting your phone on silent and away from your bed at least 30 minutes before you sleep tonight."
        }
    ],

    "sadness": [
        {
            "shloka": "दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः | वीतरागभयक्रोधः स्थितधीर्मुनिरुच्यते ||",
            "source": "Bhagavad Gita 2.56",
            "meaning": "One whose mind remains unperturbed amidst sorrow, unattached to pleasure, and free from fear and anger, is a person of steady mind.",
            "explanation": "It is completely human to feel sorrow. Even Arjuna wept on the battlefield. Lord Krishna teaches us not to suppress sadness, but to observe it as a temporary wave on the ocean of consciousness.",
            "application": "Allow yourself to feel, but remind yourself that grief does not define who you are. Divine comfort is always present within.",
            "practical_action": "Sit in a quiet space, close your eyes, and chant 'Om' softly 7 times. Let your mind rest in the presence of the Divine."
        }
    ],

    "loneliness": [
        {
            "shloka": "ईश्वरः सर्वभूतानां हृद्देशेऽर्जुन तिष्ठति |",
            "source": "Bhagavad Gita 18.61",
            "meaning": "The Supreme Divine resides in the hearts of all living beings, O Arjuna.",
            "explanation": "You are never isolated or alone. The Divine companion walks with you in every breath. Turning inward transforms feeling lonely into a peaceful state of solitude.",
            "application": "When friends or peers seem distant, use this time to build a personal, loving connection with God through prayer and reflection.",
            "practical_action": "Speak to God just as you would talk to a caring, compassionate best friend. Share your honest burdens."
        }
    ],

    "god": [
        {
            "shloka": "यो मां पश्यति सर्वत्र सर्वं च मयि पश्यति | तस्याहं न प्रणश्यामि स च मे न प्रणश्यति ||",
            "source": "Bhagavad Gita 6.30",
            "meaning": "For one who sees Me in all things and all things in Me, I am never lost to them, nor are they lost to Me.",
            "explanation": "God is not confined to stone temples or distant skies. The Divine is present in nature, in every act of kindness, and in your own heart.",
            "application": "Recognize the sacred divinity in parents, teachers, friends, animals, and your own daily actions.",
            "practical_action": "Perform one small act of kindness today—feed a bird, help a classmate, or thank your parents sincerely."
        }
    ],

    "why_bad_things": [
        {
            "shloka": "गहना कर्मणो गतिः |",
            "source": "Bhagavad Gita 4.17",
            "meaning": "Deep, intricate, and mysterious is the way of Karma.",
            "explanation": "Life brings storms not to punish us, but as karmic lessons to awaken spiritual resilience, compassion, and maturity. Gold must pass through fire to become pure. Your struggles are shaping your character.",
            "application": "When facing unfair situations, focus not on 'Why me?' but on 'What is this situation teaching me to become?'",
            "practical_action": "Write down 2 strengths you developed from a previous hardship in your life, and trust that this current difficulty will also pass."
        }
    ],

    "default": [
        {
            "shloka": "तमसो मा ज्योतिर्गमय | मृत्योर्मा अमृतं गमय |",
            "source": "Brihadaranyaka Upanishad 1.3.28",
            "meaning": "Lead me from darkness to light, lead me from death to immortality.",
            "explanation": "Every sincere question asked with a pure heart is the beginning of wisdom. In Sanatan Dharma, questioning and seeking are honored as sacred spiritual practices.",
            "application": "Keep seeking truth and righteousness (Dharma) in your daily life with an open mind.",
            "practical_action": "Reflect on what ethical choice you can make today that brings you closer to your highest values."
        }
    ]
}

def get_spiritual_response(user_message):
    """
    Takes user's message, matches keywords, and returns a structured response:
    - Relevant Shloka
    - Source Scripture
    - Meaning
    - Simple Explanation
    - Real-Life Application
    - Practical Action
    """
    msg = user_message.lower().strip()

    keyword_map = {
        "fear": ["afraid", "fear", "scared", "phobia", "nervous", "terror"],
        "anger": ["anger", "angry", "rage", "irritat", "frustrat", "temper"],
        "career": ["exam", "fail", "marks", "job", "career", "study", "college", "future", "interview"],
        "motivation": ["motivation", "lazy", "procrastinat", "give up", "hopeless", "lost energy", "stuck"],
        "discipline": ["discipline", "routine", "habit", "focus", "distraction", "phone addiction", "scroll"],
        "sadness": ["sad", "depress", "unhappy", "cry", "grief", "pain", "sorrow", "hurt"],
        "loneliness": ["lonely", "alone", "isolated", "no friends", "left out"],
        "why_bad_things": ["why bad", "bad things", "unfair", "suffering", "why me", "punish"],
        "god": ["god", "bhagwan", "krishna", "shiva", "prayer", "worship", "divine", "faith"]
    }

    matched_category = None
    for category, keywords in keyword_map.items():
        for kw in keywords:
            if kw in msg:
                matched_category = category
                break
        if matched_category:
            break

    if matched_category and matched_category in RESPONSES:
        item = random.choice(RESPONSES[matched_category])
    else:
        item = random.choice(RESPONSES["default"])

    output = (
        f"**Relevant Shloka:**\n_{item['shloka']}_\n\n"
        f"**Source Scripture:** {item['source']}\n\n"
        f"**Meaning:**\n{item['meaning']}\n\n"
        f"**Simple Explanation:**\n{item['explanation']}\n\n"
        f"**Real-Life Application:**\n{item['application']}\n\n"
        f"**Practical Action For Today:**\n{item['practical_action']}"
    )
    return output
