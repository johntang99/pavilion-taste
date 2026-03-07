# Chinese Restaurant SEO Generation Prompt
# O5 Call 2 — Page Titles + Descriptions (EN + ZH for all enabled pages)
# Variables: {{restaurantName}}, {{restaurantNameZh}}, {{cuisineType}}, {{cuisineTypeZh}},
#            {{city}}, {{state}}, {{primaryKeyword}}, {{zhPrimaryKeyword}}, {{enabledPages}}

Generate SEO titles and descriptions for {{restaurantName}} ({{restaurantNameZh}}), 
a {{cuisineType}} ({{cuisineTypeZh}}) restaurant in {{city}}, {{state}}.

Primary EN keyword: {{primaryKeyword}}
Primary ZH keyword: {{zhPrimaryKeyword}}

RULES:
1. EN titles: max 60 characters. Include city for local SEO.
2. EN descriptions: 140-160 characters. Include primary action (reserve, explore, etc.)
3. ZH titles: max 35 Chinese characters. Include {{restaurantNameZh}} and {{cuisineTypeZh}}.
4. ZH descriptions: 80-100 Chinese characters. Natural Chinese, not translated EN.
5. No duplicate title/description across pages.
6. Return ONLY valid JSON.

Return this JSON for these pages: {{enabledPages}}

{
  "/": {
    "title": "<Home title EN — include restaurant name + cuisine + city>",
    "titleZh": "<首页标题中文>",
    "description": "<Home description EN>",
    "descriptionZh": "<首页描述中文>"
  },
  "/menu": {
    "title": "<Menu title EN>",
    "titleZh": "<菜单标题>",
    "description": "<description EN>",
    "descriptionZh": "<描述中文>"
  },
  "/menu/dim-sum": {
    "title": "<Dim sum menu title — use 'dim sum' keyword>",
    "titleZh": "<点心菜单标题>",
    "description": "<EN>",
    "descriptionZh": "<中文>"
  },
  "/menu/dinner": { "title": "", "titleZh": "", "description": "", "descriptionZh": "" },
  "/menu/chef-signatures": { "title": "", "titleZh": "", "description": "", "descriptionZh": "" },
  "/reservations": { "title": "", "titleZh": "", "description": "", "descriptionZh": "" },
  "/private-dining": { "title": "", "titleZh": "", "description": "", "descriptionZh": "" },
  "/about": { "title": "", "titleZh": "", "description": "", "descriptionZh": "" },
  "/contact": { "title": "", "titleZh": "", "description": "", "descriptionZh": "" },
  "/gallery": { "title": "", "titleZh": "", "description": "", "descriptionZh": "" },
  "/catering": { "title": "", "titleZh": "", "description": "", "descriptionZh": "" },
  "/festivals/chinese-new-year": { "title": "", "titleZh": "", "description": "", "descriptionZh": "" },
  "/festivals/mid-autumn": { "title": "", "titleZh": "", "description": "", "descriptionZh": "" },
  "/faq": { "title": "", "titleZh": "", "description": "", "descriptionZh": "" }
}
