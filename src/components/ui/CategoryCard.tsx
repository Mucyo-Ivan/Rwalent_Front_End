import { Button } from "@/components/ui/button";

export interface Category {
  id: number;
  name: string;
  icon: string;
  description: string;
}

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  return (
    <Button
      variant="outline"
      className="flex flex-col items-center justify-center p-6 h-full w-full hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <span className="text-4xl mb-3">{category.icon}</span>
      <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
      <p className="text-sm text-gray-600 text-center">{category.description}</p>
    </Button>
  );
};

export default CategoryCard;
