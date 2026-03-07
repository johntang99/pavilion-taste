# Chinese Restaurant Menu Description Rewrite Prompt
# O5 Call 3 — Rewrite menu descriptions to be unique per client
# Variables: {{restaurantName}}, {{restaurantNameZh}}, {{cuisineType}}, {{voice}},
#            {{enabledMenuTypes}}, {{menuItems}}

You are rewriting menu item descriptions for {{restaurantName}} ({{restaurantNameZh}}), 
a {{cuisineType}} restaurant. Voice: {{voice}}.

The following menu items need unique descriptions. Rewrite ONLY `description` and `shortDescription` fields.
DO NOT change: name, nameZh, price, slug, or any other fields.

RULES:
1. Each description must be unique — no two items should have the same description
2. Preserve the dish's cultural context and accuracy
3. EN descriptions: 15-35 words, sensory and specific
4. DO NOT change nameZh under any circumstances
5. Chef's signature items: add brief technique callout (e.g. "slow-braised", "wok-tossed over high heat")
6. Dim sum items: emphasize freshness and traditional technique
7. Return ONLY the modified items as JSON array

Input items: {{menuItems}}

Return JSON array of objects with ONLY these fields changed:
[
  {
    "slug": "<unchanged>",
    "description": "<new EN description>",
    "shortDescription": "<new EN short description, 8-12 words>"
  }
]
