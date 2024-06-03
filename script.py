import json

# Otvaranje JSON fajla i učitavanje podataka
with open('Datafiniti_Fast_Food_Restaurants_May19.json', 'r', encoding='utf-8') as file:
    restaurants = json.load(file)

# Rečnik za brojanje pojavljivanja svakog restorana
restaurant_count = {}

# Prolazak kroz listu restorana i brojanje pojavljivanja
for restaurant in restaurants:
    name = restaurant['name']
    if name in restaurant_count:
        restaurant_count[name] += 1
    else:
        restaurant_count[name] = 1

# Sortiranje restorana po broju pojavljivanja, od najvećeg ka najmanjem
sorted_restaurants = sorted(restaurant_count.items(), key=lambda x: x[1], reverse=True)

# Ispis restorana koji se najčešće pojavljuju
print("Restorani koji se najčešće pojavljuju:")
for name, count in sorted_restaurants:
    print(f"{name}: {count} puta")

top_n = 5  # Broj restorana koje želite da prikažete
print(f"\nTop {top_n} najčešće pojavljivanih restorana:")
for name, count in sorted_restaurants[:top_n]:
    print(f"{name}: {count} puta")
