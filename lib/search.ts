import { getArticles, getMealPlans, getRecipes } from './content';

export type SearchHit = { score: number; title: string; href: string; text: string };

const STOP_WORDS = new Set([
  'cho','minh','mình','toi','tôi','can','cần','tim','tìm','cong','công','thuc','thức','mon','món',
  'nao','nào','the','thế','lam','làm','cach','cách','gi','gì','va','và','voi','với','co','có','la','là',
  'ban','bạn','xin','hay','hãy','giup','giúp','an','ăn','nau','nấu','recipe','mot','một','ve','về',
]);

export function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(query: string) {
  return normalize(query)
    .split(' ')
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word));
}

function score(haystack: string, tokens: string[]) {
  const text = normalize(haystack);
  return tokens.reduce((total, token) => (text.includes(token) ? total + 1 : total), 0);
}

function recipeCard(recipe: Record<string, any>) {
  return [
    `### ${recipe.title} — /recipe-detail/${recipe.slug}`,
    `Nhóm: ${recipe.category} · ${recipe.prepTime + (recipe.cookTime ?? 0)} phút · ${recipe.servings} phần · ${recipe.calories} kcal (P${recipe.protein}/C${recipe.carbs}/F${recipe.fat})`,
    recipe.description,
    `Nguyên liệu: ${(recipe.ingredients ?? []).join('; ')}`,
    `Các bước: ${(recipe.steps ?? []).join(' ')}`,
    recipe.mealPrepTips?.length ? `Mẹo meal prep: ${recipe.mealPrepTips.join(' ')}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

function articleCard(article: Record<string, any>) {
  const sections = (article.sections ?? [])
    .map((s: any) => `${s.heading}: ${s.body}`)
    .join(' ')
    .slice(0, 900);
  return [
    `### ${article.title} — /article-detail/${article.slug}`,
    `Chủ đề: ${article.category} · ${article.readTime}`,
    article.excerpt,
    article.intro,
    sections,
  ]
    .filter(Boolean)
    .join('\n');
}

function mealPlanCard(plan: Record<string, any>) {
  const days = (plan.days ?? [])
    .map((day: any) => `${day.day ?? day.title ?? ''}: ${[day.breakfast, day.lunch, day.dinner, day.snack].filter(Boolean).join(' / ')}`)
    .join(' | ')
    .slice(0, 700);
  return [`### ${plan.title} — /meal-prep`, plan.description, days].filter(Boolean).join('\n');
}

/** Keyword retrieval over blog data so the model answers from site content instead of guessing. */
export function searchContent(query: string, limit = 4) {
  const tokens = tokenize(query);
  if (!tokens.length) return [];

  const candidates: SearchHit[] = [];

  for (const recipe of getRecipes()) {
    const value =
      score(recipe.title, tokens) * 3 +
      score(recipe.category ?? '', tokens) * 2 +
      score(recipe.description ?? '', tokens) * 2 +
      score((recipe.ingredients ?? []).join(' '), tokens) +
      score((recipe.steps ?? []).join(' '), tokens);
    if (value > 0)
      candidates.push({
        score: value,
        title: recipe.title,
        href: `/recipe-detail/${recipe.slug}`,
        text: recipeCard(recipe),
      });
  }

  for (const article of getArticles()) {
    const value =
      score(article.title, tokens) * 3 +
      score(article.category ?? '', tokens) * 2 +
      score(article.excerpt ?? '', tokens) * 2 +
      score(article.intro ?? '', tokens);
    if (value > 0)
      candidates.push({
        score: value,
        title: article.title,
        href: `/article-detail/${article.slug}`,
        text: articleCard(article),
      });
  }

  for (const plan of getMealPlans()) {
    const value = score(plan.title, tokens) * 3 + score(plan.description ?? '', tokens) * 2;
    if (value > 0)
      candidates.push({ score: value, title: plan.title, href: '/meal-prep', text: mealPlanCard(plan) });
  }

  return candidates.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** Compact index used when retrieval finds nothing relevant. */
export function contentIndex() {
  const recipes = getRecipes().map((r) => `- ${r.title} (${r.category}) → /recipe-detail/${r.slug}`);
  const articles = getArticles().map((a) => `- ${a.title} (${a.category}) → /article-detail/${a.slug}`);
  return `Công thức:\n${recipes.join('\n')}\n\nBài viết:\n${articles.join('\n')}`;
}

/** Featured picks so the widget always has something to link to. */
export function fallbackSources(limit = 3) {
  const recipes = getRecipes();
  const featured = recipes.filter((r) => r.featured);
  return (featured.length ? featured : recipes)
    .slice(0, limit)
    .map((r) => ({ title: r.title, href: `/recipe-detail/${r.slug}` }));
}
