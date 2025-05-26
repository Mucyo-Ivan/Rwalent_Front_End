import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/ui/SearchBar";
import CategoryCard from "@/components/ui/CategoryCard";
import { auth, talent, Talent, SearchResponse } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Calendar, User, MessageSquare, Settings, Star } from "lucide-react";
import EnhancedAvatar from "@/components/ui/EnhancedAvatar";
import { reviews as reviewsApi, Review } from '@/lib/reviews-api';
import ReviewsSection from '@/components/reviews/HomeReviewsSection';

interface Category {
  id: number;
  name: string;
  icon: string;
  description: string;
}

// Updated categories list
const categories: Category[] = [
  { id: 1, name: "Musician", icon: "🎵", description: "Find talented musicians" },
  { id: 2, name: "Actor/Actress", icon: "🎭", description: "Discover actors and actresses" },
  { id: 3, name: "Dancer", icon: "💃", description: "Explore skilled dancers" },
  { id: 4, name: "Visual Artist", icon: "🎨", description: "Connect with visual artists" },
  { id: 5, name: "Comedian", icon: "🎤", description: "Hire hilarious comedians" },
  { id: 6, name: "Model", icon: "🧍", description: "Book professional models" },
  { id: 7, name: "Photographer", icon: "📸", description: "Find skilled photographers" },
  { id: 8, name: "Writer", icon: "✍️", description: "Collaborate with writers" },
  { id: 9, name: "Chef", icon: "🧑‍🍳", description: "Engage culinary experts" },
  { id: 10, name: "Other", icon: "🌟", description: "Explore various other talents" }
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
      {/* Hero Section - Enhanced with Dynamic Visuals and Functional Buttons */}
      <section className="relative overflow-hidden bg-gradient-to-r from-rwanda-green to-rwanda-blue text-white">
        {/* Decorative wave divider at top */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12 sm:h-16" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="rgba(255, 255, 255, 0.1)"></path>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-3xl mx-auto text-center z-10 animate-fade-in-up">
              {/* Highlight Badge */}
              <div className="inline-block rounded-full bg-rwanda-blue/30 px-4 py-1.5 mb-6 text-sm font-medium text-white backdrop-blur-sm">
                <span className="mr-2">🇷🇼</span> Rwanda's Premier Talent Platform
              </div>
              
              {/* Main Headline with Multi-line Styling */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
                <span className="block">Discover Rwanda's</span>
                <span className="block text-white">Best Local Talents</span>
              </h1>
              
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                From traditional <span className="font-bold">drummers</span> and <span className="font-bold">musicians</span> to professional <span className="font-bold">photographers</span> and <span className="font-bold">event planners</span>. Book verified talents for your events, projects, and creative needs across Rwanda.
              </p>
              
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 mb-8 backdrop-blur-sm bg-white/5 p-4 rounded-xl max-w-2xl mx-auto">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">500+</p>
                  <p className="text-sm text-white/80">Active Talents</p>
                </div>
                <div className="text-center border-x border-white/10">
                  <p className="text-2xl font-bold text-white">24/7</p>
                  <p className="text-sm text-white/80">Support</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">100%</p>
                  <p className="text-sm text-white/80">Satisfaction</p>
                </div>
              </div>
              
              {/* CTA Buttons - Functional Links */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/talents" className="w-full sm:w-auto">
                  <Button className="w-full bg-white text-rwanda-green hover:bg-white/90 text-lg py-6 px-8 font-medium shadow-lg shadow-black/5 group transition-all duration-300">
                    Browse All Talents
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 ml-2">→</span>
                  </Button>
                </Link>
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full backdrop-blur-sm bg-white/10 border-2 border-white text-white hover:bg-white/20 text-lg py-6 px-8 transition-all duration-300">
                    Become a Talent
                  </Button>
                </Link>
              </div>
              
              {/* Trust Badge */}
              <div className="mt-6 text-sm text-white/70 flex items-center justify-center">
                <Star className="h-4 w-4 mr-2 text-white" />
                Trusted by leading event organizers across Rwanda
              </div>
          </div>
        </div>
        
        {/* Enhanced decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-40 -top-40 w-96 h-96 bg-yellow-400/30 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute right-1/4 top-1/3 w-72 h-72 bg-white rounded-full blur-3xl opacity-10"></div>
          <div className="absolute -left-20 bottom-10 w-96 h-96 bg-white rounded-full blur-3xl opacity-10"></div>
          <div className="absolute left-1/3 -bottom-20 w-72 h-72 bg-yellow-400/30 rounded-full blur-3xl opacity-20"></div>
        </div>
        
        {/* Decorative wave divider at bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-12 sm:h-16" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#ffffff" fillOpacity="0.05"></path>
          </svg>
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
                  <div key={talent.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col">
                    <div className="p-5">
                    <div className="flex items-center mb-4">
                        <EnhancedAvatar
                          user={talent}
                          size="md"
                          className="h-12 w-12"
                          fallbackClassName="bg-rwanda-green text-white"
                        />
                        <div className="ml-4">
                          <h4 className="font-semibold text-lg text-gray-800">{talent.fullName}</h4>
                          <p className="text-sm text-rwanda-blue">{talent.category ? talent.category.replace('_', ' ') : 'Talent'}</p>
                        </div>
                      </div>
                      {talent.bio && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{talent.bio}</p>}
                      {talent.location && <p className="text-xs text-gray-500 mb-1"><span className="font-medium">Location:</span> {talent.location}</p>}
                      {talent.serviceAndPricing && <p className="text-xs text-gray-500"><span className="font-medium">Services:</span> {talent.serviceAndPricing.substring(0,50)}...</p>}
                      </div>
                    <div className="mt-auto p-4 bg-gray-50 border-t border-gray-200">
                       <Button 
                        className="w-full bg-rwanda-green hover:bg-rwanda-green/90"
                        onClick={() => navigate(`/book/${talent.id}`)}
                       >
                         Book Talent
                       </Button>
                    </div>
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
                  {categoryTalents[category.name].slice(0, 3).map((talent) => (
                    <div key={talent.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
                      <div className="p-3">
                      <div className="flex items-center mb-2">
                          <EnhancedAvatar
                            user={talent}
                            size="sm"
                            className="h-10 w-10"
                            fallbackClassName="bg-rwanda-blue text-white text-xs"
                          />
                          <div className="ml-3">
                            <h4 className="font-medium text-sm text-gray-800">{talent.fullName}</h4>
                            <p className="text-xs text-gray-500">{talent.location || "Rwanda"}</p>
                          </div>
                        </div>
                        {/* <p className="text-xs text-gray-600 line-clamp-2 mb-2">{talent.bio || "No bio available."}</p> */}
                        </div>
                      <div className="mt-auto p-2 bg-gray-50 border-t border-gray-100">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="w-full border-rwanda-green text-rwanda-green hover:bg-rwanda-green/10 hover:text-rwanda-green"
                          onClick={() => navigate(`/book/${talent.id}`)}
                        >
                          Book
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

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

      {/* Testimonial Section with Dynamic Reviews */}
      <section className="section-padding bg-white">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-gray-600">Real feedback from our community</p>
        </div>
        
        <ReviewsSection />
      </section>
    </div>
  );
};

export default HomePage;
