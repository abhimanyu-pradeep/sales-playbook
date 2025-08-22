import pandas as pd
import json
from slugify import slugify

# Load Excel
df = pd.read_excel(r"intent_analysis.xlsx", index_col=0)

def parse_intent_cell(cell):
    if pd.isna(cell):
        return []
    return [intent.strip() for intent in str(cell).split(",") if intent.strip()]

def dataframe_to_structure(df):
    data = []
    for vertical in df.columns:
        horizontals = []
        for horizontal in df.index:
            intents = parse_intent_cell(df.at[horizontal, vertical])
            horizontals.append({
                "name": horizontal,
                "id": slugify(f"{vertical}_{horizontal}"),
                "intents": intents
            })
        data.append({
            "vertical": vertical,
            "id": slugify(vertical),
            "horizontals": horizontals
        })
    return data

playbook = dataframe_to_structure(df)

# Save to JSON
with open("playbook.json", "w", encoding="utf-8") as f:
    json.dump(playbook, f, indent=2, ensure_ascii=False)

print("✅ playbook.json generated!")
