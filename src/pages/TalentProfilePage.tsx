
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, MapPin, Star } from "lucide-react";
import { talents } from "@/data/mockData";

const TalentProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const talent = talents.find((t) => t.id === id);
  const [activeTab, setActiveTab] = useState("about");

  if (!talent) {
    return (
      <div className="section-padding text-center">
        <h2 className="text-2xl font-bold mb-4">Talent Not Found</h2>
        <p className="mb-6">Sorry, we couldn't find the talent you're looking for.</p>
        <Link to="/talents">
          <Button>Browse All Talents</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with Profile Info */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="rounded-xl overflow-hidden border-4 border-white shadow-lg">
                <img 
                  src={talent.profileImage} 
                  alt={talent.name} 
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{talent.name}</h1>
                {talent.isVerified && (
                  <span className="verified-badge">
                    <Check className="w-3 h-3 mr-1" />
                    Verified
                  </span>
                )}
              </div>
              
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{talent.location}</span>
                <span className="mx-2">•</span>
                <span>{talent.category}</span>
              </div>
              
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-rwanda-yellow fill-current" />
                  <span className="ml-1 text-sm font-medium">{talent.rating}</span>
                </div>
                <span className="mx-2 text-gray-500">•</span>
                <span className="text-sm text-gray-500">{talent.reviewCount} reviews</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={`/booking/${talent.id}`} className="w-full sm:w-auto">
                  <Button className="btn-primary w-full sm:w-auto">Book This Talent</Button>
                </Link>
                <Button variant="outline" className="w-full sm:w-auto">
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">About {talent.name}</h2>
            <p className="text-gray-700 whitespace-pre-line">{talent.bio}</p>
            <p className="mt-4 text-gray-700">
              With years of experience in the {talent.category.toLowerCase()} industry, {talent.name.split(" ")[0]} has established a reputation for excellence and professionalism. 
              Working with clients across Rwanda, {talent.name.split(" ")[0]} brings creativity, skill, and passion to every project.
            </p>
          </TabsContent>
          
          <TabsContent value="services" className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Services & Pricing</h2>
            <div className="space-y-4">
              {talent.services.map((service) => (
                <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <span className="text-rwanda-green font-bold">${service.price}</span>
                  </div>
                  <p className="text-gray-600">{service.description}</p>
                  <div className="mt-4">
                    <Link to={`/booking/${talent.id}`}>
                      <Button size="sm" className="btn-primary">Book Now</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Client Reviews</h2>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-rwanda-yellow fill-current" />
                <span className="ml-1 font-bold">{talent.rating}</span>
                <span className="ml-2 text-gray-500">({talent.reviewCount} reviews)</span>
              </div>
            </div>
            
            {talent.reviews.length > 0 ? (
              <div className="space-y-6">
                {talent.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{review.userName}</h3>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? "text-rwanda-yellow fill-current" : "text-gray-300"}`} 
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No reviews yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TalentProfilePage;
