import { Link, useNavigate } from "react-router-dom";
import { Talent as ApiTalent } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Briefcase, CalendarPlus } from "lucide-react";
import EnhancedAvatar from "@/components/ui/EnhancedAvatar";
import TalentRating from "@/components/reviews/TalentRating";

interface TalentCardProps {
  talent: ApiTalent;
}

const TalentCard = ({ talent }: TalentCardProps) => {
  const navigate = useNavigate();

  // We'll use EnhancedAvatar component which handles initials internally

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <div className="w-full h-56 rounded-t-xl overflow-hidden relative">
          {/* We use a responsive container with a background for consistent styling */}
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <EnhancedAvatar 
                user={talent} 
                size="xl" 
                className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-lg" 
                fallbackClassName="bg-rwanda-green text-white text-4xl"
              />
            </div>
            {/* Add a subtle gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        </div>
        {talent.category && (
          <div className="absolute top-3 right-3 bg-rwanda-blue/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center shadow-md">
            <Briefcase className="w-3 h-3 mr-1.5" />
            {talent.category.replace('_', ' ')}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-1 truncate" title={talent.fullName}>{talent.fullName}</h3>
        <div className="flex justify-between items-center mb-2">
          {talent.location && <p className="text-sm text-gray-500">{talent.location}</p>}
          {talent.id && <TalentRating talentId={talent.id} showCount={true} />}
        </div>
        
        {talent.bio && <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">{talent.bio}</p>}
        {!talent.bio && <div className="flex-grow"></div>}

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline"
              className="flex-1 border-rwanda-blue text-rwanda-blue hover:bg-rwanda-blue/10"
              onClick={() => navigate(`/talents/${talent.id}`)}
            >
              <span className="whitespace-nowrap">View Details</span>
            </Button>
            <Button 
              className="flex-1 bg-rwanda-green hover:bg-rwanda-green/90 text-white"
              onClick={() => navigate(`/book/${talent.id}`)}
            >
              <CalendarPlus className="w-4 h-4 mr-2" />
              <span className="whitespace-nowrap">Book Talent</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentCard;
