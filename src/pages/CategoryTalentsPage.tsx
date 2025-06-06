import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { talent, Talent } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const CategoryTalentsPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [talents, setTalents] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTalents = async () => {
      if (!category) return;
      
      setLoading(true);
      setError("");
      
      try {
        const response = await talent.getByCategory(category);
        console.log('API Response:', response); // Debug log
        
        if (!response || !response.content) {
          throw new Error('Invalid response format');
        }

        if (response.empty) {
          setError(`No talents found in the ${category} category.`);
        } else {
          setTalents(response.content);
        }
      } catch (error) {
        console.error(`Error loading ${category} talents:`, error);
        setError(`Failed to load ${category} talents. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchTalents();
  }, [category]);

  if (!category) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Category not specified</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 capitalize">
          {category.replace(/_/g, ' ')} Talents
        </h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rwanda-green"></div>
        </div>
      ) : talents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talents.map((talent) => (
            <div
              key={talent.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col justify-between"
            >
              <div>
              <div className="flex items-center mb-4">
                  <Avatar className="h-16 w-16 text-xl">
                    <AvatarImage src={talent.photoUrl || undefined} alt={talent.fullName} />
                    <AvatarFallback className="bg-rwanda-green text-white">
                      {talent.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || talent.fullName?.charAt(0) || 'T'}
                    </AvatarFallback>
                  </Avatar>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold">{talent.fullName}</h3>
                    <p className="text-gray-600 text-sm">{talent.location || "Location not specified"}</p>
                </div>
              </div>
              
                <p className="text-gray-700 mb-3 text-sm">{talent.bio || "No bio available."}</p>
              
                <div className="space-y-1 text-xs mb-3">
                  {talent.serviceAndPricing && (
                    <p className="text-gray-600">
                  <span className="font-medium">Services:</span> {talent.serviceAndPricing}
                </p>
                  )}
                  {talent.phoneNumber && (
                    <p className="text-gray-600">
                  <span className="font-medium">Contact:</span> {talent.phoneNumber}
                </p>
                  )}
                  {talent.email && (
                  <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {talent.email}
                </p>
                  )}
                </div>
              </div>
              <Button 
                onClick={() => navigate(`/book/${talent.id}`)}
                className="w-full mt-auto bg-rwanda-green hover:bg-rwanda-green/90 text-white"
              >
                Book Talent
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No talents found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryTalentsPage; 