import os
from typing import Any

from google import genai


# =========================================================
# GEMINI CONFIGURATION
# =========================================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = (
    genai.Client(api_key=GEMINI_API_KEY)
    if GEMINI_API_KEY
    else None
)


# =========================================================
# GENERATE AI INSIGHT
# =========================================================

def generate_ai_insight(
    analysis_result: dict[str, Any],
    language: str = "English",
) -> dict[str, Any]:

    # -----------------------------------------------------
    # Check Gemini API key
    # -----------------------------------------------------

    if client is None:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured."
        )

    # -----------------------------------------------------
    # Supported languages
    # -----------------------------------------------------

    supported_languages = {
        "English",
        "Tamil",
        "Hindi",
    }

    if language not in supported_languages:
        language = "English"

    # -----------------------------------------------------
    # Gemini prompt
    # -----------------------------------------------------

    prompt = f"""
You are the Google AI intelligence layer of AirShield,
an AI-powered pollution monitoring and environmental
risk analysis system.

The existing AirShield machine-learning system has already
analysed a pollution event.

IMPORTANT RULES:

- Do NOT change the ML results.
- Do NOT recalculate the risk score.
- Do NOT invent measurements or sensor values.
- Use only the information provided in the analysis.
- Explain the results in a clear and understandable way.
- Provide practical and responsible public-safety guidance.
- This is an additional AI interpretation.
- It must NOT replace the existing AirShield ML prediction.
- Keep the response concise and useful.

EXISTING AIRSHIELD ML ANALYSIS:

{analysis_result}

LANGUAGE:

Generate the complete AI interpretation in {language}.

The response must contain these sections:

1. Situation Summary
2. Main Risk
3. Important Contributing Factors
4. Likely Pollution Source
5. Recommended Precautions

Make the explanation understandable to a normal citizen,
while preserving the important technical meaning of the
existing ML analysis.

Return only the readable report text.
"""

    # -----------------------------------------------------
    # Call Google Gemini
    # -----------------------------------------------------

    interaction = client.interactions.create(
        model="gemini-3.8-flash",
        input=prompt,
    )

    # -----------------------------------------------------
    # Extract generated text
    # -----------------------------------------------------

    ai_text = interaction.output_text

    if not ai_text:
        raise RuntimeError(
            "Gemini returned an empty response."
        )

    # -----------------------------------------------------
    # Return additional AI feature
    # -----------------------------------------------------

    return {
        "language": language,
        "ai_insight": ai_text,
    }