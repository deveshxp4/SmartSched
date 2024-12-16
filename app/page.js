
import Image from "next/image";

import './style.css'; // Import the CSS file
import Link from "next/link";


export default function Home() {
  return (
    <>
      <div className="flex">
        <div className="left">
          <div className="">
            <h1 className="main2">​Efficient Timetable Management for Students</h1>
            <div className="main3">My Site provides an effective and powerful way to manage your timetables, assignments, and study schedules.</div>
            <Link href={"/Register"}>
            <button className="ml-36 mt-4  relative px-8 py-2 rounded-md bg-white isolation-auto z-10 border-2 border-zinc-950
        before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full  before:bg-yellow-500 before:-z-10  before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700">Get Started</button>
        </Link>
            <div className="main5 flex">
              <ul className="flex gap-2">
                <li className="main6"><img src="/image2.png" /></li>
                <li className="w-32">Simplified Scheduling</li>
              </ul>
              <ul className="flex gap-2">
                <li className="main6"><img src="/image3.png" /></li>
                <li className="w-32">Personalized & Adaptable</li>
              </ul>
              <ul className="flex gap-2">
                <li className="main6"><img src="/image4.png" /></li>
                <li className="w-32">Enhanced Student Collaboration</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="top flex justify-end">
            <img className="bok" src="/image1.png" alt="Image description" />
          </div>
        </div>
      </div>

      <div className="mt-32">
        <div className="left">
          <img className="main8" src="/image7.png" />
          <div className="tutu">Empower Students with Time Management</div>
        </div>

        <div className="right1">
          <div>
            My Site is dedicated to providing students with the tools and resources to effectively manage their time, stay organized, and optimize their learning experience.
          </div>
        </div>
      </div>

      {/* Move the last section outside the above divs */}
      <div className="mt-80 ">
        <h1 className="main10">What We Offer</h1>
        <p className="main11">My Site offers a user-friendly platform that allows students to create customized timetables, set reminders, and sync schedules across devices</p>z
        <div className="main12 flex ">
          <div className="main14 p-5 m-2 ">
            <img className="main13 m-3 " src="/image10.png" />
            <h1 className="font-bold m-3 ml-7 text-xl">Seamless Task Management</h1>
            <p className="w-44  ml-7">Our platform enables students to streamline their tasks, track progress, and collaborate with peers on group projects and study sessions.</p>
          </div>
          <div className="main14 p-5 m-2 ">
            <img className="main13 m-3 " src="/image11.png" />
            <h1 className="font-bold m-3 ml-7 text-xl">All-Inclusive Study Solution</h1>
            <p className="w-44  ml-7">My Site provides a comprehensive solution for students, including study resources, progress analytics, and performance tracking features.</p>
          </div>
          <div className="main14 p-5 m-2 ">
            <img className="main13 m-3 " src="/image12.png" />
            <h1 className="font-bold m-3 ml-7 text-xl ">Dedicated Student Support</h1>
            <p className="w-44  ml-7">We are committed to offering personalized support to students, ensuring they make the most of our timetable management tools and educational resources.</p>
          </div>
          <div className="main14 p-5 m-2 ">
            <img className="main13 m-3 " src="/image14.png" />
            <h1 className="font-bold m-3 ml-7 text-xl ">Efficient Automation Features</h1>
            <p className="w-44  ml-7">Our platform incorporates smart automation tools to simplify repetitive tasks, optimize study routines, and enhance productivity.</p>
          </div>
        </div>
      </div>


      <div className="flex">
        <div className=" main20 mt-24 ml-48">
          <img src="/image15.png" />
        </div>
        <div className="right3 mt-52 ml-56 ">
          <div>
            <div className="text-5xl w-96 mb-12">Built for Students, by Students</div>
            <div className="text-lg main21">My Site is built by students who understand the challenges of managing a busy academic schedule. </div>
          </div>

        </div >
        <div className=" main22 flex gap-14 ">
          <ul className="flex gap-2">
            <li className="main6"><img src="/image16.png" /></li>
            <li className="w-20">All-In-One Toolkit</li>
          </ul>
          <ul className="flex gap-2">
            <li className="main6"><img src="/image17 (2).png" /></li>
            <li className="w-32">Integrated Task Management</li>
          </ul>
          <ul className="flex gap-2">
            <li className="main6"><img src="/image18.png" /></li>
            <li className="w-32">Total Flexibility and Controll</li>
          </ul>
        </div>
      </div>

      <div>
        <h1 className="text-5xl ml-40 mt-40  mb-12">What Our Users Say</h1>
        <div className="flex justify-center gap-8 mt-28 ">
          <img className="main30" src="/image22.png" />
          <img className="main30" src="/image20.png" />
          <img className="main31 " src="/image21.png" />
        </div>
      </div>

      <div className="main32">
        <div className="">
          <div className="main35 ">
            <div className="text-6xl main37 mb-12">Discover Our Subscription Options</div>
            <div className="text-lg main21">Explore our subscription plans to find the best fit for your timetable management needs. </div>
            <button className=" mt-4  relative px-8 py-2 rounded-md bg-white isolation-auto z-10 border-2 border-zinc-950
        before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full  before:bg-yellow-500 before:-z-10  before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700">See More</button>
          </div>
        </div>
        <div className="">
          <div className="main34">
            <div className="main33 m-16  flex justify-end">
              <div className="card">
                <p className="price mt-3 ">
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


      <div className="name1">
        <div className="">
          <div className=" main41 text-5xl ">Elevate your academic productivity with My Site's intuitive timetable management solutions.</div>
          <button className=" mt-4  relative px-8 py-2 rounded-md bg-white isolation-auto z-10 border-2 border-zinc-950
        before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-right-full before:hover:right-0 before:rounded-full  before:bg-yellow-500 before:-z-10  before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700">Get Started</button>
        </div>
        <img className="main50  z-50" src="/image45.png" />
      </div>
    </>
  );
}
