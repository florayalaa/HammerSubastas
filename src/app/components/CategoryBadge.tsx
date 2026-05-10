import { UserCategory } from '../types';

interface CategoryBadgeProps {
  category: UserCategory;
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const colors = {
    común: 'bg-gray-100 text-gray-700',
    especial: 'bg-blue-100 text-blue-700',
    plata: 'bg-slate-200 text-slate-700',
    oro: 'bg-amber-100 text-amber-700',
    platino: 'bg-purple-100 text-purple-700',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full ${colors[category]} ${sizes[size]}`}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
  );
}
