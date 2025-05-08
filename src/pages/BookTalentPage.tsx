import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { talent as talentApiFunctions, booking as bookingApiFunctions, Profile as TalentProfile, BookingRequestPayload } from "@/lib/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CalendarIcon, Briefcase, MapPin, ArrowLeft, Send, Clock, DollarSign, ListChecks, MessageSquare } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";

const BookTalentPage = () => {
  const { talentId } = useParams<{ talentId: string }>();
  const navigate = useNavigate();

  const [talent, setTalent] = useState<TalentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [bookingDate, setBookingDate] = useState<Date | undefined>(undefined);
  const [bookingTime, setBookingTime] = useState<string>("18:30");
  const [eventLocation, setEventLocation] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<string>("180");
  const [agreedPrice, setAgreedPrice] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [eventRequirements, setEventRequirements] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadTalentDetails = async () => {
      if (!talentId) {
        setError("Talent ID is missing from URL.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        console.log("Attempting to fetch talent with ID:", talentId, "using:", talentApiFunctions);
        const fetchedTalent = await talentApiFunctions.getById(talentId);
        setTalent(fetchedTalent);
        setError(null);
      } catch (err: any) {
        console.error("Error in loadTalentDetails:", err);
        setTalent(null);
        let errMsg = "Failed to load talent details.";
        if (err instanceof TypeError) {
            errMsg = `TypeError during talent fetch: ${err.message}. This might be an import issue.`;
        }
        setError(errMsg);
        toast.error("Talent profile could not be loaded.");
      } finally {
        setLoading(false);
      }
    };
    loadTalentDetails();
  }, [talentId]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!talentId || !talent) {
        toast.error("Talent information is missing. Cannot create booking.");
        return;
    }
    if (!bookingDate) {
      toast.error("Please select a booking date.");
      return;
    }
    if (!eventLocation.trim()) {
      toast.error("Please provide the event/service location.");
      return;
    }
    const numDurationMinutes = parseInt(durationMinutes, 10);
    if (isNaN(numDurationMinutes) || numDurationMinutes <= 0) {
      toast.error("Please enter a valid duration in minutes (e.g., 120 for 2 hours).");
      return;
    }
    if (!notes.trim()) {
      toast.error("Please provide notes or project details.");
      return;
    }

    const [hours, minutes] = bookingTime.split(':').map(Number);
    const combinedBookingDateTime = new Date(bookingDate);
    combinedBookingDateTime.setHours(hours, minutes, 0, 0);

    if (!isValid(combinedBookingDateTime)) {
        toast.error("Invalid date or time selected.");
        return;
    }

    const payload: BookingRequestPayload = {
      bookingDate: combinedBookingDateTime.toISOString(), 
      durationMinutes: numDurationMinutes,
      notes: notes,
      eventLocation: eventLocation,
      agreedPrice: agreedPrice ? parseFloat(agreedPrice) : null,
      eventRequirements: eventRequirements.trim() || null,
    };

    setIsSubmitting(true);
    try {
      console.log(`Submitting booking request for talent ID ${talent.id} with payload:`, payload);
      const response = await bookingApiFunctions.createBookingRequest(talent.id, payload);
      toast.success(`Booking request (ID: ${response.id}) for ${talent.fullName} sent successfully! Status: ${response.status}`);
      setTimeout(() => {
        setBookingDate(undefined);
        setBookingTime("18:30");
        setEventLocation("");
        setDurationMinutes("180");
        setAgreedPrice("");
        setNotes("");
        setEventRequirements("");
      }, 2000); 
    } catch (err: any) {
      console.error("Booking submission error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to send booking request. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getInitials = (name: string | undefined | null): string => {
    if (!name) return "N/A";
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center p-4 text-lg text-gray-600">Loading talent information...</div>;
  }

  if (error || !talent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-2xl font-semibold text-red-500 mb-4">Error</p>
        <p className="text-lg text-gray-700 mb-6 text-center px-4">{error || "Talent could not be found or loaded."}</p>
        <Button onClick={() => navigate("/")} variant="outline" className="text-rwanda-blue hover:bg-rwanda-blue/10">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go to Homepage
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-rwanda-blue hover:text-rwanda-blue/80 hover:bg-rwanda-blue/5 px-3 py-2 rounded-md">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-rwanda-green to-rwanda-blue p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
              <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-white shadow-md">
                <AvatarImage src={talent.photoUrl || undefined} alt={talent.fullName || "Talent"} />
                <AvatarFallback className="text-3xl bg-white/20 text-white">
                    {getInitials(talent.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold tracking-tight">{talent.fullName}</h1>
                {talent.category && 
                  <p className="text-md text-white/90 flex items-center justify-center sm:justify-start mt-1">
                    <Briefcase className="mr-2 h-5 w-5 opacity-80"/>{String(talent.category).replace('_', ' ')}
                  </p>}
                {talent.location && 
                  <p className="text-sm text-white/80 flex items-center justify-center sm:justify-start mt-1">
                    <MapPin className="mr-2 h-4 w-4 opacity-80"/>{talent.location} (Talent's base)
                  </p>}
              </div>
            </div>
          </div>

          <form onSubmit={handleBookingSubmit} className="p-6 sm:p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Request a Booking with {talent.fullName || "this Talent"}
            </h2>
            <p className="text-sm text-gray-500 -mt-4 mb-6">Please provide all necessary details for your booking request with {talent.fullName}.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label htmlFor="bookingDate" className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                  <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />Preferred Date *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="bookingDate"
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${!bookingDate && "text-muted-foreground"}`}
                    >
                      {bookingDate ? format(bookingDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={bookingDate}
                      onSelect={setBookingDate}
                      initialFocus
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="bookingTime" className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                  <Clock className="mr-2 h-4 w-4 text-gray-400" />Preferred Time *
                </Label>
                <Input 
                    id="bookingTime"
                    type="time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    required
                />
              </div>
            </div>

            <div>
                <Label htmlFor="durationMinutes" className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                  <Clock className="mr-2 h-4 w-4 text-gray-400" />Duration (in minutes) *
                </Label>
                <Input
                  id="durationMinutes"
                  name="durationMinutes"
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  placeholder="e.g., 120 for 2 hours"
                  required
                />
            </div>

            <div>
              <Label htmlFor="eventLocation" className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <MapPin className="mr-2 h-4 w-4 text-gray-400" />Event/Service Location *
              </Label>
              <Input
                id="eventLocation"
                name="eventLocation"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="Street address, City, Venue name"
                required
              />
            </div>

            <div>
              <Label htmlFor="agreedPrice" className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <DollarSign className="mr-2 h-4 w-4 text-gray-400" />Proposed Price/Budget (Optional)
              </Label>
              <Input
                id="agreedPrice"
                name="agreedPrice"
                type="number"
                step="0.01"
                value={agreedPrice}
                onChange={(e) => setAgreedPrice(e.target.value)}
                placeholder="e.g., 450.00"
              />
            </div>
            
            <div>
              <Label htmlFor="notes" className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <MessageSquare className="mr-2 h-4 w-4 text-gray-400" />Notes / Project Details *
              </Label>
              <Textarea
                id="notes"
                name="notes"
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={`Describe your event, project, or specific needs for ${talent.fullName}...`}
                className="min-h-[100px] resize-y"
                required
              />
            </div>

            <div>
              <Label htmlFor="eventRequirements" className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                <ListChecks className="mr-2 h-4 w-4 text-gray-400" />Event Requirements (Optional)
              </Label>
              <Textarea
                id="eventRequirements"
                name="eventRequirements"
                rows={3}
                value={eventRequirements}
                onChange={(e) => setEventRequirements(e.target.value)}
                placeholder="e.g., PA system, Special lighting, Backstage area..."
                className="min-h-[80px] resize-y"
              />
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-rwanda-green hover:bg-rwanda-green/90 text-white py-3 text-base flex items-center justify-center" 
                disabled={isSubmitting || !bookingDate || !eventLocation.trim() || !durationMinutes.trim() || parseInt(durationMinutes,10) <= 0 || !notes.trim() || !talentId || !talent }
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Booking Request
                  </>
                )}
              </Button>
            </div>
             <p className="text-xs text-gray-500 text-center">
                The talent will receive your request and will respond to you regarding availability and further details.
             </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookTalentPage; 