
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TalentCard from "@/components/ui/TalentCard";
import { talents, categories } from "@/data/mockData";
import { Search, Sliders } from "lucide-react";

const TalentDirectoryPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const initialCategory = queryParams.get("category") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [filteredTalents, setFilteredTalents] = useState(talents);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    filterTalents();
  }, [searchTerm, selectedCategory]);

  const filterTalents = () => {
    let results = talents;
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(talent => 
        talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        talent.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      results = results.filter(talent => 
        talent.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    setFilteredTalents(results);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="section-padding bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse All Talents</h1>
        <p className="text-lg text-gray-600">
          Discover and connect with Rwanda's best professionals for your needs
        </p>
      </div>
      
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by name, skills, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          
          <Button
            onClick={toggleFilters}
            variant="outline"
            className="flex items-center gap-2 min-w-[140px]"
          >
            <Sliders className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>
        
        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="font-medium mb-2">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.name)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory.toLowerCase() === category.name.toLowerCase()
                      ? "bg-rwanda-green text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Results Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">{filteredTalents.length} talents found</p>
        </div>
        
        {filteredTalents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTalents.map((talent) => (
              <TalentCard key={talent.id} talent={talent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No talents found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
              }}
              variant="outline"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TalentDirectoryPage;
