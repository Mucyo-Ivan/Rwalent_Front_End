import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/ui/SearchBar";
import CategoryCard from "@/components/ui/CategoryCard";
import FeaturedTalents from "@/components/ui/FeaturedTalents";
import { auth, talent, Talent, SearchResponse } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Category {
  id: number;
  name: string;
  icon: string;
  description: string;
}

const categories: Category[] = [
  { id: 1, name: "DANCER", icon: "💃", description: "Professional dancers and performers" },
  { id: 2, name: "MUSICIAN", icon: "🎵", description: "Musicians and music teachers" },
  { id: 3, name: "PHOTOGRAPHER", icon: "📸", description: "Photography professionals" },
  { id: 4, name: "VIDEOGRAPHER", icon: "🎥", description: "Video production experts" },
  { id: 5, name: "EVENT_PLANNER", icon: "🎉", description: "Event planning specialists" },
  { id: 6, name: "MAKEUP_ARTIST", icon: "💄", description: "Makeup and beauty artists" },
  { id: 7, name: "DESIGNER", icon: "🎨", description: "Graphic and fashion designers" },
  { id: 8, name: "COACH", icon: "🏆", description: "Sports and fitness coaches" }
];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<Talent[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [categoryTalents, setCategoryTalents] = useState<Record<string, Talent[]>>({});
  const [loadingCategories, setLoadingCategories] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  // Fetch initial talents for each category
  // useEffect(() => {
  //   const fetchInitialTalents = async () => {
  //     try {
  //       // Fetch all talents first
  //       const response: SearchResponse = await talent.getAll();

  //       console.log('response', response)
        
  //       // Group talents by category
  //       const talentsByCategory: Record<string, Talent[]> = {};
  //       response.content.forEach(talent => {
  //         if (!talentsByCategory[talent.category]) {
  //           talentsByCategory[talent.category] = [];
  //         }
  //         talentsByCategory[talent.category].push(talent);
  //       });

  //       setCategoryTalents(talentsByCategory);
  //     } catch (err) {
  //       console.error("Error fetching talents:", err);
  //       setError("Failed to load talents. Please try again later.");
  //     }
  //   };

  //   fetchInitialTalents();
  // }, []);

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setSearchError("");
      return;
    }

    setIsSearching(true);
    setSearchError("");

    try {
      const response: SearchResponse = await auth.search(searchTerm);
      setSearchResults(response.content);
      if (response.empty) {
        setSearchError("No talents found matching your search.");
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("An error occurred while searching. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/category/${category}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-rwanda-green/90 to-rwanda-blue/90 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center lg:text-left lg:w-1/2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in">
              Discover Rwanda's Best Local Talents
            </h1>
            <p className="text-xl mb-8 text-white/90 max-w-xl mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Connect with top skilled professionals for your events, projects, and creative needs across Rwanda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Link to="/talents">
                <Button className="btn-accent text-lg py-6 px-8">Browse All Talents</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-rwanda-green text-lg py-6 px-8">
                  Become a Talent
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Abstract shapes background */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -right-10 -top-10 w-72 h-72 bg-white rounded-full"></div>
          <div className="absolute -left-20 bottom-10 w-96 h-96 bg-white rounded-full"></div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Find the perfect talent for your needs</h2>
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
          
          {/* Search Results */}
          {searchError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{searchError}</AlertDescription>
            </Alert>
          )}
          
          {searchResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Search Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((talent) => (
                  <div key={talent.id} className="bg-gray-50 p-6 rounded-lg shadow border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 rounded-full bg-rwanda-green text-white flex items-center justify-center font-bold text-xl">
                        {talent.fullName.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">{talent.fullName}</h4>
                        <p className="text-sm text-gray-600">{talent.category}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{talent.bio}</p>
                    <p className="text-sm text-gray-500">{talent.location}</p>
                    <p className="text-sm font-medium text-rwanda-green mt-2">{talent.serviceAndPricing}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore by Category</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse talented professionals by category and find exactly what you need.
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <div key={category.id}>
              <CategoryCard 
                category={category} 
                onClick={() => handleCategoryClick(category.name)}
              />
              {loadingCategories[category.name] && (
                <div className="text-center mt-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rwanda-green mx-auto"></div>
                </div>
              )}
              {categoryTalents[category.name] && (
                <div className="mt-4 grid grid-cols-1 gap-4">
                  {categoryTalents[category.name].map((talent) => (
                    <div key={talent.id} className="bg-gray-50 p-4 rounded-lg shadow border border-gray-100">
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 rounded-full bg-rwanda-green text-white flex items-center justify-center font-bold text-sm">
                          {talent.fullName.charAt(0)}
                        </div>
                        <div className="ml-2">
                          <h4 className="font-medium text-sm">{talent.fullName}</h4>
                          <p className="text-xs text-gray-600">{talent.location}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{talent.serviceAndPricing}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Talents */}
      <FeaturedTalents />

      {/* Call To Action */}
      <section className="bg-rwanda-blue/90 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to showcase your talent?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join RwandaTalent and connect with clients looking for your skills and services.
          </p>
          <Link to="/register">
            <Button className="btn-accent text-lg py-6 px-10">Register as a Talent</Button>
          </Link>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="section-padding bg-white">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-rwanda-yellow text-white flex items-center justify-center font-bold text-xl">
                PM
              </div>
              <div className="ml-4">
                <h4 className="font-medium">Patricia Mugisha</h4>
                <div className="flex text-rwanda-yellow">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              "I found an amazing photographer for my wedding through RwandaTalent. The booking process was smooth and the quality of work exceeded my expectations!"
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-rwanda-green text-white flex items-center justify-center font-bold text-xl">
                EN
              </div>
              <div className="ml-4">
                <h4 className="font-medium">Eric Niyonkuru</h4>
                <div className="flex text-rwanda-yellow">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              "As a DJ, joining RwandaTalent has helped me connect with clients I wouldn't have found otherwise. My bookings have increased significantly!"
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-rwanda-blue text-white flex items-center justify-center font-bold text-xl">
                JK
              </div>
              <div className="ml-4">
                <h4 className="font-medium">Jacqueline Kamikazi</h4>
                <div className="flex text-rwanda-yellow">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              "Our company regularly books event coordinators through RwandaTalent. The platform makes it easy to find qualified professionals quickly and reliably."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
