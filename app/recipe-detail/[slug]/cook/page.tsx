import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CookModePage } from '../../../components/cook';
import { findBySlug, getRecipes } from '../../../../lib/content';
import { getCookLesson, getCookLessons } from '../../../../lib/cook';

export const dynamicParams = false;

export function generateStaticParams() {
  return getCookLessons().map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const recipe = findBySlug(getRecipes(), (await params).slug);
  if (!recipe) return {};
  return {
    title: `Chế độ nấu · ${recipe.title}`,
    description: `Dẫn từng bước nấu ${recipe.title} với hình minh họa, hẹn giờ và nhiệt độ gợi ý.`,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getCookLesson(slug);
  const recipe = findBySlug(getRecipes(), slug);
  if (!lesson || !recipe) notFound();
  return <CookModePage lesson={lesson} recipeTitle={recipe.title} />;
}
