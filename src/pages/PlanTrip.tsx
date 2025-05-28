
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Calendar, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const PlanTrip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    city: "",
    duration: "",
    interests: [],
    budget: "",
    travelStyle: "",
    groupSize: ""
  });

  const cities = [
    "Delhi", "Mumbai", "Bangalore", "Jaipur", "Kerala (Kochi)", 
    "Goa", "Agra", "Varanasi", "Rishikesh", "Udaipur",
    "Jodhpur", "Pushkar", "Hampi", "Mysore", "Ooty"
  ];

  const interests = [
    "Heritage & Culture", "Nature & Wildlife", "Food & Cuisine", 
    "Adventure Sports", "Spiritual & Religious", "Art & Crafts",
    "Photography", "Shopping", "Nightlife", "Beaches"
  ];

  const handleInterestChange = (interest, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        interests: prev.interests.filter(i => i !== interest)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.city || !formData.duration || formData.interests.length === 0) {
      toast({
        title: "Please fill in all required fields",
        description: "City, duration, and at least one interest are required.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to itinerary page with form data
    navigate('/itinerary', { state: formData });
  };

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
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
            Plan Your Perfect Trip
          </h1>
          <p className="text-xl text-gray-600">
            Tell us about your preferences and we'll create a personalized itinerary for you
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Trip Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* City Selection */}
              <div className="space-y-2">
                <Label htmlFor="city" className="text-lg font-semibold">
                  Which city would you like to visit? *
                </Label>
                <Select value={formData.city} onValueChange={(value) => setFormData(prev => ({...prev, city: value}))}>
                  <SelectTrigger className="w-full h-12 text-lg">
                    <SelectValue placeholder="Select your destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Duration and Group Size */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-lg font-semibold">
                    Duration of stay (days) *
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="30"
                    placeholder="e.g., 3"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({...prev, duration: e.target.value}))}
                    className="h-12 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="groupSize" className="text-lg font-semibold">
                    Group size
                  </Label>
                  <Select value={formData.groupSize} onValueChange={(value) => setFormData(prev => ({...prev, groupSize: value}))}>
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue placeholder="Select group size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo traveler</SelectItem>
                      <SelectItem value="couple">Couple (2 people)</SelectItem>
                      <SelectItem value="family">Family (3-5 people)</SelectItem>
                      <SelectItem value="group">Group (6+ people)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">
                  What are your interests? * (Select all that apply)
                </Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {interests.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={(checked) => handleInterestChange(interest, checked)}
                      />
                      <Label htmlFor={interest} className="text-sm cursor-pointer">
                        {interest}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget and Travel Style */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-lg font-semibold">
                    Budget per person (₹)
                  </Label>
                  <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({...prev, budget: value}))}>
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget (₹5,000 - ₹15,000)</SelectItem>
                      <SelectItem value="mid-range">Mid-range (₹15,000 - ₹30,000)</SelectItem>
                      <SelectItem value="luxury">Luxury (₹30,000+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="travelStyle" className="text-lg font-semibold">
                    Travel style
                  </Label>
                  <Select value={formData.travelStyle} onValueChange={(value) => setFormData(prev => ({...prev, travelStyle: value}))}>
                    <SelectTrigger className="h-12 text-lg">
                      <SelectValue placeholder="Select travel style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relaxed">Relaxed (2-3 places per day)</SelectItem>
                      <SelectItem value="balanced">Balanced (4-5 places per day)</SelectItem>
                      <SelectItem value="intensive">Intensive (6+ places per day)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Clock className="w-5 h-5 mr-2" />
                Generate My Itinerary
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanTrip;
