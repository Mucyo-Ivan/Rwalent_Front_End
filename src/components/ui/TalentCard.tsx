import { Link, useNavigate } from "react-router-dom";
import { Talent as ApiTalent } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Star, Award, Briefcase, CalendarPlus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TalentCardProps {
  talent: ApiTalent;
}

const TalentCard = ({ talent }: TalentCardProps) => {
  const navigate = useNavigate();

  const getInitials = (name: string | undefined) => {
    if (!name) return "T";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <Avatar className="w-full h-56 rounded-t-xl object-cover">
          <AvatarImage src={talent.photoUrl} alt={talent.fullName} className="object-cover w-full h-full" />
          <AvatarFallback className="w-full h-full rounded-t-xl bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
            {getInitials(talent.fullName)}
          </AvatarFallback>
        </Avatar>
        {talent.category && (
          <div className="absolute top-3 right-3 bg-rwanda-blue/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center shadow-md">
            <Briefcase className="w-3 h-3 mr-1.5" />
            {talent.category.replace('_', ' ')}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-1 truncate" title={talent.fullName}>{talent.fullName}</h3>
        {talent.location && <p className="text-sm text-gray-500 mb-3">{talent.location}</p>}
        
        {talent.bio && <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">{talent.bio}</p>}
        {!talent.bio && <div className="flex-grow"></div>}

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline"
              className="flex-1 border-rwanda-blue text-rwanda-blue hover:bg-rwanda-blue/10"
              onClick={() => navigate(`/talents/${talent.id}`)}
            >
              View Profile
            </Button>
            <Button 
              className="flex-1 bg-rwanda-green hover:bg-rwanda-green/90 text-white"
              onClick={() => navigate(`/book/${talent.id}`)}
            >
              <CalendarPlus className="w-4 h-4 mr-2" />
              Book Talent
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentCard;
