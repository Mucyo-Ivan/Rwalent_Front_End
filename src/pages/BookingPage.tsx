
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BookingForm from "@/components/ui/BookingForm";
import { talents } from "@/data/mockData";

const BookingPage = () => {
  const { id } = useParams<{ id: string }>();
  const talent = talents.find((t) => t.id === id);
  
  if (!talent) {
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
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book {talent.name}</h1>
          <p className="text-gray-600">
            Fill out the form below to request a booking. The talent will respond to confirm availability and details.
          </p>
        </div>
        
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm mb-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <img 
              src={talent.profileImage} 
              alt={talent.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="font-bold text-xl">{talent.name}</h2>
              <p className="text-gray-600">{talent.category} • {talent.location}</p>
            </div>
          </div>
          
          <BookingForm 
            talentId={talent.id} 
            talentName={talent.name}
            services={talent.services}
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
