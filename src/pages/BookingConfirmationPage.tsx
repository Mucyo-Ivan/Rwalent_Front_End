
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const BookingConfirmationPage = () => {
  const location = useLocation();
  const { talentName, serviceName } = location.state || {};

  return (
    <div className="section-padding flex items-center justify-center min-h-[70vh]">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6 text-rwanda-green">
          <CheckCircle className="h-16 w-16 mx-auto" />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Booking Request Sent!</h1>
        
        <p className="text-gray-600 mb-6">
          {talentName ? (
            <>Your booking request for <span className="font-medium">{talentName}</span> {serviceName && <>(Service: {serviceName})</>} was sent successfully.</>
          ) : (
            <>Your booking request was sent successfully.</>
          )}
        </p>
        
        <div className="mb-4">
          <h2 className="font-medium text-gray-700 mb-2">What happens next?</h2>
          <ul className="text-gray-600 text-left mx-auto max-w-sm space-y-2">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>The talent will review your booking request</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>You'll receive a confirmation email when they accept</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>You may be contacted for additional details or scheduling</span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-3 pt-4">
          <Link to="/">
            <Button className="btn-primary w-full">Back to Home</Button>
          </Link>
          <Link to="/talents">
            <Button variant="outline" className="w-full">
              Browse More Talents
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
