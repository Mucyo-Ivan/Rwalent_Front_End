import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  className?: string;
  onSearch: (searchTerm: string) => void;
  isLoading?: boolean;
}

const SearchBar = ({ className = "", onSearch, isLoading = false }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className={`${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search talents, services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-6 rounded-lg w-full"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="py-2 px-4 border rounded-lg bg-white text-gray-700 flex-grow-0 min-w-[180px]"
        >
          <option value="">All Categories</option>
          <option value="music">Music</option>
          <option value="photography">Photography</option>
          <option value="art">Art</option>
          <option value="dance">Dance</option>
          <option value="events">Events</option>
          <option value="makeup">Makeup</option>
          <option value="tutoring">Tutoring</option>
          <option value="dj">DJ</option>
        </select>

        <Button 
          type="submit" 
          className="btn-primary min-w-[120px] py-6"
          disabled={isLoading}
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
