import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Banner images
import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner4 from "../assets/banner4.jpg";
import banner5 from "../assets/banner5.jpg";

const banners = [banner1, banner2, banner4, banner5];

const TestLanding = () => {
  return (
    <div className="min-h-screen bg-[#F9F9F9] text-gray-800 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="text-center pt-10 pb-4 px-6">
        <h1 className="text-4xl font-bold text-[#804A2C]">Bean & Barrel</h1>
        <p className="text-md mt-1 text-[#966F4C]">
          Bar and Coffee Shop finder for Boulder, Colorado.
        </p>
      </section>

      {/* Image Strip (Desktop Only) */}
      <section className="px-6 py-6">
        <div className="grid grid-cols-4 gap-6 justify-center">
          {banners.map((img, i) => (
            <div key={i} className="w-[225px] h-[225px] rounded-md overflow-hidden shadow">
              <img
                src={img}
                alt={`Banner ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="text-center px-6 pt-8 pb-12">
        <h2 className="text-xl font-semibold text-[#804A2C] mb-6">
          Recommendations & Reviews
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {[
            "A terrific piece of praise",
            "A fantastic bit of feedback",
            "A genuinely glowing review"
          ].map((quote, i) => (
            <div key={i} className="bg-white border p-4 rounded-lg shadow-sm w-[280px] text-left">
              <p className="italic text-sm mb-4">“{quote}”</p>
              <div className="flex items-center space-x-3">
                <img
                  src="https://randomuser.me/api/portraits/men/3.jpg"
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">Name</p>
                  <p className="text-xs text-gray-500">Description</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Footer */}
      <div className="text-center text-[#804A2C] text-sm py-6">
        <div className="flex justify-center space-x-5 text-lg mb-2">
          <i className="fab fa-facebook" />
          <i className="fab fa-linkedin" />
          <i className="fab fa-instagram" />
          <i className="fab fa-youtube" />
          <i className="fab fa-twitter" />
        </div>
        <p className="text-sm">beannbarrel.com</p>
      </div>

      <Footer />
    </div>
  );
};

export default TestLanding;