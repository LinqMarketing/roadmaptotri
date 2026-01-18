import { getDb } from '../server/db';
import { mealPrepRecipes } from '../drizzle/schema';

const detailedMeals = [
  // PRE-WORKOUT (7 AM) - 5 options
  {
    name: 'Banana with Almond Butter',
    description: 'Quick energy source, easy to digest before training',
    category: 'pre-workout' as const,
    caloriesPerServing: 280,
    carbs: 35,
    protein: 10,
    fats: 12,
    servingSize: '1 medium banana + 1.5 tbsp almond butter',
    prepTime: 2,
    cookTime: 0,
    ingredients: JSON.stringify([
      { item: 'Medium banana', amount: '1', unit: 'whole', calories: 105, carbs: 27, protein: 1, fats: 0 },
      { item: 'Natural almond butter', amount: '1.5', unit: 'tbsp', calories: 142, carbs: 5, protein: 5, fats: 13 },
      { item: 'Water with electrolytes', amount: '8', unit: 'oz', calories: 0, carbs: 0, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Slice 1 medium banana into a bowl',
      'Add 1.5 tablespoons almond butter in a small dish on the side',
      'Dip banana slices into almond butter as you eat',
      'Drink 8oz water with electrolytes'
    ]),
  },
  {
    name: 'Oatmeal with Honey',
    description: 'Sustained energy with quick carbs and fiber',
    category: 'pre-workout' as const,
    caloriesPerServing: 320,
    carbs: 52,
    protein: 8,
    fats: 6,
    servingSize: '1/2 cup dry oats + 1 cup water + 1 tbsp honey + 1 tbsp butter',
    prepTime: 5,
    cookTime: 5,
    ingredients: JSON.stringify([
      { item: 'Rolled oats (dry)', amount: '0.5', unit: 'cup', calories: 150, carbs: 27, protein: 5, fats: 3 },
      { item: 'Water', amount: '1', unit: 'cup', calories: 0, carbs: 0, protein: 0, fats: 0 },
      { item: 'Raw honey', amount: '1', unit: 'tbsp', calories: 64, carbs: 17, protein: 0, fats: 0 },
      { item: 'Unsalted butter', amount: '1', unit: 'tbsp', calories: 100, carbs: 0, protein: 0, fats: 11 },
      { item: 'Sea salt', amount: 'pinch', unit: '', calories: 0, carbs: 0, protein: 0, fats: 0 },
      { item: 'Cinnamon (optional)', amount: '0.25', unit: 'tsp', calories: 0, carbs: 0, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Bring 1 cup water to a boil in a small pot',
      'Add pinch of sea salt and 0.5 cup rolled oats',
      'Reduce heat to medium and stir occasionally for 5 minutes until creamy',
      'Transfer to bowl and stir in 1 tablespoon butter until melted',
      'Drizzle 1 tablespoon honey on top',
      'Sprinkle cinnamon if desired',
      'Let cool for 1 minute before eating'
    ]),
  },
  {
    name: 'Toast with Jam',
    description: 'Simple carbs for quick energy',
    category: 'pre-workout' as const,
    caloriesPerServing: 250,
    carbs: 48,
    protein: 7,
    fats: 3,
    servingSize: '2 slices whole wheat toast + 2 tbsp jam',
    prepTime: 3,
    cookTime: 2,
    ingredients: JSON.stringify([
      { item: 'Whole wheat bread', amount: '2', unit: 'slices', calories: 140, carbs: 24, protein: 6, fats: 2 },
      { item: 'Fruit jam', amount: '2', unit: 'tbsp', calories: 110, carbs: 27, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Toast 2 slices of whole wheat bread in toaster until golden brown (2-3 minutes)',
      'Spread 1 tablespoon jam on each slice evenly',
      'Eat immediately while warm',
      'Drink 8oz water or sports drink'
    ]),
  },
  {
    name: 'Greek Yogurt with Granola',
    description: 'Protein and carbs for sustained energy',
    category: 'pre-workout' as const,
    caloriesPerServing: 300,
    carbs: 42,
    protein: 15,
    fats: 7,
    servingSize: '1 cup Greek yogurt + 1/4 cup granola + 1 tbsp honey',
    prepTime: 2,
    cookTime: 0,
    ingredients: JSON.stringify([
      { item: 'Plain Greek yogurt (2% fat)', amount: '1', unit: 'cup', calories: 150, carbs: 6, protein: 20, fats: 3 },
      { item: 'Granola', amount: '0.25', unit: 'cup', calories: 140, carbs: 18, protein: 3, fats: 6 },
      { item: 'Raw honey', amount: '1', unit: 'tbsp', calories: 64, carbs: 17, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Pour 1 cup Greek yogurt into a bowl',
      'Sprinkle 1/4 cup granola on top',
      'Drizzle 1 tablespoon honey over the granola',
      'Mix gently to combine, or eat layered',
      'Eat immediately'
    ]),
  },
  {
    name: 'Rice Cakes with Honey',
    description: 'Light, digestible carbs before training',
    category: 'pre-workout' as const,
    caloriesPerServing: 220,
    carbs: 45,
    protein: 4,
    fats: 2,
    servingSize: '3 rice cakes + 1.5 tbsp honey',
    prepTime: 2,
    cookTime: 0,
    ingredients: JSON.stringify([
      { item: 'Plain rice cakes', amount: '3', unit: 'cakes', calories: 112, carbs: 24, protein: 2, fats: 1 },
      { item: 'Raw honey', amount: '1.5', unit: 'tbsp', calories: 97, carbs: 26, protein: 0, fats: 0 },
      { item: 'Sea salt', amount: 'pinch', unit: '', calories: 0, carbs: 0, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Arrange 3 rice cakes on a plate',
      'Drizzle 1.5 tablespoons honey evenly across all 3 cakes',
      'Sprinkle light pinch of sea salt on each cake',
      'Eat immediately',
      'Drink 8oz water'
    ]),
  },

  // POST-WORKOUT (After Training) - 5 options
  {
    name: 'Chicken Breast with Rice',
    description: 'High protein recovery with quick carbs',
    category: 'post-workout' as const,
    caloriesPerServing: 450,
    carbs: 55,
    protein: 45,
    fats: 4,
    servingSize: '6 oz grilled chicken + 1 cup white rice',
    prepTime: 20,
    cookTime: 20,
    ingredients: JSON.stringify([
      { item: 'Boneless, skinless chicken breast (raw)', amount: '6', unit: 'oz', calories: 210, carbs: 0, protein: 45, fats: 4 },
      { item: 'White rice (cooked)', amount: '1', unit: 'cup', calories: 240, carbs: 53, protein: 4, fats: 0 },
      { item: 'Olive oil', amount: '1', unit: 'tsp', calories: 40, carbs: 0, protein: 0, fats: 5 },
      { item: 'Sea salt and black pepper', amount: 'to taste', unit: '', calories: 0, carbs: 0, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Season 6 oz raw chicken breast with salt and pepper',
      'Heat 1 teaspoon olive oil in a skillet over medium-high heat',
      'Cook chicken for 6-7 minutes per side until internal temperature reaches 165°F',
      'While chicken cooks, prepare 1 cup white rice (use rice cooker or boil 1/3 cup dry rice in 2/3 cup water for 18 minutes)',
      'Slice cooked chicken into strips',
      'Plate 1 cup rice and top with sliced chicken',
      'Eat immediately while warm'
    ]),
  },
  {
    name: 'Protein Smoothie',
    description: 'Fast-absorbing protein and carbs for recovery',
    category: 'post-workout' as const,
    caloriesPerServing: 380,
    carbs: 48,
    protein: 35,
    fats: 5,
    servingSize: '1 scoop protein powder + 1 banana + 1 cup milk',
    prepTime: 3,
    cookTime: 0,
    ingredients: JSON.stringify([
      { item: 'Whey protein powder', amount: '1', unit: 'scoop', calories: 120, carbs: 1, protein: 25, fats: 2 },
      { item: 'Medium banana', amount: '1', unit: 'whole', calories: 105, carbs: 27, protein: 1, fats: 0 },
      { item: 'Whole milk', amount: '1', unit: 'cup', calories: 150, carbs: 12, protein: 8, fats: 8 },
      { item: 'Ice cubes', amount: '0.5', unit: 'cup', calories: 0, carbs: 0, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Add 1 cup milk to blender first',
      'Add 1 scoop protein powder',
      'Peel and break 1 medium banana into chunks',
      'Add banana to blender',
      'Add 0.5 cup ice cubes',
      'Blend on high for 45-60 seconds until smooth and creamy',
      'Pour into shaker bottle or glass and drink immediately'
    ]),
  },
  {
    name: 'Turkey Sandwich',
    description: 'Convenient recovery meal with protein and carbs',
    category: 'post-workout' as const,
    caloriesPerServing: 420,
    carbs: 45,
    protein: 38,
    fats: 8,
    servingSize: '6 oz turkey + 2 slices whole wheat bread + veggies',
    prepTime: 5,
    cookTime: 0,
    ingredients: JSON.stringify([
      { item: 'Sliced turkey breast', amount: '6', unit: 'oz', calories: 280, carbs: 1, protein: 38, fats: 14 },
      { item: 'Whole wheat bread', amount: '2', unit: 'slices', calories: 140, carbs: 24, protein: 6, fats: 2 },
      { item: 'Mayonnaise', amount: '1', unit: 'tbsp', calories: 90, carbs: 0, protein: 0, fats: 10 },
      { item: 'Lettuce leaves', amount: '2', unit: 'leaves', calories: 3, carbs: 1, protein: 0, fats: 0 },
      { item: 'Tomato slices', amount: '2', unit: 'slices', calories: 5, carbs: 1, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Toast 2 slices whole wheat bread lightly (optional)',
      'Spread 1 tablespoon mayonnaise on one slice',
      'Layer 6 oz turkey slices on top',
      'Add 2 lettuce leaves',
      'Add 2 tomato slices',
      'Top with second slice of bread',
      'Cut diagonally and eat immediately'
    ]),
  },
  {
    name: 'Egg Scramble with Toast',
    description: 'Complete recovery meal with quality protein',
    category: 'post-workout' as const,
    caloriesPerServing: 400,
    carbs: 40,
    protein: 32,
    fats: 12,
    servingSize: '3 eggs + 2 slices toast + butter',
    prepTime: 10,
    cookTime: 10,
    ingredients: JSON.stringify([
      { item: 'Large eggs', amount: '3', unit: 'eggs', calories: 210, carbs: 2, protein: 18, fats: 15 },
      { item: 'Whole wheat bread', amount: '2', unit: 'slices', calories: 140, carbs: 24, protein: 6, fats: 2 },
      { item: 'Unsalted butter', amount: '1', unit: 'tbsp', calories: 100, carbs: 0, protein: 0, fats: 11 },
      { item: 'Sea salt and black pepper', amount: 'to taste', unit: '', calories: 0, carbs: 0, protein: 0, fats: 0 },
      { item: 'Bell peppers (optional)', amount: '0.25', unit: 'cup', calories: 8, carbs: 2, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Toast 2 slices whole wheat bread in toaster',
      'Heat 1 tablespoon butter in a non-stick skillet over medium heat',
      'Crack 3 eggs into a bowl and whisk with salt and pepper',
      'Pour eggs into skillet and stir constantly for 3-4 minutes until fully cooked',
      'Add diced peppers if using (optional)',
      'Butter the toast lightly',
      'Plate eggs and toast together',
      'Eat immediately while warm'
    ]),
  },
  {
    name: 'Tuna with Sweet Potato',
    description: 'Lean protein with nutrient-dense carbs',
    category: 'post-workout' as const,
    caloriesPerServing: 380,
    carbs: 50,
    protein: 40,
    fats: 3,
    servingSize: '5 oz canned tuna + 1 medium sweet potato',
    prepTime: 15,
    cookTime: 15,
    ingredients: JSON.stringify([
      { item: 'Canned tuna in water (drained)', amount: '5', unit: 'oz', calories: 120, carbs: 0, protein: 26, fats: 1 },
      { item: 'Medium sweet potato (raw)', amount: '1', unit: 'whole', calories: 90, carbs: 20, protein: 2, fats: 0 },
      { item: 'Olive oil', amount: '1', unit: 'tbsp', calories: 120, carbs: 0, protein: 0, fats: 14 },
      { item: 'Sea salt and black pepper', amount: 'to taste', unit: '', calories: 0, carbs: 0, protein: 0, fats: 0 },
      { item: 'Lemon juice (optional)', amount: '1', unit: 'tbsp', calories: 4, carbs: 1, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Preheat oven to 400°F',
      'Wash 1 medium sweet potato and poke 3-4 holes with fork',
      'Bake for 15-20 minutes until soft (can microwave for 5 minutes if time is limited)',
      'While sweet potato cooks, open 1 can tuna and drain water completely',
      'Mix drained tuna with 1 tablespoon olive oil, salt, pepper, and lemon juice (optional)',
      'Cut sweet potato in half and fluff with fork',
      'Top sweet potato with tuna mixture',
      'Eat immediately while warm'
    ]),
  },

  // LUNCH (3 PM) - 5 options
  {
    name: 'Grilled Chicken with Quinoa',
    description: 'Complete meal with lean protein and complete carbs',
    category: 'lunch' as const,
    caloriesPerServing: 520,
    carbs: 58,
    protein: 48,
    fats: 8,
    servingSize: '7 oz grilled chicken + 1 cup cooked quinoa + veggies',
    prepTime: 25,
    cookTime: 25,
    ingredients: JSON.stringify([
      { item: 'Boneless, skinless chicken breast (raw)', amount: '7', unit: 'oz', calories: 245, carbs: 0, protein: 53, fats: 5 },
      { item: 'Quinoa (dry)', amount: '0.33', unit: 'cup', calories: 222, carbs: 39, protein: 8, fats: 4 },
      { item: 'Water for quinoa', amount: '0.67', unit: 'cup', calories: 0, carbs: 0, protein: 0, fats: 0 },
      { item: 'Broccoli florets (fresh)', amount: '1.5', unit: 'cups', calories: 70, carbs: 13, protein: 5, fats: 1 },
      { item: 'Olive oil', amount: '1', unit: 'tbsp', calories: 120, carbs: 0, protein: 0, fats: 14 },
      { item: 'Sea salt and black pepper', amount: 'to taste', unit: '', calories: 0, carbs: 0, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Cook 1/3 cup dry quinoa in 2/3 cup water for 15 minutes, then let sit 5 minutes (yields ~1 cup cooked)',
      'Season 7 oz chicken breast with salt and pepper',
      'Heat 1 tablespoon olive oil in skillet over medium-high heat',
      'Grill chicken 6-7 minutes per side until internal temperature reaches 165°F',
      'While chicken cooks, steam 1.5 cups broccoli florets for 5-7 minutes until tender-crisp',
      'Slice cooked chicken into strips',
      'Plate: 1 cup quinoa, 1.5 cups broccoli, sliced chicken on top',
      'Drizzle any pan juices over the plate'
    ]),
  },
  {
    name: 'Beef Steak with Potatoes',
    description: 'Iron-rich protein with satisfying carbs',
    category: 'lunch' as const,
    caloriesPerServing: 580,
    carbs: 52,
    protein: 50,
    fats: 14,
    servingSize: '6 oz steak + 1 medium baked potato + veggies',
    prepTime: 30,
    cookTime: 30,
    ingredients: JSON.stringify([
      { item: 'Lean beef steak (sirloin or ribeye, raw)', amount: '6', unit: 'oz', calories: 280, carbs: 0, protein: 40, fats: 14 },
      { item: 'Medium potato', amount: '1', unit: 'whole', calories: 160, carbs: 36, protein: 4, fats: 0 },
      { item: 'Olive oil', amount: '1', unit: 'tbsp', calories: 120, carbs: 0, protein: 0, fats: 14 },
      { item: 'Mixed vegetables (broccoli, carrots, green beans)', amount: '1.5', unit: 'cups', calories: 50, carbs: 10, protein: 3, fats: 0 },
      { item: 'Sea salt and black pepper', amount: 'to taste', unit: '', calories: 0, carbs: 0, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Preheat oven to 400°F',
      'Wash 1 medium potato, poke with fork, and bake for 20-25 minutes until tender',
      'Remove steak from refrigerator 10 minutes before cooking',
      'Pat steak dry with paper towels and season generously with salt and pepper',
      'Heat 1 tablespoon olive oil in cast iron skillet over high heat until smoking',
      'Sear steak 4-5 minutes per side for medium-rare (internal temp 135°F)',
      'Let steak rest 5 minutes before slicing',
      'Steam 1.5 cups mixed vegetables for 5-7 minutes',
      'Cut potato in half and fluff with fork',
      'Plate: potato, steak slices, vegetables on the side'
    ]),
  },
  {
    name: 'Turkey Meatballs with Pasta',
    description: 'Lean protein with quick-digesting carbs',
    category: 'lunch' as const,
    caloriesPerServing: 510,
    carbs: 60,
    protein: 42,
    fats: 8,
    servingSize: '6 oz turkey meatballs + 1.5 cups pasta + sauce',
    prepTime: 20,
    cookTime: 20,
    ingredients: JSON.stringify([
      { item: 'Ground turkey (raw)', amount: '6', unit: 'oz', calories: 280, carbs: 0, protein: 35, fats: 14 },
      { item: 'Pasta (cooked)', amount: '1.5', unit: 'cups', calories: 210, carbs: 42, protein: 7, fats: 1 },
      { item: 'Marinara sauce', amount: '0.5', unit: 'cup', calories: 40, carbs: 6, protein: 1, fats: 1 },
      { item: 'Breadcrumbs', amount: '0.25', unit: 'cup', calories: 110, carbs: 20, protein: 3, fats: 1 },
      { item: 'Large egg', amount: '1', unit: 'egg', calories: 70, carbs: 1, protein: 6, fats: 5 },
      { item: 'Grated Parmesan', amount: '1', unit: 'tbsp', calories: 22, carbs: 0, protein: 2, fats: 1 },
      { item: 'Garlic powder, Italian seasoning, salt, pepper', amount: 'to taste', unit: '', calories: 0, carbs: 0, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Preheat oven to 375°F',
      'In a bowl, combine 6 oz ground turkey, 1/4 cup breadcrumbs, 1 egg, 1 tablespoon Parmesan, garlic powder, Italian seasoning, salt, and pepper',
      'Form 8-10 meatballs (about 1.5 inches diameter)',
      'Place on greased baking sheet',
      'Bake for 15-18 minutes until cooked through (internal temp 165°F)',
      'While meatballs bake, cook 1 cup dry pasta according to package directions (about 9-10 minutes)',
      'Drain pasta and toss with 0.5 cup marinara sauce',
      'Add cooked meatballs to pasta and sauce',
      'Plate and serve immediately'
    ]),
  },
  {
    name: 'Salmon with Rice and Broccoli',
    description: 'Omega-3 rich with complete nutrition',
    category: 'lunch' as const,
    caloriesPerServing: 540,
    carbs: 55,
    protein: 45,
    fats: 12,
    servingSize: '6 oz salmon + 1 cup rice + 1.5 cups broccoli',
    prepTime: 10,
    cookTime: 50,
    ingredients: JSON.stringify([
      { item: 'Salmon fillet (raw)', amount: '5', unit: 'oz', calories: 280, carbs: 0, protein: 32, fats: 16 },
      { item: 'Brown rice (cooked)', amount: '1', unit: 'cup', calories: 215, carbs: 45, protein: 5, fats: 2 },
      { item: 'Broccoli florets', amount: '1.5', unit: 'cups', calories: 70, carbs: 13, protein: 5, fats: 1 },
      { item: 'Olive oil', amount: '1', unit: 'tbsp', calories: 120, carbs: 0, protein: 0, fats: 14 },
      { item: 'Lemon wedge', amount: '1', unit: 'wedge', calories: 9, carbs: 3, protein: 0, fats: 0 },
      { item: 'Sea salt and black pepper', amount: 'to taste', unit: '', calories: 0, carbs: 0, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Cook 1/3 cup dry brown rice in 2/3 cup water for 45 minutes (or use quick-cook brown rice for 10 minutes)',
      'Preheat oven to 400°F',
      'Place 5 oz salmon skin-side down on parchment paper',
      'Drizzle with 1 tablespoon olive oil',
      'Season with salt, pepper, and squeeze of lemon juice',
      'Bake for 12-15 minutes until salmon flakes easily with fork',
      'While salmon bakes, steam 1.5 cups broccoli for 5-7 minutes',
      'Plate: 1 cup brown rice, salmon fillet, broccoli on the side',
      'Garnish with lemon wedge'
    ]),
  },
  {
    name: 'Chicken Burrito Bowl',
    description: 'Satisfying meal with balanced macros',
    category: 'lunch' as const,
    caloriesPerServing: 530,
    carbs: 62,
    protein: 44,
    fats: 10,
    servingSize: '6 oz chicken + 1 cup rice + beans + veggies',
    prepTime: 20,
    cookTime: 20,
    ingredients: JSON.stringify([
      { item: 'Boneless, skinless chicken breast (raw)', amount: '6', unit: 'oz', calories: 210, carbs: 0, protein: 45, fats: 4 },
      { item: 'White rice (cooked)', amount: '1', unit: 'cup', calories: 240, carbs: 53, protein: 4, fats: 0 },
      { item: 'Black beans (cooked)', amount: '0.5', unit: 'cup', calories: 115, carbs: 20, protein: 8, fats: 0 },
      { item: 'Corn', amount: '0.25', unit: 'cup', calories: 35, carbs: 8, protein: 1, fats: 0 },
      { item: 'Salsa', amount: '0.25', unit: 'cup', calories: 15, carbs: 3, protein: 0, fats: 0 },
      { item: 'Avocado', amount: '0.25', unit: 'whole', calories: 60, carbs: 3, protein: 1, fats: 5 },
      { item: 'Olive oil', amount: '1', unit: 'tbsp', calories: 120, carbs: 0, protein: 0, fats: 14 },
      { item: 'Sea salt and black pepper', amount: 'to taste', unit: '', calories: 0, carbs: 0, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Cook 1/3 cup dry white rice in 2/3 cup water for 18 minutes',
      'Season 6 oz chicken breast with salt and pepper',
      'Heat 1 tablespoon olive oil in skillet over medium-high heat',
      'Grill chicken 6-7 minutes per side until internal temperature reaches 165°F',
      'Slice cooked chicken into strips',
      'Warm 0.5 cup black beans in a small pot (or microwave for 1 minute)',
      'Warm 0.25 cup corn (fresh, frozen, or canned)',
      'Build bowl: 1 cup rice as base, top with black beans, corn, chicken strips',
      'Add 0.25 cup salsa and 0.25 avocado slices',
      'Mix gently and eat immediately'
    ]),
  },

  // SNACKS - 5 options
  {
    name: 'Apple with Peanut Butter',
    description: 'Quick energy with sustained carbs and protein',
    category: 'snack' as const,
    caloriesPerServing: 220,
    carbs: 28,
    protein: 8,
    fats: 9,
    servingSize: '1 medium apple + 1 tbsp peanut butter',
    prepTime: 2,
    cookTime: 0,
    ingredients: JSON.stringify([
      { item: 'Medium apple', amount: '1', unit: 'whole', calories: 95, carbs: 25, protein: 0, fats: 0 },
      { item: 'Natural peanut butter', amount: '1', unit: 'tbsp', calories: 95, carbs: 3, protein: 4, fats: 8 },
      { item: 'Sea salt (optional)', amount: 'pinch', unit: '', calories: 0, carbs: 0, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Wash 1 medium apple',
      'Slice apple into 8-12 wedges',
      'Place 1 tablespoon peanut butter in a small dish',
      'Dip each apple slice into peanut butter',
      'Eat immediately',
      'Drink 8oz water'
    ]),
  },
  {
    name: 'Protein Bar',
    description: 'Convenient on-the-go snack',
    category: 'snack' as const,
    caloriesPerServing: 250,
    carbs: 30,
    protein: 20,
    fats: 8,
    servingSize: '1 protein bar',
    prepTime: 0,
    cookTime: 0,
    ingredients: JSON.stringify([
      { item: 'Store-bought protein bar (Quest, RXBAR, ONE, or Clif Builder)', amount: '1', unit: 'bar', calories: 250, carbs: 30, protein: 20, fats: 8 }
    ]),
    instructions: JSON.stringify([
      'Keep protein bar in gym bag or pocket',
      'Unwrap bar',
      'Eat immediately',
      'Drink 8-12oz water'
    ]),
  },
  {
    name: 'Mixed Nuts and Dried Fruit',
    description: 'Energy-dense snack for sustained fuel',
    category: 'snack' as const,
    caloriesPerServing: 280,
    carbs: 32,
    protein: 9,
    fats: 14,
    servingSize: '1/4 cup mixed nuts + 1/4 cup dried fruit',
    prepTime: 0,
    cookTime: 0,
    ingredients: JSON.stringify([
      { item: 'Raw almonds', amount: '0.25', unit: 'cup', calories: 190, carbs: 7, protein: 7, fats: 16 },
      { item: 'Dried raisins', amount: '0.25', unit: 'cup', calories: 120, carbs: 32, protein: 1, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Measure 1/4 cup almonds into a small container or bag',
      'Measure 1/4 cup raisins into the same container',
      'Mix together',
      'Eat immediately or store in airtight container for up to 1 week',
      'Drink 8oz water'
    ]),
  },
  {
    name: 'Cottage Cheese with Berries',
    description: 'High protein snack with antioxidants',
    category: 'snack' as const,
    caloriesPerServing: 200,
    carbs: 18,
    protein: 25,
    fats: 4,
    servingSize: '1 cup cottage cheese + 1/2 cup berries',
    prepTime: 2,
    cookTime: 0,
    ingredients: JSON.stringify([
      { item: 'Plain cottage cheese (2% fat)', amount: '1', unit: 'cup', calories: 180, carbs: 6, protein: 28, fats: 4 },
      { item: 'Fresh mixed berries', amount: '0.5', unit: 'cup', calories: 40, carbs: 10, protein: 1, fats: 0 },
      { item: 'Raw honey (optional)', amount: '0.5', unit: 'tsp', calories: 10, carbs: 2, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Scoop 1 cup cottage cheese into a bowl',
      'Top with 0.5 cup fresh berries (blueberries, strawberries, raspberries, or mixed)',
      'Optional: drizzle 0.5 teaspoon honey on top',
      'Mix gently or eat layered',
      'Eat immediately'
    ]),
  },
  {
    name: 'Energy Balls',
    description: 'Homemade snack with oats and nut butter',
    category: 'snack' as const,
    caloriesPerServing: 240,
    carbs: 28,
    protein: 8,
    fats: 11,
    servingSize: '3 energy balls',
    prepTime: 15,
    cookTime: 0,
    ingredients: JSON.stringify([
      { item: 'Rolled oats', amount: '1', unit: 'cup', calories: 300, carbs: 54, protein: 10, fats: 5 },
      { item: 'Natural peanut butter', amount: '0.5', unit: 'cup', calories: 760, carbs: 28, protein: 32, fats: 64 },
      { item: 'Raw honey', amount: '0.33', unit: 'cup', calories: 310, carbs: 84, protein: 0, fats: 0 },
      { item: 'Dark chocolate chips', amount: '0.5', unit: 'cup', calories: 420, carbs: 48, protein: 4, fats: 24 }
    ]),
    instructions: JSON.stringify([
      'In a large bowl, combine 1 cup rolled oats, 0.5 cup peanut butter, 0.33 cup honey, and 0.5 cup chocolate chips',
      'Mix thoroughly with a wooden spoon until well combined (mixture will be thick)',
      'Refrigerate for 15 minutes to make handling easier',
      'Roll mixture into 12 balls about 1.5 inches in diameter',
      'Place on parchment paper and refrigerate for at least 30 minutes',
      'Store in airtight container in refrigerator for up to 2 weeks',
      'Eat 3 balls per serving'
    ]),
  },

  // DINNER (6 PM) - 5 options
  {
    name: 'Slow Cooker Chicken with Veggies',
    description: 'Tender, flavorful, minimal effort meal prep',
    category: 'dinner' as const,
    caloriesPerServing: 480,
    carbs: 48,
    protein: 52,
    fats: 8,
    servingSize: '8 oz chicken + 1.5 cups veggies + 0.5 cup sauce',
    prepTime: 10,
    cookTime: 240,
    ingredients: JSON.stringify([
      { item: 'Boneless, skinless chicken breast (raw)', amount: '8', unit: 'oz', calories: 280, carbs: 0, protein: 60, fats: 6 },
      { item: 'Medium carrots', amount: '2', unit: 'carrots', calories: 55, carbs: 13, protein: 1, fats: 0 },
      { item: 'Celery stalks', amount: '2', unit: 'stalks', calories: 12, carbs: 2, protein: 1, fats: 0 },
      { item: 'Small onion', amount: '1', unit: 'whole', calories: 28, carbs: 7, protein: 1, fats: 0 },
      { item: 'Low-sodium chicken broth', amount: '1', unit: 'cup', calories: 15, carbs: 1, protein: 2, fats: 0 },
      { item: 'Olive oil', amount: '1', unit: 'tbsp', calories: 120, carbs: 0, protein: 0, fats: 14 },
      { item: 'Dried Italian seasoning', amount: '1', unit: 'tsp', calories: 0, carbs: 0, protein: 0, fats: 0 },
      { item: 'Sea salt and black pepper', amount: 'to taste', unit: '', calories: 0, carbs: 0, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Chop 2 carrots into 1-inch pieces',
      'Chop 2 celery stalks into 1-inch pieces',
      'Dice 1 small onion',
      'Add 1 tablespoon olive oil to slow cooker',
      'Add 8 oz chicken breast',
      'Layer vegetables on top: carrots, celery, onion',
      'Pour 1 cup chicken broth over everything',
      'Sprinkle Italian seasoning, salt, and pepper',
      'Cover and cook on LOW for 6-8 hours or HIGH for 3-4 hours',
      'Chicken should be tender and easily shred with fork',
      'Serve in bowl with vegetables and broth'
    ]),
  },
  {
    name: 'Air Fryer Steak with Sweet Potato',
    description: 'Quick, crispy steak with nutrient-dense carbs',
    category: 'dinner' as const,
    caloriesPerServing: 520,
    carbs: 50,
    protein: 48,
    fats: 12,
    servingSize: '6 oz steak + 1 medium sweet potato + veggies',
    prepTime: 5,
    cookTime: 15,
    ingredients: JSON.stringify([
      { item: 'Beef steak (sirloin, raw)', amount: '6', unit: 'oz', calories: 280, carbs: 0, protein: 40, fats: 14 },
      { item: 'Medium sweet potato', amount: '1', unit: 'whole', calories: 90, carbs: 20, protein: 2, fats: 0 },
      { item: 'Olive oil', amount: '1', unit: 'tbsp', calories: 120, carbs: 0, protein: 0, fats: 14 },
      { item: 'Garlic powder', amount: '1', unit: 'tsp', calories: 0, carbs: 0, protein: 0, fats: 0 },
      { item: 'Sea salt and black pepper', amount: 'to taste', unit: '', calories: 0, carbs: 0, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Preheat air fryer to 400°F for 3 minutes',
      'Pat 6 oz steak dry with paper towels',
      'Season generously with salt, pepper, and garlic powder',
      'Lightly coat with 1 tablespoon olive oil',
      'Place steak in air fryer basket',
      'Cook for 12-15 minutes for medium-rare (internal temp 135°F)',
      'While steak cooks, wash 1 medium sweet potato and poke with fork',
      'Microwave sweet potato for 5 minutes, then finish in air fryer for last 5 minutes of steak cooking',
      'Let steak rest 3 minutes before serving',
      'Cut sweet potato in half and fluff with fork',
      'Plate steak and sweet potato together'
    ]),
  },
  {
    name: 'Turkey Chili',
    description: 'Hearty, protein-packed meal with fiber',
    category: 'dinner' as const,
    caloriesPerServing: 450,
    carbs: 48,
    protein: 44,
    fats: 8,
    servingSize: '1.5 cups turkey chili',
    prepTime: 10,
    cookTime: 30,
    ingredients: JSON.stringify([
      { item: 'Ground turkey (raw)', amount: '1', unit: 'lb', calories: 560, carbs: 0, protein: 105, fats: 28 },
      { item: 'Canned black beans', amount: '1', unit: 'can (15oz)', calories: 340, carbs: 60, protein: 24, fats: 2 },
      { item: 'Canned diced tomatoes', amount: '1', unit: 'can (15oz)', calories: 80, carbs: 18, protein: 3, fats: 0 },
      { item: 'Medium onion', amount: '1', unit: 'whole', calories: 44, carbs: 10, protein: 1, fats: 0 },
      { item: 'Red bell pepper', amount: '1', unit: 'whole', calories: 37, carbs: 9, protein: 1, fats: 0 },
      { item: 'Chili powder', amount: '2', unit: 'tbsp', calories: 24, carbs: 4, protein: 1, fats: 1 },
      { item: 'Olive oil', amount: '1', unit: 'tbsp', calories: 120, carbs: 0, protein: 0, fats: 14 },
      { item: 'Ground cumin', amount: '1', unit: 'tsp', calories: 8, carbs: 1, protein: 0, fats: 0 },
      { item: 'Sea salt and black pepper', amount: 'to taste', unit: '', calories: 0, carbs: 0, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Heat 1 tablespoon olive oil in large pot over medium-high heat',
      'Dice 1 onion and 1 red bell pepper',
      'Add onion and bell pepper to pot, sauté for 3-4 minutes until softened',
      'Add 1 lb ground turkey, breaking it up as it cooks',
      'Cook for 5-7 minutes until turkey is browned and cooked through',
      'Drain excess fat if needed',
      'Add 1 can black beans (with liquid), 1 can diced tomatoes (with liquid)',
      'Stir in 2 tablespoons chili powder, 1 teaspoon cumin, salt, and pepper',
      'Reduce heat to low and simmer for 20-30 minutes, stirring occasionally',
      'Taste and adjust seasonings',
      'Serve 1.5 cups per person',
      'Store remaining in airtight container for up to 4 days'
    ]),
  },
  {
    name: 'Baked Salmon with Rice and Broccoli',
    description: 'Omega-3 rich with complete nutrition',
    category: 'dinner' as const,
    caloriesPerServing: 510,
    carbs: 52,
    protein: 46,
    fats: 11,
    servingSize: '6 oz salmon + 1 cup rice + 1.5 cups broccoli',
    prepTime: 10,
    cookTime: 50,
    ingredients: JSON.stringify([
      { item: 'Salmon fillet (raw)', amount: '6', unit: 'oz', calories: 336, carbs: 0, protein: 38, fats: 19 },
      { item: 'Brown rice (cooked)', amount: '1', unit: 'cup', calories: 215, carbs: 45, protein: 5, fats: 2 },
      { item: 'Broccoli florets', amount: '1.5', unit: 'cups', calories: 70, carbs: 13, protein: 5, fats: 1 },
      { item: 'Olive oil', amount: '1', unit: 'tbsp', calories: 120, carbs: 0, protein: 0, fats: 14 },
      { item: 'Lemon wedge', amount: '1', unit: 'wedge', calories: 9, carbs: 3, protein: 0, fats: 0 },
      { item: 'Sea salt and black pepper', amount: 'to taste', unit: '', calories: 0, carbs: 0, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Cook 1/3 cup dry brown rice in 2/3 cup water for 45 minutes (or use quick-cook brown rice)',
      'Preheat oven to 400°F',
      'Line baking sheet with parchment paper',
      'Place 6 oz salmon skin-side down on parchment',
      'Drizzle with 1 tablespoon olive oil',
      'Season with salt, pepper, and squeeze of lemon juice',
      'Bake for 12-15 minutes until salmon flakes easily with fork',
      'While salmon bakes, steam 1.5 cups broccoli florets for 5-7 minutes until tender-crisp',
      'Plate: 1 cup brown rice, salmon fillet, broccoli on the side',
      'Garnish with lemon wedge'
    ]),
  },
  {
    name: 'Grilled Chicken Pasta',
    description: 'Satisfying dinner with balanced macros',
    category: 'dinner' as const,
    caloriesPerServing: 540,
    carbs: 62,
    protein: 48,
    fats: 9,
    servingSize: '7 oz chicken + 1.5 cups pasta + marinara sauce',
    prepTime: 10,
    cookTime: 20,
    ingredients: JSON.stringify([
      { item: 'Boneless, skinless chicken breast (raw)', amount: '7', unit: 'oz', calories: 245, carbs: 0, protein: 53, fats: 5 },
      { item: 'Pasta (cooked)', amount: '1.5', unit: 'cups', calories: 315, carbs: 60, protein: 10, fats: 2 },
      { item: 'Marinara sauce', amount: '1', unit: 'cup', calories: 80, carbs: 12, protein: 2, fats: 2 },
      { item: 'Olive oil', amount: '1', unit: 'tbsp', calories: 120, carbs: 0, protein: 0, fats: 14 },
      { item: 'Garlic cloves (minced)', amount: '2', unit: 'cloves', calories: 9, carbs: 2, protein: 0, fats: 0 },
      { item: 'Fresh basil (chopped)', amount: '1', unit: 'tbsp', calories: 0, carbs: 0, protein: 0, fats: 0 },
      { item: 'Sea salt and black pepper', amount: 'to taste', unit: '', calories: 0, carbs: 0, protein: 0, fats: 0 }
    ]),
    instructions: JSON.stringify([
      'Cook 1 cup dry pasta according to package directions (about 9-10 minutes)',
      'Season 7 oz chicken breast with salt and pepper',
      'Heat 1 tablespoon olive oil in skillet over medium-high heat',
      'Add minced garlic and cook for 30 seconds until fragrant',
      'Add chicken breast and grill 6-7 minutes per side until internal temperature reaches 165°F',
      'While chicken cooks, warm 1 cup marinara sauce in a separate pot over medium heat',
      'Drain cooked pasta',
      'Toss pasta with marinara sauce',
      'Slice cooked chicken into strips',
      'Plate pasta and top with sliced chicken',
      'Garnish with fresh basil',
      'Serve immediately'
    ]),
  },
];

async function seedDetailedMeals() {
  try {
    const db = await getDb();
    if (!db) {
      console.error('❌ Database connection failed');
      process.exit(1);
    }

    // Delete existing meals to avoid duplicates
    await db.delete(mealPrepRecipes);

    // Insert all meals with detailed recipes
    for (const meal of detailedMeals) {
      await db.insert(mealPrepRecipes).values({
        name: meal.name,
        description: meal.description,
        category: meal.category,
        caloriesPerServing: meal.caloriesPerServing,
        carbs: meal.carbs,
        protein: meal.protein,
        fats: meal.fats,
        servingSize: meal.servingSize,
        prepTime: meal.prepTime,
        cookTime: meal.cookTime,
        ingredients: meal.ingredients,
        instructions: meal.instructions,
      });
    }

    console.log(`✅ Successfully seeded ${detailedMeals.length} detailed meal recipes`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding detailed meals:', error);
    process.exit(1);
  }
}

seedDetailedMeals();
