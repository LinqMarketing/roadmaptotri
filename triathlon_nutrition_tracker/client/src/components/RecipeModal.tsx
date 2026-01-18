import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: {
    name: string;
    description: string;
    caloriesPerServing: number;
    carbs: number;
    protein: number;
    fats: number;
    servingSize: string;
    prepTime: number;
    cookTime: number;
    ingredients: string;
    instructions: string;
  } | null;
}

export function RecipeModal({ isOpen, onClose, recipe }: RecipeModalProps) {
  if (!recipe) return null;

  let ingredients: Array<{ item: string; amount: string; unit: string; calories: number; carbs: number; protein: number; fats: number }> = [];
  let instructions: string[] = [];

  try {
    ingredients = JSON.parse(recipe.ingredients);
    instructions = JSON.parse(recipe.instructions);
  } catch (e) {
    console.error('Error parsing recipe data:', e);
  }

  const handleDownloadPDF = () => {
    const element = document.getElementById('recipe-content');
    if (!element) return;

    const opt: any = {
      margin: 10,
      filename: `${recipe.name.replace(/\s+/g, '_')}_recipe.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    };

    (html2pdf() as any).set(opt).from(element).save();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{recipe.name}</DialogTitle>
        </DialogHeader>

        <div id="recipe-content" className="space-y-6 p-4">
          {/* Description */}
          <p className="text-gray-600 italic">{recipe.description}</p>

          {/* Nutrition Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <p className="text-xs text-gray-600 font-semibold">CALORIES</p>
              <p className="text-xl font-bold">{recipe.caloriesPerServing}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold">CARBS</p>
              <p className="text-xl font-bold">{recipe.carbs}g</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold">PROTEIN</p>
              <p className="text-xl font-bold">{recipe.protein}g</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold">FATS</p>
              <p className="text-xl font-bold">{recipe.fats}g</p>
            </div>
          </div>

          {/* Serving Size & Time */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600 font-semibold">Serving Size</p>
              <p>{recipe.servingSize}</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Prep Time</p>
              <p>{recipe.prepTime} min</p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Cook Time</p>
              <p>{recipe.cookTime} min</p>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-lg font-bold mb-3 border-b-2 border-red-600 pb-2">Ingredients</h3>
            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>
                    {ing.amount} {ing.unit} {ing.item}
                  </span>
                  <span className="text-gray-600">
                    {ing.calories} cal | {ing.carbs}g C | {ing.protein}g P | {ing.fats}g F
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-bold mb-3 border-b-2 border-red-600 pb-2">Instructions</h3>
            <ol className="space-y-2">
              {instructions.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-sm">
                  <span className="font-bold text-red-600 flex-shrink-0">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleDownloadPDF} className="bg-red-600 hover:bg-red-700">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
