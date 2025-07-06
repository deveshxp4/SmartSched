import Image from "next/image";
import './style.css'; // Import the CSS file
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-4 md:px-8 lg:px-16 py-8 md:py-16">
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Efficient Timetable Management for Students
          </h1>
          <div className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            My Site provides an effective and powerful way to manage your timetables, assignments, and study schedules.
          </div>
          <Link href={"/Register"}>
            <button className="relative px-8 py-3 rounded-md bg-white isolation-auto z-10 border-2 border-zinc-950
              before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-yellow-500 before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700">
              Get Started
            </button>
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <div className="flex items-center gap-2">
              <img src="/image2.png" alt="Simplified scheduling icon" className="w-8 h-8" />
              <span className="text-sm md:text-base">Simplified Scheduling</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/image3.png" alt="Personalized and adaptable icon" className="w-8 h-8" />
              <span className="text-sm md:text-base">Personalized & Adaptable</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/image4.png" alt="Enhanced student collaboration icon" className="w-8 h-8" />
              <span className="text-sm md:text-base">Enhanced Student Collaboration</span>
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <img className="w-full max-w-md lg:max-w-lg xl:max-w-xl" src="/image1.png" alt="Main illustration" />
        </div>
      </div>

      {/* Time Management Section */}
      <div className="px-4 md:px-8 lg:px-16 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="w-full lg:w-1/2">
            <img className="w-full h-auto" src="/image7.png" alt="Time management illustration" />
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-4 text-center lg:text-left">
              Empower Students with Time Management
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="text-lg md:text-xl text-gray-600 leading-relaxed">
              My Site is dedicated to providing students with the tools and resources to effectively manage their time, stay organized, and optimize their learning experience.
            </div>
          </div>
        </div>
      </div>

      {/* What We Offer Section */}
      <div className="px-4 md:px-8 lg:px-16 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-6">
          What We Offer
        </h1>
        <p className="text-lg md:text-xl text-gray-600 text-center mb-12 max-w-4xl mx-auto">
          My Site offers a user-friendly platform that allows students to create customized timetables, set reminders, and sync schedules across devices
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img className="w-16 h-16 mx-auto mb-4" src="/image10.png" alt="Task management icon" />
            <h3 className="font-bold text-xl mb-3 text-center">Seamless Task Management</h3>
            <p className="text-gray-600 text-center">
              Our platform enables students to streamline their tasks, track progress, and collaborate with peers on group projects and study sessions.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img className="w-16 h-16 mx-auto mb-4" src="/image11.png" alt="Study solution icon" />
            <h3 className="font-bold text-xl mb-3 text-center">All-Inclusive Study Solution</h3>
            <p className="text-gray-600 text-center">
              My Site provides a comprehensive solution for students, including study resources, progress analytics, and performance tracking features.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img className="w-16 h-16 mx-auto mb-4" src="/image12.png" alt="Student support icon" />
            <h3 className="font-bold text-xl mb-3 text-center">Dedicated Student Support</h3>
            <p className="text-gray-600 text-center">
              We are committed to offering personalized support to students, ensuring they make the most of our timetable management tools and educational resources.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img className="w-16 h-16 mx-auto mb-4" src="/image14.png" alt="Automation features icon" />
            <h3 className="font-bold text-xl mb-3 text-center">Efficient Automation Features</h3>
            <p className="text-gray-600 text-center">
              Our platform incorporates smart automation tools to simplify repetitive tasks, optimize study routines, and enhance productivity.
            </p>
          </div>
        </div>
      </div>

      {/* Built for Students Section */}
      <div className="px-4 md:px-8 lg:px-16 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <img className="w-full max-w-md mx-auto" src="/image15.png" alt="Student-focused design illustration" />
          </div>
          
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Built for Students, by Students
            </div>
            <div className="text-lg md:text-xl text-gray-600 mb-8">
              My Site is built by students who understand the challenges of managing a busy academic schedule.
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-8">
              <div className="flex items-center gap-2">
                <img src="/image16.png" alt="All-in-one toolkit icon" className="w-8 h-8" />
                <span className="text-sm md:text-base">All-In-One Toolkit</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/image17 (2).png" alt="Integrated task management icon" className="w-8 h-8" />
                <span className="text-sm md:text-base">Integrated Task Management</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/image18.png" alt="Flexibility and control icon" className="w-8 h-8" />
                <span className="text-sm md:text-base">Total Flexibility and Control</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="px-4 md:px-8 lg:px-16 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-12">
          What Our Users Say
        </h1>
        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8">
          <img className="w-full max-w-sm mx-auto" src="/image22.png" alt="User testimonial 1" />
          <img className="w-full max-w-sm mx-auto" src="/image20.png" alt="User testimonial 2" />
          <img className="w-full max-w-sm mx-auto" src="/image21.png" alt="User testimonial 3" />
        </div>
      </div>

      {/* Subscription Section */}
      <div className="bg-gray-100 py-16 md:py-24">
        <div className="px-4 md:px-8 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
                Discover Our Subscription Options
              </div>
              <div className="text-lg md:text-xl text-gray-600 mb-8">
                Explore our subscription plans to find the best fit for your timetable management needs.
              </div>
              <button className="relative px-8 py-3 rounded-md bg-white isolation-auto z-10 border-2 border-zinc-950
                before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-yellow-500 before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700">
                See More
              </button>
            </div>
            
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="card max-w-sm w-full">
                <p className="price mt-3">
                  FREE!!!!!
                </p>
                <a href="#" className="action">
                  Get started
                </a>
                <ul className="lists">
                  <li className="list">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><g strokeWidth="0" id="SVGRepo_bgCarrier"></g><g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z" clipRule="evenodd" fillRule="evenodd"></path> </g></svg>
                    <span> Connect 80 websites </span>
                  </li>
                  <li className="list">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><g strokeWidth="0" id="SVGRepo_bgCarrier"></g><g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z" clipRule="evenodd" fillRule="evenodd"></path> </g></svg>
                    <span> Connect up to 5 bank accounts </span>
                  </li>
                  <li className="list">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><g strokeWidth="0" id="SVGRepo_bgCarrier"></g><g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z" clipRule="evenodd" fillRule="evenodd"></path> </g></svg>
                    <span> Track up to 50 credit cards </span>
                  </li>
                  <li className="list">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><g strokeWidth="0" id="SVGRepo_bgCarrier"></g><g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z" clipRule="evenodd" fillRule="evenodd"></path> </g></svg>
                    <span> Analytics support </span>
                  </li>
                  <li className="list">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><g strokeWidth="0" id="SVGRepo_bgCarrier"></g><g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z" clipRule="evenodd" fillRule="evenodd"></path> </g></svg>
                    <span> Export up to 12 months data </span>
                  </li>
                  <li className="list">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><g strokeWidth="0" id="SVGRepo_bgCarrier"></g><g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" d="M21.5821 5.54289C21.9726 5.93342 21.9726 6.56658 21.5821 6.95711L10.2526 18.2867C9.86452 18.6747 9.23627 18.6775 8.84475 18.293L2.29929 11.8644C1.90527 11.4774 1.89956 10.8443 2.28655 10.4503C2.67354 10.0562 3.30668 10.0505 3.70071 10.4375L9.53911 16.1717L20.1679 5.54289C20.5584 5.15237 21.1916 5.15237 21.5821 5.54289Z" clipRule="evenodd" fillRule="evenodd"></path> </g></svg>
                    <span> Cloud service 24/7 </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="px-4 md:px-8 lg:px-16 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-8">
              Elevate your academic productivity with My Site&apos;s intuitive timetable management solutions.
            </div>
            <button className="relative px-8 py-3 rounded-md bg-white isolation-auto z-10 border-2 border-zinc-950
              before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full before:bg-yellow-500 before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700">
              Get Started
            </button>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <img className="w-full max-w-md lg:max-w-lg" src="/image45.png" alt="Academic productivity illustration" />
          </div>
        </div>
      </div>
    </>
  );
}
