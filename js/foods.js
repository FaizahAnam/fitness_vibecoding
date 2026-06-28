// Food database — calories per 100g/100ml, per unit, per common measure
// perUnit = calories for one item (e.g. 1 almond, 1 blueberry, 1 egg)
// sizes   = calories for small / medium / large portion
// perTablespoon / perTeaspoon / perCup / perSlice / perCan = common measures
// defaultCalories = what to return when no quantity or unit is specified

const FOOD_DB = [
  // ── FRUITS ──────────────────────────────────────────────────────────────────
  { names: ['banana', 'bananas'], per100g: 89, sizes: { small: 72, medium: 100, large: 120 }, defaultCalories: 100 },
  { names: ['apple', 'apples'], per100g: 52, sizes: { small: 55, medium: 72, large: 95 }, defaultCalories: 72 },
  { names: ['orange', 'oranges'], per100g: 47, sizes: { small: 45, medium: 62, large: 86 }, defaultCalories: 62 },
  { names: ['blueberry', 'blueberries'], per100g: 57, perUnit: 1, defaultCalories: 57 },
  { names: ['strawberry', 'strawberries'], per100g: 32, perUnit: 4, defaultCalories: 32 },
  { names: ['raspberry', 'raspberries'], per100g: 52, perUnit: 1, defaultCalories: 52 },
  { names: ['grape', 'grapes'], per100g: 67, perUnit: 3, defaultCalories: 67 },
  { names: ['mango', 'mangoes', 'mangos'], per100g: 60, sizes: { small: 130, medium: 200, large: 280 }, defaultCalories: 200 },
  { names: ['pineapple'], per100g: 50, defaultCalories: 50 },
  { names: ['watermelon'], per100g: 30, defaultCalories: 30 },
  { names: ['avocado', 'avocados'], per100g: 160, sizes: { small: 136, medium: 234, large: 322 }, defaultCalories: 234 },
  { names: ['kiwi', 'kiwis', 'kiwifruit'], per100g: 61, perUnit: 42, defaultCalories: 42 },
  { names: ['pear', 'pears'], per100g: 57, sizes: { small: 82, medium: 101, large: 133 }, defaultCalories: 101 },
  { names: ['peach', 'peaches'], per100g: 39, sizes: { small: 51, medium: 59, large: 68 }, defaultCalories: 59 },
  { names: ['plum', 'plums'], per100g: 46, perUnit: 30, defaultCalories: 30 },
  { names: ['cherry', 'cherries'], per100g: 50, perUnit: 4, defaultCalories: 50 },
  { names: ['lemon', 'lemons'], per100g: 29, perUnit: 17, defaultCalories: 17 },
  { names: ['lime', 'limes'], per100g: 30, perUnit: 11, defaultCalories: 11 },
  { names: ['medjool date', 'medjool dates', 'date', 'dates'], per100g: 277, perUnit: 20, defaultCalories: 20 },
  { names: ['fig', 'figs'], per100g: 74, perUnit: 37, defaultCalories: 37 },
  { names: ['pomegranate'], per100g: 83, defaultCalories: 83 },
  { names: ['passion fruit', 'passionfruit'], per100g: 97, perUnit: 17, defaultCalories: 17 },

  // ── VEGETABLES ──────────────────────────────────────────────────────────────
  { names: ['broccoli'], per100g: 34, defaultCalories: 34 },
  { names: ['spinach'], per100g: 23, defaultCalories: 23 },
  { names: ['kale'], per100g: 35, defaultCalories: 35 },
  { names: ['carrot', 'carrots'], per100g: 41, sizes: { small: 20, medium: 25, large: 35 }, perUnit: 25, defaultCalories: 25 },
  { names: ['cucumber', 'cucumbers'], per100g: 16, defaultCalories: 16 },
  { names: ['tomato', 'tomatoes'], per100g: 18, sizes: { small: 16, medium: 22, large: 33 }, perUnit: 22, defaultCalories: 22 },
  { names: ['cherry tomato', 'cherry tomatoes'], per100g: 18, perUnit: 3, defaultCalories: 18 },
  { names: ['sweet potato', 'sweet potatoes'], per100g: 86, sizes: { small: 77, medium: 103, large: 162 }, defaultCalories: 103 },
  { names: ['potato', 'potatoes'], per100g: 77, sizes: { small: 110, medium: 150, large: 220 }, defaultCalories: 150 },
  { names: ['sweetcorn', 'corn', 'corn on the cob'], per100g: 86, perUnit: 77, defaultCalories: 77 },
  { names: ['peas'], per100g: 81, defaultCalories: 81 },
  { names: ['lettuce', 'romaine lettuce', 'iceberg lettuce'], per100g: 15, defaultCalories: 15 },
  { names: ['celery'], per100g: 16, defaultCalories: 16 },
  { names: ['red pepper', 'green pepper', 'yellow pepper', 'bell pepper', 'capsicum'], per100g: 31, perUnit: 37, defaultCalories: 37 },
  { names: ['courgette', 'zucchini'], per100g: 17, defaultCalories: 17 },
  { names: ['aubergine', 'eggplant'], per100g: 25, defaultCalories: 25 },
  { names: ['mushroom', 'mushrooms'], per100g: 22, perUnit: 5, defaultCalories: 22 },
  { names: ['onion', 'onions'], per100g: 40, sizes: { small: 28, medium: 44, large: 60 }, defaultCalories: 44 },
  { names: ['red onion', 'red onions'], per100g: 40, perUnit: 44, defaultCalories: 44 },
  { names: ['garlic'], per100g: 149, perUnit: 4, defaultCalories: 4 },
  { names: ['ginger'], per100g: 80, perTeaspoon: 2, defaultCalories: 2 },
  { names: ['asparagus'], per100g: 20, defaultCalories: 20 },
  { names: ['green beans', 'french beans'], per100g: 31, defaultCalories: 31 },

  // ── PROTEINS ────────────────────────────────────────────────────────────────
  { names: ['chicken breast', 'chicken breasts'], per100g: 165, defaultCalories: 165 },
  { names: ['chicken thigh', 'chicken thighs'], per100g: 209, defaultCalories: 209 },
  { names: ['chicken'], per100g: 165, defaultCalories: 165 },
  { names: ['salmon', 'salmon fillet'], per100g: 208, defaultCalories: 208 },
  { names: ['tuna', 'tinned tuna', 'canned tuna'], per100g: 132, defaultCalories: 132 },
  { names: ['cod', 'cod fillet'], per100g: 82, defaultCalories: 82 },
  { names: ['beef mince', 'minced beef', 'ground beef'], per100g: 217, defaultCalories: 217 },
  { names: ['steak', 'beef steak'], per100g: 271, defaultCalories: 271 },
  { names: ['pork', 'pork chop'], per100g: 242, defaultCalories: 242 },
  { names: ['turkey'], per100g: 189, defaultCalories: 189 },
  { names: ['tofu', 'firm tofu', 'silken tofu'], per100g: 76, defaultCalories: 76 },
  { names: ['prawns', 'shrimp', 'prawn'], per100g: 99, defaultCalories: 99 },
  { names: ['egg', 'eggs', 'boiled egg', 'fried egg', 'poached egg', 'scrambled egg'], per100g: 155, sizes: { small: 54, medium: 63, large: 78 }, perUnit: 70, defaultCalories: 70 },

  // ── DAIRY ───────────────────────────────────────────────────────────────────
  { names: ['whole milk', 'full fat milk', 'full-fat milk'], per100ml: 61, perCup: 149, defaultCalories: 122 },
  { names: ['semi skimmed milk', 'semi-skimmed milk', 'semi skimmed', '2% milk'], per100ml: 46, perCup: 112, defaultCalories: 92 },
  { names: ['skimmed milk', 'skim milk', 'fat free milk'], per100ml: 34, perCup: 83, defaultCalories: 68 },
  { names: ['oat milk'], per100ml: 45, perCup: 110, defaultCalories: 90 },
  { names: ['almond milk'], per100ml: 13, perCup: 30, defaultCalories: 26 },
  { names: ['soy milk', 'soya milk'], per100ml: 33, perCup: 80, defaultCalories: 66 },
  { names: ['coconut milk'], per100ml: 197, perTablespoon: 30, defaultCalories: 197 },
  { names: ['milk'], per100ml: 46, perCup: 112, defaultCalories: 92 },
  { names: ['greek yogurt', 'greek yoghurt', 'greek style yogurt'], per100g: 97, defaultCalories: 97 },
  { names: ['yogurt', 'yoghurt', 'plain yogurt', 'natural yogurt'], per100g: 61, defaultCalories: 61 },
  { names: ['cheddar', 'cheddar cheese'], per100g: 402, defaultCalories: 402 },
  { names: ['mozzarella'], per100g: 280, defaultCalories: 280 },
  { names: ['parmesan', 'parmesan cheese'], per100g: 431, defaultCalories: 431 },
  { names: ['feta', 'feta cheese'], per100g: 264, defaultCalories: 264 },
  { names: ['butter'], per100g: 717, perTeaspoon: 34, perTablespoon: 102, defaultCalories: 102 },
  { names: ['double cream', 'heavy cream', 'cream'], per100ml: 340, perTablespoon: 51, defaultCalories: 340 },
  { names: ['cream cheese'], per100g: 342, defaultCalories: 342 },
  { names: ['cottage cheese'], per100g: 98, defaultCalories: 98 },

  // ── GRAINS & BREAD ──────────────────────────────────────────────────────────
  { names: ['white rice', 'basmati rice', 'jasmine rice', 'cooked white rice'], per100g: 130, defaultCalories: 130 },
  { names: ['brown rice', 'cooked brown rice'], per100g: 123, defaultCalories: 123 },
  { names: ['rice'], per100g: 130, defaultCalories: 130 },
  { names: ['white bread'], per100g: 265, perSlice: 75, defaultCalories: 75 },
  { names: ['wholemeal bread', 'wholegrain bread', 'brown bread', 'whole wheat bread'], per100g: 247, perSlice: 78, defaultCalories: 78 },
  { names: ['bread', 'toast'], per100g: 265, perSlice: 75, defaultCalories: 75 },
  { names: ['oats', 'porridge oats', 'rolled oats', 'oatmeal'], per100g: 389, defaultCalories: 155 },
  { names: ['porridge'], per100g: 72, defaultCalories: 150 },
  { names: ['pasta', 'spaghetti', 'penne', 'fusilli', 'tagliatelle'], per100g: 131, defaultCalories: 131 },
  { names: ['quinoa'], per100g: 120, defaultCalories: 120 },
  { names: ['granola'], per100g: 380, defaultCalories: 380 },
  { names: ['muesli'], per100g: 363, defaultCalories: 363 },
  { names: ['cornflakes', 'corn flakes'], per100g: 357, defaultCalories: 357 },
  { names: ['weetabix'], per100g: 362, perUnit: 68, defaultCalories: 68 },
  { names: ['bagel'], per100g: 250, perUnit: 245, defaultCalories: 245 },
  { names: ['wrap', 'flour tortilla', 'tortilla'], per100g: 312, perUnit: 146, defaultCalories: 146 },
  { names: ['pitta', 'pitta bread', 'pita', 'pita bread'], per100g: 265, perUnit: 165, defaultCalories: 165 },
  { names: ['crumpet', 'crumpets'], per100g: 198, perUnit: 92, defaultCalories: 92 },
  { names: ['rice cake', 'rice cakes'], per100g: 387, perUnit: 35, defaultCalories: 35 },

  // ── NUTS & SEEDS ────────────────────────────────────────────────────────────
  { names: ['almond', 'almonds'], per100g: 579, perUnit: 7, perTablespoon: 70, defaultCalories: 7 },
  { names: ['walnut', 'walnuts'], per100g: 654, perUnit: 13, perTablespoon: 98, defaultCalories: 13 },
  { names: ['cashew', 'cashews'], per100g: 553, perUnit: 9, perTablespoon: 94, defaultCalories: 9 },
  { names: ['peanut', 'peanuts'], per100g: 567, perUnit: 3, perTablespoon: 94, defaultCalories: 94 },
  { names: ['pecan', 'pecans'], per100g: 691, perUnit: 20, defaultCalories: 20 },
  { names: ['hazelnut', 'hazelnuts'], per100g: 628, perUnit: 9, defaultCalories: 9 },
  { names: ['pistachio', 'pistachios'], per100g: 562, perUnit: 4, defaultCalories: 4 },
  { names: ['chia seeds', 'chia seed', 'chia'], per100g: 486, perTablespoon: 58, perTeaspoon: 19, defaultCalories: 58 },
  { names: ['flaxseed', 'flax seeds', 'linseed', 'linseeds'], per100g: 534, perTablespoon: 55, perTeaspoon: 18, defaultCalories: 55 },
  { names: ['sunflower seeds'], per100g: 584, perTablespoon: 51, defaultCalories: 51 },
  { names: ['pumpkin seeds', 'pepitas'], per100g: 559, perTablespoon: 47, defaultCalories: 47 },
  { names: ['sesame seeds'], per100g: 573, perTablespoon: 52, defaultCalories: 52 },
  { names: ['hemp seeds'], per100g: 553, perTablespoon: 57, defaultCalories: 57 },
  { names: ['peanut butter'], per100g: 588, perTablespoon: 94, perTeaspoon: 31, defaultCalories: 94 },
  { names: ['almond butter'], per100g: 614, perTablespoon: 98, defaultCalories: 98 },

  // ── OILS & CONDIMENTS ───────────────────────────────────────────────────────
  { names: ['olive oil'], per100ml: 884, perTablespoon: 119, perTeaspoon: 40, defaultCalories: 119 },
  { names: ['coconut oil'], per100g: 862, perTablespoon: 117, defaultCalories: 117 },
  { names: ['vegetable oil', 'sunflower oil', 'rapeseed oil'], per100ml: 884, perTablespoon: 119, defaultCalories: 119 },
  { names: ['honey'], per100g: 304, perTablespoon: 64, perTeaspoon: 21, defaultCalories: 21 },
  { names: ['maple syrup'], per100g: 260, perTablespoon: 52, defaultCalories: 52 },
  { names: ['soy sauce', 'tamari'], per100ml: 53, perTablespoon: 8, defaultCalories: 8 },
  { names: ['ketchup', 'tomato ketchup'], per100g: 98, perTablespoon: 19, defaultCalories: 19 },
  { names: ['mayonnaise', 'mayo'], per100g: 680, perTablespoon: 94, defaultCalories: 94 },
  { names: ['hummus'], per100g: 177, perTablespoon: 27, defaultCalories: 177 },
  { names: ['tahini'], per100g: 595, perTablespoon: 89, defaultCalories: 89 },
  { names: ['balsamic vinegar'], per100ml: 88, perTablespoon: 14, defaultCalories: 14 },
  { names: ['sriracha', 'hot sauce'], per100g: 93, perTeaspoon: 5, defaultCalories: 5 },

  // ── LEGUMES ─────────────────────────────────────────────────────────────────
  { names: ['baked beans'], per100g: 94, defaultCalories: 188 },
  { names: ['chickpeas', 'garbanzo beans', 'chickpea'], per100g: 164, defaultCalories: 164 },
  { names: ['red lentils', 'green lentils', 'lentils'], per100g: 116, defaultCalories: 116 },
  { names: ['black beans'], per100g: 132, defaultCalories: 132 },
  { names: ['kidney beans', 'red kidney beans'], per100g: 127, defaultCalories: 127 },
  { names: ['edamame'], per100g: 122, defaultCalories: 122 },

  // ── DRINKS ──────────────────────────────────────────────────────────────────
  { names: ['orange juice', 'fresh orange juice'], per100ml: 45, perCup: 110, defaultCalories: 110 },
  { names: ['apple juice'], per100ml: 46, perCup: 112, defaultCalories: 112 },
  { names: ['coffee', 'black coffee', 'americano'], perCup: 2, defaultCalories: 2 },
  { names: ['espresso'], perUnit: 5, defaultCalories: 5 },
  { names: ['tea', 'black tea', 'green tea', 'herbal tea'], perCup: 2, defaultCalories: 2 },
  { names: ['latte', 'cafe latte'], perCup: 120, defaultCalories: 120 },
  { names: ['cappuccino'], perCup: 80, defaultCalories: 80 },
  { names: ['flat white'], perCup: 100, defaultCalories: 100 },
  { names: ['protein shake', 'protein smoothie'], perUnit: 150, defaultCalories: 150 },
  { names: ['smoothie', 'fruit smoothie'], per100ml: 65, defaultCalories: 195 },

  // ── SNACKS & TREATS ─────────────────────────────────────────────────────────
  { names: ['dark chocolate'], per100g: 546, perSquare: 50, defaultCalories: 50 },
  { names: ['milk chocolate', 'chocolate'], per100g: 535, perSquare: 48, defaultCalories: 48 },
  { names: ['crisps', 'potato chips'], per100g: 536, defaultCalories: 536 },
  { names: ['granola bar', 'cereal bar', 'oat bar'], perUnit: 120, defaultCalories: 120 },
  { names: ['protein bar'], perUnit: 200, defaultCalories: 200 },
  { names: ['popcorn'], per100g: 387, defaultCalories: 387 },

  // ── COMMON MEALS / DISHES ───────────────────────────────────────────────────
  { names: ['chia seed pudding', 'chia pudding'], per100g: 130, defaultCalories: 200 },
  { names: ['overnight oats'], per100g: 90, defaultCalories: 350 },
];

// ── PARSER ───────────────────────────────────────────────────────────────────

const FRACTION_WORDS = {
  'half': 0.5, 'a half': 0.5,
  'quarter': 0.25, 'a quarter': 0.25,
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
};

const UNIT_MAP = {
  'g': 'g', 'gram': 'g', 'grams': 'g',
  'kg': 'kg', 'kilogram': 'kg', 'kilograms': 'kg',
  'ml': 'ml', 'milliliter': 'ml', 'milliliters': 'ml', 'millilitre': 'ml', 'millilitres': 'ml',
  'l': 'l', 'litre': 'l', 'litres': 'l', 'liter': 'l', 'liters': 'l',
  'tbsp': 'tbsp', 'tablespoon': 'tbsp', 'tablespoons': 'tbsp',
  'tsp': 'tsp', 'teaspoon': 'tsp', 'teaspoons': 'tsp',
  'cup': 'cup', 'cups': 'cup',
  'slice': 'slice', 'slices': 'slice',
  'can': 'can', 'tin': 'can', 'cans': 'can', 'tins': 'can',
  'piece': 'piece', 'pieces': 'piece',
  'scoop': 'scoop', 'scoops': 'scoop',
  'square': 'square', 'squares': 'square',
};

const SIZE_WORDS = ['small', 'medium', 'large', 'xl', 'x-large', 'big', 'tiny', 'mini'];

// Words to strip from food names after matching quantity/unit/size
const STRIP_WORDS = [
  'sliced', 'diced', 'chopped', 'fresh', 'raw', 'cooked', 'grilled', 'boiled',
  'baked', 'fried', 'steamed', 'roasted', 'mashed', 'grated', 'shredded',
  'ripe', 'frozen', 'canned', 'tinned', 'plain', 'unsweetened', 'of', 'the',
  'some', 'with', 'without', 'no', 'low', 'fat',
];

function parseIngredientList(text) {
  const parts = text.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
  return parts.map(parseIngredient);
}

function parseIngredient(raw) {
  let s = raw.toLowerCase().trim();
  let qty = null;
  let unit = null;
  let size = null;

  // 1. Extract fraction/word quantity (longest match first)
  const fracKeys = Object.keys(FRACTION_WORDS).sort((a, b) => b.length - a.length);
  for (const phrase of fracKeys) {
    const re = new RegExp('^' + phrase + '(?:\\s+(?:of\\s+)?(?:a\\s+|an\\s+)?|$)', 'i');
    const m = s.match(re);
    if (m) {
      qty = FRACTION_WORDS[phrase];
      s = s.slice(m[0].length).trim();
      break;
    }
  }

  // 2. Extract numeric quantity (e.g. "6", "1.5", "2")
  if (qty === null) {
    const m = s.match(/^(\d+(?:[.,]\d+)?)\s*/);
    if (m) {
      qty = parseFloat(m[1].replace(',', '.'));
      s = s.slice(m[0].length).trim();
    }
  }

  // 3. Consume "a" / "an" leading article
  if (qty === null) {
    const m = s.match(/^(?:a|an)\s+/i);
    if (m) {
      qty = 1;
      s = s.slice(m[0].length).trim();
    }
  }

  if (qty === null) qty = 1;

  // 4. Extract unit (longest token match)
  const unitKeys = Object.keys(UNIT_MAP).sort((a, b) => b.length - a.length);
  for (const u of unitKeys) {
    const re = new RegExp('^' + u + '(?:\\s+|$)', 'i');
    if (re.test(s)) {
      unit = UNIT_MAP[u];
      s = s.replace(re, '').trim();
      break;
    }
  }

  // 5. Extract size modifier
  for (const sz of SIZE_WORDS) {
    const re = new RegExp('(?:^|\\s)' + sz + '(?:\\s|$)', 'i');
    if (re.test(s)) {
      size = sz === 'big' ? 'large' : sz === 'tiny' || sz === 'mini' ? 'small' : sz;
      s = s.replace(re, ' ').trim();
      break;
    }
  }

  // 6. Strip trailing noise words
  const stripRe = new RegExp('\\b(' + STRIP_WORDS.join('|') + ')\\b', 'gi');
  s = s.replace(stripRe, ' ').replace(/\s{2,}/g, ' ').trim();

  // 7. Find best matching food
  const food = findFood(s);

  return {
    raw,
    displayName: food ? food.names[0] : s,
    qty,
    unit,
    size,
    calories: food ? calcCalories(food, qty, unit, size) : null,
    matched: !!food,
  };
}

function findFood(query) {
  if (!query) return null;
  const q = query.toLowerCase().trim();

  let best = null;
  let bestScore = -1;

  for (const food of FOOD_DB) {
    for (const name of food.names) {
      let score = -1;
      if (q === name) {
        score = 1000 + name.length;     // exact match wins
      } else if (q.includes(name)) {
        score = 500 + name.length;       // query contains the food name
      } else if (name.includes(q)) {
        score = 200 + name.length;       // food name contains the query
      } else {
        // word-overlap fallback
        const qWords = q.split(/\s+/);
        const nWords = name.split(/\s+/);
        const overlap = qWords.filter(w => nWords.includes(w)).length;
        if (overlap > 0) score = overlap * 10;
      }
      if (score > bestScore) {
        bestScore = score;
        best = food;
      }
    }
  }

  return bestScore >= 0 ? best : null;
}

function calcCalories(food, qty, unit, size) {
  const base100g = food.per100g || food.per100ml || 0;

  if (unit === 'g')     return Math.round(base100g * qty / 100);
  if (unit === 'kg')    return Math.round(base100g * qty * 10);
  if (unit === 'ml')    return Math.round((food.per100ml || base100g) * qty / 100);
  if (unit === 'l')     return Math.round((food.per100ml || base100g) * qty * 10);
  if (unit === 'tbsp')  return food.perTablespoon
    ? Math.round(food.perTablespoon * qty)
    : Math.round(base100g * qty * 15 / 100);
  if (unit === 'tsp')   return food.perTeaspoon
    ? Math.round(food.perTeaspoon * qty)
    : Math.round(base100g * qty * 5 / 100);
  if (unit === 'cup')   return food.perCup
    ? Math.round(food.perCup * qty)
    : Math.round((food.per100ml || base100g) * qty * 240 / 100);
  if (unit === 'slice') return food.perSlice
    ? Math.round(food.perSlice * qty)
    : Math.round(base100g * qty * 30 / 100);
  if (unit === 'can' || unit === 'tin') return Math.round(base100g * qty * 400 / 100);
  if (unit === 'square') return food.perSquare
    ? Math.round(food.perSquare * qty)
    : Math.round(base100g * qty * 10 / 100);

  // No unit — use size variants or per-unit
  if (size && food.sizes && food.sizes[size]) return Math.round(food.sizes[size] * qty);
  if (food.sizes && food.sizes.medium)         return Math.round(food.sizes.medium * qty);
  if (food.perUnit)                            return Math.round(food.perUnit * qty);
  return Math.round((food.defaultCalories || base100g) * qty);
}

// Quick single-food lookup (used for live hint on the food name input)
function quickLookup(query) {
  if (!query || query.length < 2) return null;
  const q = query.toLowerCase().trim();

  // Check for size prefix
  let size = null;
  let stripped = q;
  for (const sz of SIZE_WORDS) {
    if (q.startsWith(sz + ' ')) {
      size = sz === 'big' ? 'large' : sz === 'tiny' || sz === 'mini' ? 'small' : sz;
      stripped = q.slice(sz.length + 1).trim();
      break;
    }
  }

  const food = findFood(stripped) || findFood(q);
  if (!food) return null;

  const cals = calcCalories(food, 1, null, size);
  return { food: food.names[0], calories: cals, size };
}
