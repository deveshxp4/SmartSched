"use client";
import Link from "next/link";
import { ArrowRight, Award, Trash2, Users, MapPin, Gift } from "lucide-react";

export default function CleanCityLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-green-600 text-white">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join the Clean City Initiative
            </h1>
            <p className="text-xl mb-8">
              Make our city cleaner, greener, and earn rewards while making a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/CleanCity/volunteer-registration">
                <button className="bg-white text-green-600 font-medium px-6 py-3 rounded-lg shadow-md hover:bg-green-50 transition-colors flex items-center gap-2">
                  Become a Volunteer <ArrowRight size={18} />
                </button>
              </Link>
              <Link href="/CleanCity/campaigns">
                <button className="bg-transparent border-2 border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-white/10 transition-colors">
                  View Campaigns
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Join our mission to create a cleaner, healthier city through community participation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Register as a Volunteer</h3>
              <p className="text-gray-600">
                Sign up to become a volunteer and join our community of changemakers dedicated to a cleaner city.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Participate in Campaigns</h3>
              <p className="text-gray-600">
                Join cleanliness drives, awareness programs, and recycling initiatives in your neighborhood.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Award className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Earn Points & Rewards</h3>
              <p className="text-gray-600">
                Earn badges and credit points for your participation that can be redeemed for public transport and eco-friendly products.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Campaigns */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Campaigns</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Join these upcoming cleanliness drives and make a positive impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "City Park Cleanup",
                date: "June 15, 2023",
                location: "Central Park",
                points: 150,
              },
              {
                title: "Beach Cleanup Drive",
                date: "June 22, 2023",
                location: "Sunset Beach",
                points: 200,
              },
              {
                title: "Neighborhood Beautification",
                date: "July 1, 2023",
                location: "Downtown District",
                points: 180,
              },
            ].map((campaign, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin size={16} className="mr-1" />
                    {campaign.location}
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <span className="mr-1">📅</span> {campaign.date}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {campaign.points} Points
                    </span>
                    <Link href="/CleanCity/campaigns">
                      <button className="text-green-600 font-medium hover:underline flex items-center gap-1">
                        Register <ArrowRight size={16} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/CleanCity/campaigns">
              <button className="bg-green-600 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition-colors">
                View All Campaigns
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Rewards Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Earn Rewards</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Your contribution is valued! Earn points and badges that can be redeemed for various rewards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold ml-4">Achievement Badges</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  "Eco Warrior",
                  "Cleanliness Champion",
                  "Community Leader",
                  "Green Innovator",
                  "Waste Warrior",
                  "Recycling Hero",
                ].map((badge, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
                    <p className="text-sm font-medium text-gray-800">{badge}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Gift className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold ml-4">Redeem Points</h3>
              </div>
              <div className="space-y-4">
                {[
                  { title: "Public Transport Pass", points: 500 },
                  { title: "Eco-friendly Water Bottle", points: 300 },
                  { title: "City Museum Pass", points: 400 },
                  { title: "Tree Planting Certificate", points: 250 },
                ].map((reward, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between border-b border-gray-100 pb-4"
                  >
                    <span className="text-gray-800 font-medium">{reward.title}</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {reward.points} Points
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link href="/CleanCity/rewards">
                  <button className="w-full bg-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    View All Rewards <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Us CTA */}
      <div className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of volunteers who are working together to create a cleaner, 
            greener city for everyone.
          </p>
          <Link href="/CleanCity/volunteer-registration">
            <button className="bg-white text-green-600 font-medium px-8 py-4 rounded-lg shadow-md hover:bg-green-50 transition-colors text-lg">
              Register as a Volunteer
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 