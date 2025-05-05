
import { Link } from "react-router-dom";
import { Talent } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Star, Award } from "lucide-react";

interface TalentCardProps {
  talent: Talent;
}

const TalentCard = ({ talent }: TalentCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 w-full">
      <div className="relative">
        <img 
          src={talent.profileImage} 
          alt={talent.name} 
          className="h-64 w-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://placehold.co/400x400?text=Image+Not+Found";
          }}
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
          {talent.category}
        </div>
        {talent.isVerified && (
          <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm">
            <Award className="w-3 h-3 mr-1" />
            Verified
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{talent.name}</h3>
          <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-700">{talent.rating}</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
          </svg>
          <span>{talent.location}</span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-sm text-gray-500">{talent.reviewCount} reviews</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{talent.bio}</p>
        <div className="border-t border-gray-100 pt-4 mt-2">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-rwanda-green font-semibold">
                From ${Math.min(...talent.services.map(s => s.price))}
              </span>
              <span className="text-xs text-gray-500 block">per service</span>
            </div>
            <Link to={`/talents/${talent.id}`}>
              <Button className="bg-rwanda-green hover:bg-rwanda-green/90 text-white">View Profile</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentCard;
