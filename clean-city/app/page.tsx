import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowRight, 
  Award, 
  Recycle, 
  Users, 
  Clock, 
  MapPin, 
  Leaf,
  ShieldCheck 
} from 'lucide-react'

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image 
            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b" 
            alt="Background" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        <div className="container-custom py-20 md:py-28 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Join the Movement for a <span className="text-yellow-300">Cleaner Tomorrow</span>
              </h1>
              <p className="text-xl mb-8 text-gray-100 max-w-xl">
                Participate in cleanliness campaigns, earn rewards, and make a difference in your community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/volunteer" className="btn bg-white text-primary-700 hover:bg-gray-100">
                  Become a Volunteer
                </Link>
                <Link href="/campaigns" className="btn bg-primary-600 text-white border border-primary-400 hover:bg-primary-500">
                  Explore Campaigns
                </Link>
              </div>
              <div className="mt-8 flex items-center space-x-4 text-sm">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
                  ))}
                </div>
                <p>Join <strong>5,000+</strong> volunteers already making a difference</p>
              </div>
            </div>
            <div className="hidden md:block relative h-96 animate-slide-up">
              <Image 
                src="https://images.unsplash.com/photo-1567095761054-7a02e69e5c43" 
                alt="Volunteers cleaning beach" 
                fill 
                className="object-cover rounded-lg shadow-xl"
              />
              <div className="absolute top-4 right-4 bg-white text-primary-700 px-4 py-2 rounded-full font-medium">
                Latest Campaign
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white opacity-20"></div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary-700">5K+</p>
              <p className="text-gray-600 mt-2">Active Volunteers</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary-700">120+</p>
              <p className="text-gray-600 mt-2">Campaigns Completed</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary-700">50K+</p>
              <p className="text-gray-600 mt-2">Kg Waste Collected</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-primary-700">1M+</p>
              <p className="text-gray-600 mt-2">Points Awarded</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Join our mission to create a cleaner, healthier environment through community participation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-primary-700" size={30} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Register as a Volunteer</h3>
              <p className="text-gray-600">
                Sign up to become a volunteer and join our community of changemakers dedicated to a cleaner city.
              </p>
            </div>

            <div className="card p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Recycle className="text-primary-700" size={30} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Participate in Campaigns</h3>
              <p className="text-gray-600">
                Join cleanliness drives, awareness programs, and recycling initiatives in your neighborhood.
              </p>
            </div>

            <div className="card p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="text-primary-700" size={30} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Earn Rewards</h3>
              <p className="text-gray-600">
                Earn badges and credit points for your participation that can be redeemed for various rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="section">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <div>
              <h2 className="section-title mb-2">Featured Campaigns</h2>
              <p className="section-subtitle max-w-2xl">
                Join these upcoming cleanliness drives and make a positive impact
              </p>
            </div>
            <Link href="/campaigns" className="btn btn-primary mt-4 md:mt-0">
              View All Campaigns
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "City Park Cleanup",
                image: "https://images.unsplash.com/photo-1562684750-0553aea79845",
                date: "June 15, 2023",
                location: "Central Park",
                points: 150,
              },
              {
                title: "Beach Cleanup Drive",
                image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5",
                date: "June 22, 2023",
                location: "Sunset Beach",
                points: 200,
              },
              {
                title: "Neighborhood Beautification",
                image: "https://images.unsplash.com/photo-1560263816-d704d994e184",
                date: "July 1, 2023",
                location: "Downtown District",
                points: 180,
              },
            ].map((campaign, index) => (
              <div key={index} className="card overflow-hidden group">
                <div className="relative h-48">
                  <Image 
                    src={campaign.image} 
                    alt={campaign.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin size={16} className="mr-1 flex-shrink-0" />
                    <span>{campaign.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Clock size={16} className="mr-1 flex-shrink-0" />
                    <span>{campaign.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="badge badge-primary">
                      {campaign.points} Points
                    </span>
                    <Link href={`/campaigns/${index + 1}`} className="text-primary-700 font-medium flex items-center hover:text-primary-800 transition-colors">
                      Join Campaign
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rewards Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">Earn Rewards</h2>
            <p className="section-subtitle">
              Your contribution is valued! Earn points and badges that can be redeemed for various rewards
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="card p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold ml-4">Achievement Badges</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { name: "Eco Warrior", icon: <ShieldCheck size={20} /> },
                  { name: "Cleanliness Champion", icon: <Recycle size={20} /> },
                  { name: "Community Leader", icon: <Users size={20} /> },
                  { name: "Green Innovator", icon: <Leaf size={20} /> },
                  { name: "Waste Warrior", icon: <Award size={20} /> },
                  { name: "Recycling Hero", icon: <Recycle size={20} /> },
                ].map((badge, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center hover:border-primary-300 transition-colors"
                  >
                    <div className="w-12 h-12 bg-white rounded-full mx-auto mb-2 flex items-center justify-center text-primary-700">
                      {badge.icon}
                    </div>
                    <p className="text-sm font-medium text-gray-800">{badge.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShieldCheck className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold ml-4">Redeem Points</h3>
              </div>
              <div className="space-y-4">
                {[
                  { title: "Public Transport Pass", points: 500, color: "bg-blue-50 border-blue-200" },
                  { title: "Eco-friendly Water Bottle", points: 300, color: "bg-green-50 border-green-200" },
                  { title: "City Museum Pass", points: 400, color: "bg-yellow-50 border-yellow-200" },
                  { title: "Tree Planting Certificate", points: 250, color: "bg-orange-50 border-orange-200" },
                ].map((reward, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-4 rounded-lg ${reward.color} border`}
                  >
                    <span className="font-medium">{reward.title}</span>
                    <span className="badge badge-secondary">
                      {reward.points} Points
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link href="/rewards" className="btn btn-accent w-full justify-center">
                  View All Rewards
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">Volunteer Experiences</h2>
            <p className="section-subtitle">
              Hear from volunteers who are making a difference in their communities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Regular Volunteer",
                quote: "Being part of CleanCity has not only helped me contribute to a cleaner environment but also connected me with amazing like-minded people.",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
              },
              {
                name: "Michael Chen",
                role: "Community Leader",
                quote: "The rewards program is fantastic! I've earned enough points to get monthly public transport passes, which saves me money while I help save the planet.",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
              },
              {
                name: "Priya Sharma",
                role: "Weekend Volunteer",
                quote: "I love how easy it is to find and join campaigns. The mobile app makes tracking my contributions and rewards so convenient.",
                image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604",
              },
            ].map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative mr-4">
                    <Image 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700 text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of volunteers who are working together to create a cleaner,
            greener city for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/volunteer" className="btn bg-white text-primary-700 hover:bg-gray-100">
              Become a Volunteer
            </Link>
            <Link href="/campaigns" className="btn bg-primary-600 text-white border border-primary-400 hover:bg-primary-500">
              Browse Campaigns
            </Link>
          </div>
        </div>
      </section>
    </>
  )
} 