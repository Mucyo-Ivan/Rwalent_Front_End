
import { useParams, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BookingForm from "@/components/ui/BookingForm";
import { talents } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Music, Camera, Award, Star, User } from "lucide-react";
import { useState, useEffect } from "react";
import { talent } from "@/lib/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [talentData, setTalentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Try to get talent info from location state first, then fetch it if needed
  useEffect(() => {
    const fetchTalent = async () => {
      setLoading(true);
      try {
        // Check if we have talent data in location state
        if (location.state?.talentData) {
          setTalentData(location.state.talentData);
        } else {
          // Otherwise fetch it from API
          const data = await talent.getTalentById(id as string);
          if (data) {
            setTalentData(data);
          } else {
            // If API returns empty/null data, use mock data
            const mockTalent = talents.find((t) => t.id === id);
            if (!mockTalent) {
              throw new Error("Talent not found");
            }
            setTalentData(mockTalent);
          }
        }
      } catch (error) {
        // Fallback to mock data if API fails
        const mockTalent = talents.find((t) => t.id === id);
        if (mockTalent) {
          setTalentData(mockTalent);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchTalent();
  }, [id, location.state]);
  
  if (loading) {
    return (
      <div className="section-padding text-center">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded mx-auto mb-6"></div>
          <div className="h-10 w-32 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }
  
  if (!talentData) {
    return (
      <div className="section-padding text-center">
        <h2 className="text-2xl font-bold mb-4">Talent Not Found</h2>
        <p className="mb-6">Sorry, we couldn't find the talent you're trying to book.</p>
        <Link to="/talents">
          <Button>Browse All Talents</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="section-padding bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 text-rwanda-green">Book {talentData.fullName || talentData.name}</h1>
          <p className="text-gray-600 text-lg">
            Fill out the form below to request a booking. {talentData.fullName || talentData.name} will respond to confirm availability and details.
          </p>
        </div>
        
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-md mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 pb-8 border-b">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shadow-md border-2 border-rwanda-green/20">
              <Avatar className="w-full h-full rounded-none">
                <AvatarImage 
                  src={talentData.photoUrl || talentData.profilePicture || ''} 
                  alt={talentData.fullName}
                  className="w-full h-full object-cover"
                />
                <AvatarFallback className="w-full h-full bg-rwanda-green/10 text-rwanda-green flex items-center justify-center text-3xl font-bold">
                  {talentData.fullName ? talentData.fullName.charAt(0) : <User className="h-12 w-12" />}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-2xl">{talentData.fullName || talentData.name}</h2>
                {talentData.isVerified && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                    <Award className="h-3.5 w-3.5" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600">
                <div className="flex items-center gap-1">
                  {talentData.category === "MUSIC" || talentData.category === "Music" ? <Music className="h-4 w-4" /> :
                   talentData.category === "PHOTOGRAPHY" || talentData.category === "Photography" ? <Camera className="h-4 w-4" /> :
                   <Award className="h-4 w-4" />}
                  <span>{talentData.category}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{talentData.location}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{talentData.rating} ({talentData.reviewCount} reviews)</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2">{talentData.bio}</p>
            </div>
          </div>
          
          <BookingForm 
            talentId={talentData.id} 
            talentName={talentData.name}
            services={talentData.services}
          />
        </div>
        
        <div className="text-center text-sm text-gray-600">
          <p>By submitting a booking request, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
