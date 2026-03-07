# Chinese Restaurant Content Generation Prompt
# O5 Call 1 — Hero, Chef Bio, About Story, Testimonials (EN + ZH)
# Variables: {{restaurantName}}, {{restaurantNameZh}}, {{ownerName}}, {{ownerNameZh}},
#            {{chefOrigin}}, {{chefTraining}}, {{cuisineType}}, {{cuisineTypeZh}},
#            {{city}}, {{foundedYear}}, {{voice}}

You are generating authentic, premium restaurant website copy for {{restaurantName}} ({{restaurantNameZh}}), 
a {{cuisineType}} restaurant in {{city}}, founded in {{foundedYear}}.

Chef: {{ownerName}} ({{ownerNameZh}}) · Origin: {{chefOrigin}} · Training: {{chefTraining}}
Voice/Tone: {{voice}} (warm-traditional-authoritative | modern-energetic | refined-minimal)

CRITICAL RULES:
1. Generate EN and ZH versions simultaneously — DO NOT auto-translate
2. ZH content must be idiomatic Chinese, not translated English
3. No mention of "Grand Pavilion" or "大观楼" — replace with {{restaurantName}}/{{restaurantNameZh}}
4. Chef's ZH name: {{ownerNameZh}}
5. ZH copy must be grammatically natural Chinese (Simplified, mainland standard)
6. DO NOT include placeholder text like [insert] or [TBD]
7. Return ONLY valid JSON — no markdown, no code blocks

Return this exact JSON structure:

{
  "hero": {
    "tagline": "<3-8 words, evocative, cuisine-specific EN>",
    "taglineZh": "<3-6 Chinese characters, poetic>",
    "description": "<2-sentence restaurant description EN, 60-80 words>",
    "descriptionZh": "<equivalent in natural Chinese, 40-60 characters>"
  },
  "aboutStory": "<3-paragraph origin story EN, 150-200 words. Specific to {{chefOrigin}} and {{cuisineType}}>",
  "aboutStoryZh": "<equivalent in natural Chinese, 150-180 characters per paragraph>",
  "chefBio": "<3-paragraph chef biography EN, 120-160 words. Specific to {{ownerName}}, {{chefOrigin}}, {{chefTraining}}>",
  "chefBioZh": "<equivalent in natural Chinese>",
  "chefQuote": "<1-2 sentences, first person, craft/philosophy focused EN>",
  "chefQuoteZh": "<equivalent in natural Chinese>",
  "testimonials": [
    { "name": "<EN name>", "text": "<review EN, 30-50 words, authentic>", "rating": 5, "source": "Google" },
    { "name": "<EN name>", "text": "<review EN>", "rating": 5, "source": "Yelp" },
    { "nameZh": "<Chinese name>", "textZh": "<review in Chinese, 40-60 characters, authentic>", "rating": 5, "source": "Google" },
    { "name": "<EN name>", "text": "<review EN>", "rating": 5, "source": "Google" },
    { "nameZh": "<Chinese name>", "textZh": "<review in Chinese>", "rating": 5, "source": "Google" },
    { "name": "<EN name>", "text": "<private dining review EN>", "rating": 5, "source": "Google" }
  ],
  "whyChooseUs": [
    { "icon": "award", "title": "<4-6 words EN>", "titleZh": "<3-5 characters>", "description": "<20-30 words EN>" },
    { "icon": "globe", "title": "<bilingual service angle>", "titleZh": "<ZH>", "description": "<EN>" },
    { "icon": "calendar", "title": "<festival/tradition angle>", "titleZh": "<ZH>", "description": "<EN>" },
    { "icon": "users", "title": "<banquet/private dining angle>", "titleZh": "<ZH>", "description": "<EN>" },
    { "icon": "star", "title": "<chef/technique angle>", "titleZh": "<ZH>", "description": "<EN>" }
  ],
  "announcementBar": "<1-sentence, time-sensitive announcement EN, mention upcoming festival or special if relevant>",
  "announcementBarZh": "<equivalent in Chinese>"
}
