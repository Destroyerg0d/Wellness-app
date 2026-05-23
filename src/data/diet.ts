import type { MealSlot, NutrientTarget, Season, SeasonalDiet } from '../types'

export const mealSlots: { slot: MealSlot; label: string; time: string }[] = [
  { slot: 'breakfast', label: 'Breakfast', time: '' },
  { slot: 'midMorning', label: 'Mid-Morning', time: '~11 am · about 150 kcal' },
  { slot: 'lunch', label: 'Lunch', time: '' },
  { slot: 'eveningSnack', label: 'Evening Snack', time: '4–5 pm · about 200 kcal' },
  { slot: 'dinner', label: 'Dinner', time: 'finish by about 8 pm' },
]

// ---------- SUMMER (default — current season, full fidelity from 11.10) ----------
const summer: SeasonalDiet = {
  season: 'summer',
  intro:
    "It's summer in Dhampur — hot and dry. The goal is cooling, hydrating, light but protein-rich food. Pick any one option per meal based on your mood and what's at home.",
  hydrationNote:
    'Aim for 3–3.5 L of fluid. Rotate: plain water, nimbu pani (a pinch of salt + black salt), chaas/matha, sattu sharbat, bel sharbat, aam panna, coconut water, watermelon/muskmelon. Avoid sugary packed drinks and more than 2 cups of chai a day.',
  bedtimeNote: "Only if you're genuinely hungry: 1 cup warm milk with a quarter-teaspoon of haldi.",
  meals: {
    breakfast: [
      {
        id: 'su-bf-poha',
        title: 'Curd + poha bowl',
        description: 'Light, cooling flattened rice with a bowl of fresh curd.',
        prepMinutes: 5,
        approxCalories: 380,
        approxProtein: 12,
        nutrients: 'Probiotics, B-complex',
        hasEggOption: false,
      },
      {
        id: 'su-bf-chilla',
        title: 'Besan chilla + chutney',
        description: 'Savoury gram-flour pancake with green chutney — quick and protein-rich.',
        prepMinutes: 10,
        approxCalories: 400,
        approxProtein: 18,
        nutrients: 'Folate, iron',
        hasEggOption: true,
        eggNote: 'Mix 1 egg into the batter (about 22 g protein).',
        vegSwaps: ['2 tbsp curd in the batter', '30 g grated paneer in the batter', '2 tbsp sprouted moong in the batter'],
      },
      {
        id: 'su-bf-paratha',
        title: 'Stuffed paratha + dahi',
        description: 'A stuffed paratha with dahi. Tip: paneer-pyaaz or sattu-pyaaz stuffing adds 8–10 g protein.',
        prepMinutes: 12,
        approxCalories: 450,
        approxProtein: 12,
        nutrients: 'Calcium, carbs',
        hasEggOption: false,
      },
      {
        id: 'su-bf-sattu',
        title: 'Sattu paratha + chaas + fruit',
        description: 'Roasted-gram-flour paratha with chaas and a fruit — iron and fibre packed.',
        prepMinutes: 12,
        approxCalories: 450,
        approxProtein: 18,
        nutrients: 'Iron, fibre',
        hasEggOption: false,
      },
      {
        id: 'su-bf-oats',
        title: 'Overnight oats, Indian-style',
        description: 'Mix oats with milk or curd, nuts and fruit the night before. Wake up and eat.',
        prepMinutes: 2,
        approxCalories: 400,
        approxProtein: 15,
        nutrients: '300 mg calcium, omega-3',
        hasEggOption: false,
        isLazyPick: true,
      },
      {
        id: 'su-bf-eggbhurji',
        title: 'Egg bhurji + roti',
        description: 'Spiced scrambled eggs with roti — high in B12 and iron.',
        prepMinutes: 10,
        approxCalories: 420,
        approxProtein: 20,
        nutrients: 'B12, iron',
        hasEggOption: true,
        eggNote: 'This is the egg dish itself.',
        vegSwaps: ['Paneer bhurji (80 g)', 'Moong dal cheela x2', 'Sprouts bhurji (1 cup)'],
      },
    ],
    midMorning: [
      {
        id: 'su-mm-chaas',
        title: 'Chaas + 5 soaked almonds',
        description: 'A glass of spiced buttermilk with a few soaked almonds.',
        prepMinutes: 2,
        approxCalories: 150,
        approxProtein: 5,
        nutrients: 'Probiotics, healthy fats',
        hasEggOption: false,
        isLazyPick: true,
      },
      {
        id: 'su-mm-sattu',
        title: 'Sattu sharbat (nimbu-namak)',
        description: 'Roasted gram flour whisked into water with lemon and salt — cooling and filling.',
        prepMinutes: 4,
        approxCalories: 150,
        approxProtein: 7,
        nutrients: 'Iron, plant protein',
        hasEggOption: false,
      },
      {
        id: 'su-mm-fruit',
        title: 'Seasonal fruit + 5 almonds',
        description: 'Any one seasonal fruit (½ mango, or a cup of watermelon / muskmelon / litchi) with 5 almonds.',
        prepMinutes: 3,
        approxCalories: 160,
        approxProtein: 3,
        nutrients: 'Vitamin C, hydration',
        hasEggOption: false,
      },
      {
        id: 'su-mm-coconut',
        title: 'Coconut water + roasted chana',
        description: 'Fresh coconut water with a fistful of roasted chana.',
        prepMinutes: 2,
        approxCalories: 160,
        approxProtein: 6,
        nutrients: 'Electrolytes, protein',
        hasEggOption: false,
      },
    ],
    lunch: [
      {
        id: 'su-ln-thali',
        title: 'Classic UP thali',
        description: 'Roti, dal, sabzi, dahi and salad — the everyday balanced plate.',
        prepMinutes: 25,
        approxCalories: 550,
        approxProtein: 22,
        nutrients: '350 mg calcium, 5 mg iron',
        hasEggOption: false,
      },
      {
        id: 'su-ln-rajma',
        title: 'Rajma/chana-chawal + kachumber + dahi',
        description: 'Rajma or chana with rice, fresh kachumber salad and dahi.',
        prepMinutes: 25,
        approxCalories: 600,
        approxProtein: 24,
        nutrients: '8 mg iron, folate',
        hasEggOption: false,
      },
      {
        id: 'su-ln-curdrice',
        title: 'Curd-rice + sabzi',
        description: 'Cooling curd-rice with a simple sabzi. Top with roasted peanuts or boiled chana for extra protein.',
        prepMinutes: 10,
        approxCalories: 500,
        approxProtein: 15,
        nutrients: 'Cooling, probiotics',
        hasEggOption: false,
        isLazyPick: true,
      },
      {
        id: 'su-ln-khichdi',
        title: 'Moong dal khichdi + raita + ghee',
        description: 'Soft moong dal khichdi with raita and a little ghee — gentle and complete.',
        prepMinutes: 20,
        approxCalories: 550,
        approxProtein: 20,
        nutrients: 'Complete amino acids',
        hasEggOption: false,
      },
      {
        id: 'su-ln-wrap',
        title: 'Paneer/egg wrap',
        description: 'A soft roti wrap with paneer or egg and crunchy veg.',
        prepMinutes: 12,
        approxCalories: 500,
        approxProtein: 20,
        nutrients: 'Protein, calcium',
        hasEggOption: true,
        eggNote: '1 boiled egg in the wrap.',
        vegSwaps: ['60 g paneer', 'Half cup tofu', 'Half cup chana chaat'],
      },
    ],
    eveningSnack: [
      {
        id: 'su-es-banana',
        title: 'Banana + 5 almonds',
        description: 'A banana with 5 almonds — an ideal little pre-workout snack.',
        prepMinutes: 1,
        approxCalories: 200,
        approxProtein: 5,
        nutrients: 'Potassium, energy',
        hasEggOption: false,
        isLazyPick: true,
      },
      {
        id: 'su-es-sproutchaat',
        title: 'Sprouted moong chaat',
        description: 'A cup of sprouted moong with onion, tomato and lemon.',
        prepMinutes: 8,
        approxCalories: 200,
        approxProtein: 14,
        nutrients: 'Plant protein, fibre',
        hasEggOption: false,
      },
      {
        id: 'su-es-dahichana',
        title: 'Dahi + roasted chana + cucumber',
        description: 'Dahi with a spoon of roasted chana and chopped cucumber.',
        prepMinutes: 3,
        approxCalories: 190,
        approxProtein: 10,
        nutrients: 'Probiotics, protein',
        hasEggOption: false,
      },
      {
        id: 'su-es-thandai',
        title: 'Thandai-style milk + almonds',
        description: 'Cold milk blended with soaked almonds and a little elaichi.',
        prepMinutes: 5,
        approxCalories: 210,
        approxProtein: 9,
        nutrients: 'Calcium, B12',
        hasEggOption: false,
      },
      {
        id: 'su-es-muskmelon',
        title: 'Muskmelon bowl + peanuts',
        description: 'A bowl of muskmelon with a handful of peanuts.',
        prepMinutes: 3,
        approxCalories: 200,
        approxProtein: 7,
        nutrients: 'Hydration, healthy fats',
        hasEggOption: false,
      },
      {
        id: 'su-es-makhana',
        title: 'Roasted makhana',
        description: 'A small bowl of lightly roasted makhana (fox nuts).',
        prepMinutes: 5,
        approxCalories: 180,
        approxProtein: 5,
        nutrients: 'Light, low-GI',
        hasEggOption: false,
      },
    ],
    dinner: [
      {
        id: 'su-dn-rotidal',
        title: 'Roti + light dal + summer sabzi',
        description: 'Roti with a light dal and a seasonal summer sabzi.',
        prepMinutes: 25,
        approxCalories: 450,
        approxProtein: 20,
        nutrients: 'Balanced, light',
        hasEggOption: false,
      },
      {
        id: 'su-dn-daliya',
        title: 'Vegetable daliya + chaas',
        description: 'Savoury vegetable daliya with a glass of chaas — high fibre and easy.',
        prepMinutes: 15,
        approxCalories: 400,
        approxProtein: 15,
        nutrients: 'High fibre',
        hasEggOption: false,
        isLazyPick: true,
      },
      {
        id: 'su-dn-paneerbhurji',
        title: 'Paneer bhurji + 1 roti + salad',
        description: 'Scrambled paneer with a roti and salad — calcium-rich.',
        prepMinutes: 12,
        approxCalories: 450,
        approxProtein: 22,
        nutrients: 'About 400 mg calcium',
        hasEggOption: true,
        eggNote: '2-egg bhurji instead (more B12).',
        vegSwaps: ['Tofu bhurji', 'Sprouts curry', 'Chana sabzi'],
      },
      {
        id: 'su-dn-curdbowl',
        title: 'Curd-veggie bowl (no-cook)',
        description: 'No cooking: curd with chopped veg, roasted seeds and a little salt.',
        prepMinutes: 5,
        approxCalories: 400,
        approxProtein: 18,
        nutrients: 'Probiotics, fibre',
        hasEggOption: false,
        isLazyPick: true,
      },
      {
        id: 'su-dn-soya',
        title: 'Soya chunks curry + 1 roti',
        description: 'Soya chunk curry with a roti — the densest vegetarian protein.',
        prepMinutes: 20,
        approxCalories: 450,
        approxProtein: 25,
        nutrients: 'Densest veg protein',
        hasEggOption: false,
      },
    ],
  },
}

// ---------- MONSOON (11.11 — cooked, well-spiced, infection-safe) ----------
const monsoon: SeasonalDiet = {
  season: 'monsoon',
  intro:
    'Monsoon in Dhampur — digestion turns sluggish and infection risk is high. Eat cooked, well-washed food; avoid raw salads and street food. Lean on ginger, garlic, hing, haldi and ajwain.',
  hydrationNote:
    'Favour warm fluids: vegetable shorba, ginger-tulsi tea, and well-spiced mattha instead of cold curd. Keep sipping warm water through the day.',
  bedtimeNote: 'A small cup of warm haldi-doodh helps on damp nights.',
  meals: {
    breakfast: [
      { id: 'mo-bf-chilla', title: 'Besan chilla + ginger-tulsi tea', description: 'Warm gram-flour pancake with a soothing ginger-tulsi tea.', prepMinutes: 10, approxCalories: 400, approxProtein: 18, nutrients: 'Folate, iron, immunity', hasEggOption: true, eggNote: 'Mix 1 egg into the batter.', vegSwaps: ['2 tbsp curd in the batter', '30 g grated paneer'] },
      { id: 'mo-bf-poha', title: 'Warm vegetable poha', description: 'Freshly cooked poha with veg — light and easy to digest.', prepMinutes: 10, approxCalories: 370, approxProtein: 11, nutrients: 'Light, easy to digest', hasEggOption: false },
      { id: 'mo-bf-cheela', title: 'Moong dal cheela x2', description: 'Two savoury moong-dal pancakes — plant protein and iron.', prepMinutes: 12, approxCalories: 400, approxProtein: 18, nutrients: 'Plant protein, iron', hasEggOption: false },
    ],
    midMorning: [
      { id: 'mo-mm-jamun', title: 'Jamun + almonds', description: 'Seasonal jamun with a few almonds — very PCOS-friendly and low-GI.', prepMinutes: 2, approxCalories: 150, approxProtein: 4, nutrients: 'Low-GI, PCOS-friendly', hasEggOption: false, isLazyPick: true },
      { id: 'mo-mm-tea', title: 'Ginger-tulsi tea + roasted chana', description: 'A warming herbal tea with a fistful of roasted chana.', prepMinutes: 5, approxCalories: 150, approxProtein: 6, nutrients: 'Immunity, protein', hasEggOption: false },
      { id: 'mo-mm-mattha', title: 'Warm spiced mattha', description: 'Lightly warmed, well-spiced buttermilk — gentle on the gut.', prepMinutes: 3, approxCalories: 140, approxProtein: 6, nutrients: 'Probiotics, soothing', hasEggOption: false },
    ],
    lunch: [
      { id: 'mo-ln-karela', title: 'Roti + arhar dal + karela sabzi + mattha', description: 'A warming plate with karela — gentle on blood sugar (great for PCOS).', prepMinutes: 25, approxCalories: 520, approxProtein: 20, nutrients: 'Blood-sugar friendly', hasEggOption: false },
      { id: 'mo-ln-khichdi', title: 'Moong dal khichdi + steamed veg', description: 'Soft khichdi with steamed vegetables — complete and easy.', prepMinutes: 20, approxCalories: 520, approxProtein: 19, nutrients: 'Gentle, complete', hasEggOption: false },
      { id: 'mo-ln-rajma', title: 'Rajma-chawal (well-cooked) + dahi', description: 'Thoroughly cooked rajma with rice and dahi.', prepMinutes: 25, approxCalories: 580, approxProtein: 23, nutrients: 'Iron, folate', hasEggOption: false },
    ],
    eveningSnack: [
      { id: 'mo-es-bhutta', title: 'Roasted bhutta (corn)', description: 'A roasted cob of corn with lemon and salt — warming and high in fibre.', prepMinutes: 10, approxCalories: 180, approxProtein: 6, nutrients: 'Fibre, warming', hasEggOption: false, isLazyPick: true },
      { id: 'mo-es-makhana', title: 'Roasted makhana', description: 'A small bowl of roasted fox nuts.', prepMinutes: 5, approxCalories: 180, approxProtein: 5, nutrients: 'Light, low-GI', hasEggOption: false },
      { id: 'mo-es-sprouts', title: 'Steamed sprouted moong chaat', description: 'Lightly steamed (not raw) sprout chaat for the season.', prepMinutes: 10, approxCalories: 200, approxProtein: 14, nutrients: 'Plant protein', hasEggOption: false },
    ],
    dinner: [
      { id: 'mo-dn-khichdi', title: 'Moong dal khichdi + steamed lauki', description: 'Comforting khichdi with steamed lauki — easy to digest at night.', prepMinutes: 20, approxCalories: 430, approxProtein: 18, nutrients: 'Easy to digest', hasEggOption: false, isLazyPick: true },
      { id: 'mo-dn-rotidal', title: 'Roti + light dal + sauteed sabzi', description: 'A simple cooked plate — no raw veg this season.', prepMinutes: 25, approxCalories: 450, approxProtein: 20, nutrients: 'Balanced, cooked', hasEggOption: false },
      { id: 'mo-dn-daliya', title: 'Vegetable daliya', description: 'Warm savoury daliya with vegetables.', prepMinutes: 15, approxCalories: 400, approxProtein: 14, nutrients: 'High fibre', hasEggOption: false },
    ],
  },
}

// ---------- AUTUMN (11.11 — strengthening digestion, festival season) ----------
const autumn: SeasonalDiet = {
  season: 'autumn',
  intro:
    'Moderate weather and festival season — digestion strengthens. The main risk is mithai overload. Add amla daily for vitamin C, reintroduce cooked palak, and enjoy pomegranate as a snack.',
  hydrationNote:
    'Comfortable temperatures — aim for about 2.5–3 L. Warm or room-temperature water, chaas, and amla juice all work well.',
  bedtimeNote: 'Festival tip: enjoy 1 small piece of mithai a day, paired with a protein item like a few nuts or a glass of milk.',
  meals: {
    breakfast: [
      { id: 'au-bf-paratha', title: 'Stuffed paratha + dahi', description: 'A stuffed paratha with dahi as the weather cools.', prepMinutes: 12, approxCalories: 450, approxProtein: 12, nutrients: 'Calcium, carbs', hasEggOption: false },
      { id: 'au-bf-chilla', title: 'Besan chilla + chutney', description: 'Gram-flour pancake with green chutney.', prepMinutes: 10, approxCalories: 400, approxProtein: 18, nutrients: 'Folate, iron', hasEggOption: true, eggNote: 'Mix 1 egg into the batter.', vegSwaps: ['2 tbsp curd in the batter', '30 g grated paneer'] },
      { id: 'au-bf-poha', title: 'Poha + curd', description: 'Light poha with a side of curd.', prepMinutes: 5, approxCalories: 380, approxProtein: 12, nutrients: 'Light, probiotics', hasEggOption: false },
    ],
    midMorning: [
      { id: 'au-mm-pomegranate', title: 'Pomegranate + almonds', description: 'A bowl of pomegranate with a few almonds.', prepMinutes: 3, approxCalories: 160, approxProtein: 4, nutrients: 'Antioxidants, iron', hasEggOption: false, isLazyPick: true },
      { id: 'au-mm-amla', title: 'Amla juice + roasted chana', description: 'A small glass of amla juice with roasted chana — a big vitamin-C hit.', prepMinutes: 5, approxCalories: 150, approxProtein: 6, nutrients: 'Vitamin C, protein', hasEggOption: false },
      { id: 'au-mm-fruit', title: 'Seasonal fruit + nuts', description: 'Any seasonal fruit with a handful of mixed nuts.', prepMinutes: 2, approxCalories: 160, approxProtein: 4, nutrients: 'Vitamins, healthy fats', hasEggOption: false },
    ],
    lunch: [
      { id: 'au-ln-thali', title: 'UP thali + cooked palak', description: 'The everyday thali with reintroduced cooked palak for iron.', prepMinutes: 25, approxCalories: 560, approxProtein: 23, nutrients: 'Iron, calcium', hasEggOption: false },
      { id: 'au-ln-rajma', title: 'Rajma/chana-chawal + dahi', description: 'Rajma or chana with rice and dahi.', prepMinutes: 25, approxCalories: 600, approxProtein: 24, nutrients: 'Iron, folate', hasEggOption: false },
      { id: 'au-ln-khichdi', title: 'Moong dal khichdi + raita', description: 'Soft khichdi with raita.', prepMinutes: 20, approxCalories: 540, approxProtein: 20, nutrients: 'Complete amino acids', hasEggOption: false },
    ],
    eveningSnack: [
      { id: 'au-es-pomegranate', title: 'Pomegranate bowl + peanuts', description: 'Pomegranate with a handful of peanuts.', prepMinutes: 5, approxCalories: 200, approxProtein: 7, nutrients: 'Antioxidants, protein', hasEggOption: false, isLazyPick: true },
      { id: 'au-es-sprouts', title: 'Sprouted moong chaat', description: 'A cup of sprouted moong with onion, tomato and lemon.', prepMinutes: 8, approxCalories: 200, approxProtein: 14, nutrients: 'Plant protein', hasEggOption: false },
      { id: 'au-es-dahichana', title: 'Dahi + roasted chana', description: 'Dahi with a spoon of roasted chana.', prepMinutes: 3, approxCalories: 190, approxProtein: 10, nutrients: 'Probiotics, protein', hasEggOption: false },
    ],
    dinner: [
      { id: 'au-dn-palak', title: 'Roti + dal + cooked palak sabzi', description: 'A balanced plate featuring iron-rich cooked palak.', prepMinutes: 25, approxCalories: 460, approxProtein: 20, nutrients: 'Iron, balanced', hasEggOption: false },
      { id: 'au-dn-paneer', title: 'Paneer bhurji + 1 roti', description: 'Scrambled paneer with a roti.', prepMinutes: 12, approxCalories: 450, approxProtein: 22, nutrients: 'About 400 mg calcium', hasEggOption: true, eggNote: '2-egg bhurji instead (more B12).', vegSwaps: ['Tofu bhurji', 'Sprouts curry', 'Chana sabzi'] },
      { id: 'au-dn-soya', title: 'Soya chunks curry + 1 roti', description: 'Soya chunk curry with a roti.', prepMinutes: 20, approxCalories: 450, approxProtein: 25, nutrients: 'Densest veg protein', hasEggOption: false },
    ],
  },
}

// ---------- WINTER (11.11 — warming, calorie-dense, Dhampur cold) ----------
const winter: SeasonalDiet = {
  season: 'winter',
  intro:
    'Real cold in Dhampur — appetite rises and the body wants warming, calorie-dense food. Bring in bajra/makki rotis, seasonal greens, and a little more ghee.',
  hydrationNote:
    'Sip warm water and kadha through the day; about 2.5 L total. A warm haldi-doodh at night is comforting.',
  bedtimeNote: 'A warm cup of haldi-doodh before bed is perfect on cold nights.',
  meals: {
    breakfast: [
      { id: 'wi-bf-methialoo', title: 'Methi-aloo paratha + dahi + til-gur laddoo', description: 'A warming paratha with dahi and a small til-gur laddoo.', prepMinutes: 15, approxCalories: 520, approxProtein: 14, nutrients: 'Warming, iron, calcium', hasEggOption: false },
      { id: 'wi-bf-palakparatha', title: 'Methi / palak paratha + curd', description: 'A greens-stuffed paratha with curd.', prepMinutes: 12, approxCalories: 460, approxProtein: 13, nutrients: 'Iron, calcium', hasEggOption: false },
      { id: 'wi-bf-dalia', title: 'Hot vegetable dalia', description: 'A warm bowl of savoury vegetable dalia.', prepMinutes: 12, approxCalories: 400, approxProtein: 14, nutrients: 'Warming, high fibre', hasEggOption: false },
      { id: 'wi-bf-chilla', title: 'Besan chilla', description: 'Warm gram-flour pancake.', prepMinutes: 10, approxCalories: 400, approxProtein: 18, nutrients: 'Folate, iron', hasEggOption: true, eggNote: 'Mix 1 egg into the batter.', vegSwaps: ['2 tbsp curd in the batter', '30 g grated paneer'] },
    ],
    midMorning: [
      { id: 'wi-mm-santra', title: 'Santra + almonds + walnuts', description: 'A seasonal orange with almonds and walnuts.', prepMinutes: 3, approxCalories: 180, approxProtein: 5, nutrients: 'Vitamin C, omega-3', hasEggOption: false, isLazyPick: true },
      { id: 'wi-mm-laddoo', title: 'Til-gur laddoo + warm milk', description: 'A small sesame-jaggery laddoo with warm milk.', prepMinutes: 3, approxCalories: 200, approxProtein: 7, nutrients: 'Warming, calcium, iron', hasEggOption: false },
      { id: 'wi-mm-moongphali', title: 'Roasted moongphali (peanuts)', description: 'A fistful of warm roasted peanuts.', prepMinutes: 2, approxCalories: 180, approxProtein: 8, nutrients: 'Protein, warming', hasEggOption: false },
    ],
    lunch: [
      { id: 'wi-ln-saag', title: 'Sarson ka saag + makki ki roti + chaas', description: 'The classic winter plate — mustard greens with makki roti.', prepMinutes: 30, approxCalories: 580, approxProtein: 20, nutrients: 'Iron, calcium, warming', hasEggOption: false },
      { id: 'wi-ln-thali', title: 'UP thali + ghee', description: 'The everyday thali with a little extra ghee for the cold.', prepMinutes: 25, approxCalories: 580, approxProtein: 22, nutrients: 'Balanced, warming', hasEggOption: false },
      { id: 'wi-ln-rajma', title: 'Rajma-chawal + dahi', description: 'Rajma with rice and dahi.', prepMinutes: 25, approxCalories: 600, approxProtein: 24, nutrients: 'Iron, folate', hasEggOption: false },
    ],
    eveningSnack: [
      { id: 'wi-es-moongphali', title: 'Roasted moongphali + chai', description: 'Warm roasted peanuts with a cup of chai.', prepMinutes: 5, approxCalories: 200, approxProtein: 8, nutrients: 'Protein, warming', hasEggOption: false, isLazyPick: true },
      { id: 'wi-es-makhana', title: 'Roasted makhana', description: 'A small bowl of roasted fox nuts.', prepMinutes: 5, approxCalories: 180, approxProtein: 5, nutrients: 'Light, low-GI', hasEggOption: false },
      { id: 'wi-es-gajak', title: 'Small til-gur gajak', description: 'A small piece of sesame-jaggery gajak — warming and sweet.', prepMinutes: 2, approxCalories: 190, approxProtein: 4, nutrients: 'Warming, calcium', hasEggOption: false },
    ],
    dinner: [
      { id: 'wi-dn-gajarmatar', title: 'Gajar-matar sabzi + 2 phulka + arhar dal', description: 'A warming seasonal sabzi with phulka and dal.', prepMinutes: 25, approxCalories: 500, approxProtein: 20, nutrients: 'Warming, balanced', hasEggOption: false },
      { id: 'wi-dn-khichdi', title: 'Hot khichdi + ghee', description: 'Comforting khichdi with a little ghee.', prepMinutes: 20, approxCalories: 470, approxProtein: 18, nutrients: 'Comforting, complete', hasEggOption: false },
      { id: 'wi-dn-soup', title: 'Vegetable soup + roti', description: 'A warm vegetable soup with a roti.', prepMinutes: 20, approxCalories: 420, approxProtein: 16, nutrients: 'Warming, light', hasEggOption: false },
    ],
  },
}

export const seasonalDiets: Record<Season, SeasonalDiet> = {
  summer,
  monsoon,
  autumn,
  winter,
}

// ---------- Daily nutrient targets (11.9) ----------
export const nutrientTargets: NutrientTarget[] = [
  { nutrient: 'Energy', target: '1,800–2,000 kcal' },
  { nutrient: 'Protein', target: '75–85 g' },
  { nutrient: 'Carbohydrates', target: '220–250 g' },
  { nutrient: 'Fibre', target: '25–30 g' },
  { nutrient: 'Visible fat', target: '20–25 g' },
  { nutrient: 'Calcium', target: '1,000 mg' },
  { nutrient: 'Iron', target: '29 mg' },
  { nutrient: 'Zinc', target: '13 mg' },
  { nutrient: 'Magnesium', target: '370 mg' },
  { nutrient: 'Vitamin B12', target: '2.2 µg' },
  { nutrient: 'Folate', target: '220 µg' },
  { nutrient: 'Vitamin C', target: '65 mg' },
  { nutrient: 'Vitamin D', target: '600 IU (15 µg)' },
  { nutrient: 'Water / fluids', target: '2.5–3 L' },
]

// Plate rule (11.9)
export const plateRule: string[] = [
  'Half plate — sabzi + salad',
  'Quarter plate — protein (dal / paneer / sprouts / curd / egg / soya)',
  'Quarter plate — whole grain',
  'Plus 1 katori dahi or chaas',
  'Plus 1 fruit and a handful of nuts',
]

// Nutrient coverage notes (11.12)
export const nutrientCoverageNotes: string[] = [
  'Protein, carbs, fibre, calcium, vitamin C, folate, magnesium and zinc are comfortably covered if there is a protein item in every meal and at least 2 dairy servings a day.',
  'Iron is borderline for Indian women — pair iron foods with a vitamin C source (nimbu, amla, tomato), and avoid tea or coffee within an hour of meals.',
  'Vitamin B12 is borderline for vegetarians — a periodic blood test is worth it.',
  'Vitamin D is hard to get from food — 15–20 minutes of morning sunlight helps, and a one-time blood test is a good idea.',
  'A gentle suggestion: a one-time blood panel (B12, Vitamin D, Hb, ferritin, TSH) and a chat with your doctor. This is information, not alarm.',
]
