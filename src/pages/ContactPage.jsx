import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import { Phone, Mail } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Contact form submitted:', formData);

    // Backend / Supabase integration can be added here later.
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Existing Header */}
      <TopBar />
      <Navbar />

      <main>
        {/* BREADCRUMB */}
        <section className="max-w-[1170px] mx-auto px-4 lg:px-0 pt-[48px]">
          <div className="flex items-center gap-[12px] text-[14px] leading-[21px]">
            <span className="text-[#7D7D7D]">Home</span>
            <span className="text-[#7D7D7D]">/</span>
            <span className="text-black">Contact</span>
          </div>
        </section>

        {/* CONTACT SECTION*/}
        <section className="max-w-[1170px] mx-auto px-4 lg:px-0 mt-[80px] pb-[140px]">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-[30px]">
            {/* LEFT CONTACT INFORMATION */}
            <div
              className="
                w-full
                min-h-[457px]
                bg-white
                rounded-[4px]
                shadow-[0_1px_13px_rgba(0,0,0,0.05)]
                px-[35px]
                py-[40px]
              "
            >
              {/* Call To Us */}
              <div>
                <div className="flex items-center gap-[16px]">
                  <div
                    className="
                      w-[40px]
                      h-[40px]
                      rounded-full
                      bg-[#DB4444]
                      flex
                      items-center
                      justify-center
                      text-white
                    "
                  >
                    <Phone size={20} strokeWidth={2} />
                  </div>

                  <h2 className="m-0 text-[16px] leading-[24px] font-medium">
                    Call To Us
                  </h2>
                </div>

                <p className="m-0 mt-[24px] text-[14px] leading-[21px]">
                  We are available 24/7, 7 days a week.
                </p>

                <p className="m-0 mt-[16px] text-[14px] leading-[21px]">
                  Phone: +880161112222
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-[1px] bg-[#D9D9D9] my-[30px]" />

              {/* Write To Us */}
              <div>
                <div className="flex items-center gap-[16px]">
                  <div
                    className="
                      w-[40px]
                      h-[40px]
                      rounded-full
                      bg-[#DB4444]
                      flex
                      items-center
                      justify-center
                      text-white
                    "
                  >
                    <Mail size={20} strokeWidth={2} />
                  </div>

                  <h2 className="m-0 text-[16px] leading-[24px] font-medium">
                    Write To Us
                  </h2>
                </div>

                <p className="m-0 mt-[24px] text-[14px] leading-[21px]">
                  Fill out our form and we will contact you within 24 hours.
                </p>

                <p className="m-0 mt-[16px] text-[14px] leading-[21px]">
                  Emails: customer@horizon.com
                </p>

                <p className="m-0 mt-[16px] text-[14px] leading-[21px]">
                  Emails: support@horizon.com
                </p>
              </div>
            </div>

            {/* RIGHT CONTACT FORM */}
            <div
              className="
                w-full
                min-h-[457px]
                bg-white
                rounded-[4px]
                shadow-[0_1px_13px_rgba(0,0,0,0.05)]
                px-[30px]
                md:px-[32px]
                py-[40px]
              "
            >
              <form onSubmit={handleSubmit}>
                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name *"
                    required
                    className="
                      w-full
                      h-[50px]
                      px-[16px]
                      rounded-[4px]
                      bg-[#F5F5F5]
                      border
                      border-transparent
                      outline-none
                      text-[14px]
                      leading-[21px]
                      placeholder:text-[#7D7D7D]
                      focus:border-[#DB4444]
                      transition-colors
                    "
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email *"
                    required
                    className="
                      w-full
                      h-[50px]
                      px-[16px]
                      rounded-[4px]
                      bg-[#F5F5F5]
                      border
                      border-transparent
                      outline-none
                      text-[14px]
                      leading-[21px]
                      placeholder:text-[#7D7D7D]
                      focus:border-[#DB4444]
                      transition-colors
                    "
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your Phone *"
                    required
                    className="
                      w-full
                      h-[50px]
                      px-[16px]
                      rounded-[4px]
                      bg-[#F5F5F5]
                      border
                      border-transparent
                      outline-none
                      text-[14px]
                      leading-[21px]
                      placeholder:text-[#7D7D7D]
                      focus:border-[#DB4444]
                      transition-colors
                    "
                  />
                </div>

                {/* Message */}
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows={10}
                  className="
                    block
                    w-full
                    h-[207px]
                    mt-[32px]
                    px-[16px]
                    py-[13px]
                    rounded-[4px]
                    bg-[#F5F5F5]
                    border
                    border-transparent
                    outline-none
                    resize-none
                    text-[14px]
                    leading-[21px]
                    placeholder:text-[#7D7D7D]
                    focus:border-[#DB4444]
                    transition-colors
                  "
                />

                {/* Button */}
                <div className="flex justify-end mt-[32px]">
                  <button
                    type="submit"
                    className="
                      w-full
                      md:w-[215px]
                      h-[56px]
                      rounded-[4px]
                      bg-[#DB4444]
                      text-white
                      text-[16px]
                      leading-[24px]
                      font-medium
                      hover:bg-[#C93636]
                      active:scale-[0.98]
                      transition-all
                    "
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactPage;
