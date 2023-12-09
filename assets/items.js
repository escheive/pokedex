export const items = [
  {
    "__typename": "pokemon_v2_item", 
    "cost": 0, 
    "fling_power": null, 
    "id": 1, 
    "name": "master-ball", 
    "pokemon_v2_itemcategory": {
      "__typename": "pokemon_v2_itemcategory", 
      "name": "standard-balls", 
      "pokemon_v2_itempocket": {
        "__typename": "pokemon_v2_itempocket", 
        "name": "pokeballs"
      }
    }, 
    "pokemon_v2_itemeffecttexts": [
      {
        "__typename": "pokemon_v2_itemeffecttext", 
        "effect": `Used in battle
          :   Catches a wild Pokémon without fail.

          If used in a trainer battle, nothing happens and the ball is lost.", "short_effect": "Catches a wild Pokémon every time.`
      }

    ], 
    "pokemon_v2_itemflavortexts": [
      {
        "__typename": "pokemon_v2_itemflavortext", 
        "flavor_text": `The best Poké Ball with the ultimate level of
        performance. With it, you will catch any wild
        Pokémon without fail.`,
        "pokemon_v2_versiongroup": {
          "__typename": "pokemon_v2_versiongroup", 
          "generation_id": 8
        }
      }
    ],
    "pokemon_v2_itemflingeffect": null
  },
];