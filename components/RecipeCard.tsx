import Link from 'next/link';

interface Recipe {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  prepTime: number;
  cookTime: number;
  calories: number;
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <article className="card">
      <Link href={`/recipes/${recipe.id}`} className="block">
        <div className="overflow-hidden">
          <img
            className="h-[235px] w-full object-cover"
            src={recipe.image}
            loading="lazy"
            decoding="async"
            alt={recipe.title}
          />
        </div>
        <div className="p-5">
          <span className="chip">{recipe.category}</span>
          <h3 className="mt-[10px] mb-[8px] font-['Playfair_Display'] text-[22px] leading-[1.18] line-clamp-2">
            {recipe.title}
          </h3>
          <p className="text-[14px] text-[#565a52] line-clamp-2">{recipe.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-[12px] gap-y-1 text-[12px] text-[#74776f] border-t border-[#f0ede8] pt-3">
            <span>⏱ {recipe.prepTime + recipe.cookTime} phút</span>
            <span>🔥 {recipe.calories} kcal</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
