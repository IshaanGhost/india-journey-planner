
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Calendar, Share, ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const Itinerary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(true);
  const [itinerary, setItinerary] = useState(null);
  
  const formData = location.state;

  // Mock itinerary data based on city selection
  const generateItinerary = (city, duration, interests) => {
    const attractions = {
      "Delhi": [
        { name: "Red Fort", description: "Historic Mughal fortress", time: "2-3 hours", hours: "9:30 AM - 4:30 PM", category: "Heritage & Culture" },
        { name: "India Gate", description: "War memorial and iconic landmark", time: "1 hour", hours: "24 hours", category: "Heritage & Culture" },
        { name: "Lotus Temple", description: "Baháʼí House of Worship", time: "1-2 hours", hours: "9:00 AM - 5:30 PM", category: "Spiritual & Religious" },
        { name: "Chandni Chowk", description: "Historic market area", time: "2-3 hours", hours: "10:00 AM - 8:00 PM", category: "Food & Cuisine" },
        { name: "Humayun's Tomb", description: "Mughal architecture masterpiece", time: "1-2 hours", hours: "6:00 AM - 6:00 PM", category: "Heritage & Culture" },
        { name: "Akshardham Temple", description: "Modern Hindu temple complex", time: "2-3 hours", hours: "9:30 AM - 6:30 PM", category: "Spiritual & Religious" }
      ],
      "Jaipur": [
        { name: "Amber Palace", description: "Magnificent fort palace", time: "2-3 hours", hours: "8:00 AM - 5:30 PM", category: "Heritage & Culture" },
        { name: "City Palace", description: "Royal residence complex", time: "2-3 hours", hours: "9:30 AM - 5:00 PM", category: "Heritage & Culture" },
        { name: "Hawa Mahal", description: "Palace of Winds", time: "1 hour", hours: "9:00 AM - 4:30 PM", category: "Heritage & Culture" },
        { name: "Jantar Mantar", description: "Astronomical observatory", time: "1-2 hours", hours: "9:00 AM - 4:30 PM", category: "Heritage & Culture" },
        { name: "Nahargarh Fort", description: "Hill fort with city views", time: "2-3 hours", hours: "10:00 AM - 5:30 PM", category: "Heritage & Culture" },
        { name: "Johari Bazaar", description: "Traditional jewelry market", time: "1-2 hours", hours: "11:00 AM - 8:00 PM", category: "Shopping" }
      ],
      "Kerala (Kochi)": [
        { name: "Chinese Fishing Nets", description: "Historic fishing technique", time: "1 hour", hours: "24 hours", category: "Heritage & Culture" },
        { name: "Mattancherry Palace", description: "Dutch Palace with murals", time: "1-2 hours", hours: "10:00 AM - 5:00 PM", category: "Heritage & Culture" },
        { name: "St. Francis Church", description: "Oldest European church in India", time: "30 minutes", hours: "9:00 AM - 5:30 PM", category: "Heritage & Culture" },
        { name: "Backwater Cruise", description: "Traditional houseboat experience", time: "4-6 hours", hours: "6:00 AM - 6:00 PM", category: "Nature & Wildlife" },
        { name: "Spice Market", description: "Aromatic spice trading center", time: "1-2 hours", hours: "9:00 AM - 7:00 PM", category: "Food & Cuisine" },
        { name: "Kathakali Performance", description: "Traditional dance drama", time: "1.5 hours", hours: "6:30 PM - 8:00 PM", category: "Art & Crafts" }
      ]
    };

    const cityAttractions = attractions[city] || attractions["Delhi"];
    const filteredAttractions = cityAttractions.filter(attraction => 
      interests.some(interest => attraction.category === interest)
    );

    const selectedAttractions = filteredAttractions.length > 0 ? filteredAttractions : cityAttractions.slice(0, 6);
    
    const days = [];
    const attractionsPerDay = Math.ceil(selectedAttractions.length / parseInt(duration));
    
    for (let day = 1; day <= parseInt(duration); day++) {
      const startIndex = (day - 1) * attractionsPerDay;
      const endIndex = Math.min(startIndex + attractionsPerDay, selectedAttractions.length);
      const dayAttractions = selectedAttractions.slice(startIndex, endIndex);
      
      days.push({
        day,
        attractions: dayAttractions,
        totalTime: dayAttractions.reduce((total, attraction) => {
          const time = parseInt(attraction.time.split('-')[0]) || 1;
          return total + time;
        }, 0)
      });
    }

    return days;
  };

  useEffect(() => {
    if (!formData) {
      navigate('/plan');
      return;
    }

    // Simulate API call delay
    setTimeout(() => {
      const generatedItinerary = generateItinerary(formData.city, formData.duration, formData.interests);
      setItinerary(generatedItinerary);
      setIsGenerating(false);
      toast({
        title: "Itinerary Generated!",
        description: `Your ${formData.duration}-day trip to ${formData.city} is ready.`,
      });
    }, 2000);
  }, [formData, navigate]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `My ${formData.city} Travel Itinerary`,
        text: `Check out my ${formData.duration}-day itinerary for ${formData.city}!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Itinerary link copied to clipboard.",
      });
    }
  };

  if (!formData) {
    return null;
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Your Itinerary</h2>
          <p className="text-gray-600">Creating the perfect plan for your {formData.city} adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <MapPin className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
              YatraPlanner
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={() => navigate('/plan')}>
              Plan Another Trip
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Trip Summary */}
        <Card className="mb-8 shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
            <CardTitle className="text-3xl flex items-center gap-2">
              <Calendar className="w-8 h-8" />
              Your {formData.city} Adventure
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                <span><strong>Destination:</strong> {formData.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span><strong>Duration:</strong> {formData.duration} days</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-500" />
                <span><strong>Style:</strong> {formData.travelStyle || 'Balanced'}</span>
              </div>
            </div>
            <div>
              <strong>Your Interests:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="bg-orange-100 text-orange-800">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Itinerary */}
        <div className="space-y-6">
          {itinerary.map((day, dayIndex) => (
            <Card key={day.day} className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <CardTitle className="text-2xl">
                  Day {day.day} - Estimated {day.totalTime} hours
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {day.attractions.map((attraction, attractionIndex) => (
                    <div key={attractionIndex} className="relative">
                      <div className="flex items-start gap-4 p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                            {attractionIndex + 1}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {attraction.name}
                          </h3>
                          <p className="text-gray-600 mb-3">{attraction.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Duration: {attraction.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Hours: {attraction.hours}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {attraction.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {attractionIndex < day.attractions.length - 1 && (
                        <div className="flex justify-center py-2">
                          <ArrowDown className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/plan')}
            size="lg" 
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-lg rounded-full"
          >
            Plan Another Trip
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={handleShare}
            className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 text-lg rounded-full"
          >
            <Share className="w-5 h-5 mr-2" />
            Share Itinerary
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Itinerary;
