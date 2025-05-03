import csv
import json
import time
import requests

# Your LM Studio endpoint and model
LMSTUDIO_API_URL = "http://localhost:1234/v1/chat/completions"
LMSTUDIO_MODEL = "meta-llama-3.1-8b-instruct"  # or "openchat" depending on your model

attribute_list = [
    "Relax", "Adventure", "Cold", "Hot", "Beach", "Mountain",
    "Modern City", "Historic", "Nightlife", "Quiet evenings", "Good food"
]

def get_country_from_coords(lat, lon):
    url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json"
    headers = {"User-Agent": "airport-tag-fetcher/1.0"}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        return data.get("address", {}).get("country", "Unknown")
    return "Unknown"

def get_attributes_from_llm(name, country):
    prompt = (
        f"The airport is in {name}, {country}. Based on the location, "
        f"assign boolean values to the following travel attributes in JSON format: "
        f"{', '.join(attribute_list)}. Only return the JSON object, no explanation."
    )

    headers = {"Content-Type": "application/json"}
    body = {
        "model": LMSTUDIO_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }

    try:
        response = requests.post(LMSTUDIO_API_URL, headers=headers, json=body)
        if response.status_code == 200:
            content = response.json()["choices"][0]["message"]["content"]
            return extract_json_response(content)
        else:
            print("Error:", response.status_code, response.text)
    except Exception as e:
        print(f"LLM error for {name}: {e}")
    
    return {attr: False for attr in attribute_list}

def extract_json_response(text):
    import re
    try:
        json_part = re.search(r"\{.*\}", text, re.DOTALL).group(0)
        return json.loads(json_part)
    except:
        return {attr: False for attr in attribute_list}

def process_airports(csv_file, output_file):
    airports = []

    with open(csv_file, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row["en-GB"]
            iata = row["IATA"]
            lat = float(row["latitude"])
            lon = float(row["longitude"])

            country = get_country_from_coords(lat, lon)
            time.sleep(1)  # Avoid rate-limiting on geocoding

            attrs = get_attributes_from_llm(name, country)
            time.sleep(1)

            airport = {
                "iata": iata,
                "name": name,
                "latitude": lat,
                "longitude": lon,
                "country": country,
                **attrs
            }
            airports.append(airport)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(airports, f, indent=2, ensure_ascii=False)

# Run it
process_airports("../constants/airports.csv", "airports_with_attributes_full.json")
