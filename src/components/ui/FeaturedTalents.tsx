
import { talents } from "@/data/mockData";
import TalentCard from "./TalentCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FeaturedTalents = () => {
  // Get first 3 talents for featured section
  const featuredTalents = talents.slice(0, 3);

  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="mb-12 text-center">
        <span className="inline-block px-4 py-2 bg-green-100 text-rwanda-green rounded-full text-sm font-semibold mb-4">Featured Talents</span>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Rwanda's Top Performers</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover some of Rwanda's most highly-rated professionals ready to bring their skills to your next project or event.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredTalents.map((talent) => (
          <TalentCard key={talent.id} talent={talent} />
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Link to="/talents">
          <Button className="bg-rwanda-green hover:bg-rwanda-green/90 text-white px-8 py-6 text-lg">
            View All Talents
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedTalents;
