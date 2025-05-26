import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TalentCard from "@/components/ui/TalentCard";
import { Search, Sliders, X, Loader2, User } from "lucide-react";
import { auth, talent, Talent } from "@/lib/api";
import { toast } from "sonner";
import { useDebounce } from "../hooks/useDebounce";

// Category definitions with icons
const categories = [
  { id: 1, name: "Musician", icon: "🎵" },
  { id: 2, name: "Actor/Actress", icon: "🎭" },
  { id: 3, name: "Dancer", icon: "💃" },
  { id: 4, name: "Visual Artist", icon: "🎨" },
  { id: 5, name: "Comedian", icon: "🎤" },
  { id: 6, name: "Model", icon: "🧍" },
  { id: 7, name: "Photographer", icon: "📸" },
  { id: 8, name: "Writer", icon: "✍️" },
  { id: 9, name: "Chef", icon: "🧑‍🍳" },
  { id: 10, name: "Other", icon: "🌟" }
];

const TalentDirectoryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const initialCategory = queryParams.get("category") || "";

  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [filteredTalents, setFilteredTalents] = useState<Talent[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Search suggestions state
  const [suggestions, setSuggestions] = useState<Talent[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLDivElement>(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Effect to fetch all talents on initial load
  useEffect(() => {
    const fetchTalents = async () => {
      setIsLoading(true);
      try {
        const response = await talent.getAll();
        setTalents(response.content);
        filterTalents(response.content);
      } catch (error) {
        console.error("Error fetching talents:", error);
        toast.error("Could not load talents. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTalents();
  }, []);

  // Effect to handle search suggestions based on debounced search term
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await auth.search(debouncedSearchTerm);
        setSuggestions(response.content);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchTerm]);

  // Effect to update filtered talents when search or category changes
  useEffect(() => {
    filterTalents(talents);
    
    // Update URL with search params for bookmarking/sharing
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory) params.set("category", selectedCategory);
    navigate({ search: params.toString() }, { replace: true });
  }, [searchTerm, selectedCategory, talents]);

  // Effect to handle clicks outside the search suggestions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filterTalents = (talentList: Talent[]) => {
    let results = talentList;
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(talent => 
        talent.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (talent.bio && talent.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (talent.category && talent.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      results = results.filter(talent => 
        talent.category && talent.category.toLowerCase() === selectedCategory.toLowerCase()
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

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (talent: Talent) => {
    navigate(`/talents/${talent.id}`);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions([]);
    setShowSuggestions(false);
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
          <div className="relative flex-grow" ref={searchInputRef}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by name, skills, or category..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              className="pl-10 pr-10 w-full"
              autoComplete="off"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {isSearching && (
              <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            )}
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-3"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-rwanda-green/10 rounded-full flex items-center justify-center">
                      {suggestion.photoUrl ? (
                        <img
                          src={suggestion.photoUrl}
                          alt={suggestion.fullName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4 text-rwanda-green" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{suggestion.fullName}</div>
                      <div className="text-xs text-gray-500">{suggestion.category || 'Talent'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
          <p className="text-gray-600">{isLoading ? 'Loading talents...' : `${filteredTalents.length} talents found`}</p>
        </div>
        
        {isLoading ? (
          // Loading Skeletons
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTalents.length > 0 ? (
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
