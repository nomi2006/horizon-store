import React, { useEffect, useRef, useState } from 'react';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import AboutPic from '../assets/AboutPic.jpg';
import {
    Store,
    CircleDollarSign,
    Gift,
    BadgeDollarSign,
    Truck,
    Headphones,
    ShieldCheck,
    Twitter,
    Instagram,
    Linkedin,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

// STATS

const stats = [
    {
        value: 10500,
        displayValue: '10.5k',
        label: 'Sellers active our site',
        icon: Store,
    },
    {
        value: 33000,
        displayValue: '33k',
        label: 'Monthly Product Sale',
        icon: CircleDollarSign,
    },
    {
        value: 45500,
        displayValue: '45.5k',
        label: 'Customer active in our site',
        icon: Gift,
    },
    {
        value: 25000,
        displayValue: '25k',
        label: 'Anual gross sale in our site',
        icon: BadgeDollarSign,
    },
];

// TEAM
// Add/remove members here whenever needed.

const team = [
    {
        name: 'Tom Cruise',
        role: 'Founder & Chairman',
        image:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85',
    },
    {
        name: 'Emma Watson',
        role: 'Managing Director',
        image:
            'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=85',
    },
    {
        name: 'Will Smith',
        role: 'Product Designer',
        image:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=85',
    },
    {
        name: 'Robert Downey',
        role: 'Marketing Director',
        image:
            'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=85',
    },
    {
        name: 'Sarah Johnson',
        role: 'Product Manager',
        image:
            'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=700&q=85',
    },
    {
        name: 'Michael Brown',
        role: 'Sales Manager',
        image:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85',
    },
    {
        name: 'Sophia Miller',
        role: 'UX Designer',
        image:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=85',
    },
    {
        name: 'James Wilson',
        role: 'Software Engineer',
        image:
            'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=700&q=85',
    },
    {
        name: 'Olivia Davis',
        role: 'Brand Manager',
        image:
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=85',
    },
];

// FEATURES

const features = [
    {
        icon: Truck,
        title: 'FREE AND FAST DELIVERY',
        description: 'Free delivery for all orders over $140',
    },
    {
        icon: Headphones,
        title: '24/7 CUSTOMER SERVICE',
        description: 'Friendly 24/7 customer support',
    },
    {
        icon: ShieldCheck,
        title: 'MONEY BACK GUARANTEE',
        description: 'We reurn money within 30 days',
    },
];

// COUNTING HOOK

function useCountUp(target, duration = 9600) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let animationFrame;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out animation
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            setCount(Math.floor(target * easedProgress));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(target);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [target, duration]);

    return count;
}

// STAT CARD

function StatCard({ stat }) {
    const count = useCountUp(stat.value);

    const formattedCount =
        stat.displayValue.includes('.')
            ? `${(count / 1000).toFixed(1)}k`
            : `${Math.floor(count / 1000)}k`;

    const Icon = stat.icon;

    return (
        <div
            className="
        group
        h-[138px]
        md:h-[140px]
        border
        border-[#D5D5D5]
        rounded-[3px]
        bg-white
        text-black
        flex
        flex-col
        items-center
        justify-center
        transition-all
        duration-300
        hover:bg-[#DB4444]
        hover:border-[#DB4444]
        hover:text-white
        hover:shadow-[0_2px_8px_rgba(0,0,0,0.15)]
        cursor-pointer
      "
        >
            {/* Icon */}
            <div
                className="
          w-[50px]
          h-[50px]
          rounded-full
          bg-[#D3D3D3]
          flex
          items-center
          justify-center
          mb-[9px]
          transition-all
          duration-300
          group-hover:bg-white
        "
            >
                <div
                    className="
            w-[36px]
            h-[36px]
            rounded-full
            bg-black
            text-white
            flex
            items-center
            justify-center
            transition-all
            duration-300
            group-hover:bg-white
            group-hover:text-black
            group-hover:border
            group-hover:border-[#777]
          "
                >
                    <Icon size={19} strokeWidth={1.8} />
                </div>
            </div>

            {/* Animated number */}
            <div className="text-[24px] leading-[28px] font-semibold">
                {formattedCount}
            </div>

            {/* Label */}
            <div
                className="
          mt-[3px]
          text-[11px]
          leading-[16px]
          text-black
          transition-colors
          duration-300
          group-hover:text-white
        "
            >
                {stat.label}
            </div>
        </div>
    );
}

// ABOUT PAGE

export function AboutPage() {
    const teamSliderRef = useRef(null);

    const [activeTeamDot, setActiveTeamDot] = useState(0);

    const scrollToTeamGroup = (groupIndex) => {
        if (!teamSliderRef.current) return;

        const slider = teamSliderRef.current;
        const firstCard = slider.firstElementChild;

        if (!firstCard) return;

        const cardWidth = firstCard.getBoundingClientRect().width;
        const gap = parseFloat(getComputedStyle(slider).gap) || 0;

        // Move exactly 3 team members
        const groupWidth = (cardWidth + gap) * 3;

        slider.scrollTo({
            left: groupIndex * groupWidth,
            behavior: 'smooth',
        });

        setActiveTeamDot(groupIndex);
    };

    useEffect(() => {
        const slider = teamSliderRef.current;

        if (!slider) return;

        const handleScroll = () => {
            const firstCard = slider.firstElementChild;

            if (!firstCard) return;

            const cardWidth = firstCard.getBoundingClientRect().width;
            const gap = parseFloat(getComputedStyle(slider).gap) || 0;

            const groupWidth = (cardWidth + gap) * 3;

            const currentGroup = Math.round(slider.scrollLeft / groupWidth);

            setActiveTeamDot(
                Math.max(0, Math.min(currentGroup, 2))
            );
        };

        slider.addEventListener('scroll', handleScroll, {
            passive: true,
        });

        return () => {
            slider.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollTeam = (direction) => {
        if (!teamSliderRef.current) return;

        const amount = 390;

        teamSliderRef.current.scrollBy({
            left: direction === 'left' ? -amount : amount,
            behavior: 'smooth',
        });
    };

    return (
        <div className="min-h-screen bg-white text-black">
            <TopBar />
            <Navbar />

            <main>
                {/* BREADCRUMBS */}

                <section className="max-w-[1170px] mx-auto px-4 lg:px-0 pt-[48px] md:pt-[55px]">
                    <div className="flex items-center gap-3 text-[14px] leading-[20px]">
                        <span className="text-[#777]">Home</span>
                        <span className="text-[#999]">/</span>
                        <span className="text-black">About</span>
                    </div>
                </section>

                {/* OUR STORY */}

                <section className="max-w-[1170px] mx-auto px-4 lg:px-0 mt-[48px] md:mt-[55px]">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_600px] items-center gap-[45px]">
                        <div className="max-w-[490px]">
                            <h1 className="m-0 text-[40px] md:text-[48px] leading-[1.15] font-semibold tracking-[0.02em]">
                                Our Story
                            </h1>

                            <div className="mt-[28px] space-y-[20px] text-[14px] leading-[22px] text-[#333]">
                                <p className="m-0">
                                    Launched in 2015, Exclusive is South Asia’s premier online
                                    shopping marketplace with an active presence in Bangladesh.
                                    Supported by wide range of tailored marketing, data and
                                    service solutions, Exclusive has 10,500 sellers and 300
                                    brands and serves 3 millions customers across the region.
                                </p>

                                <p className="m-0">
                                    Exclusive has more than 1 million products to offer, growing
                                    at a very fast. Exclusive offers a diverse assortment in
                                    categories ranging from consumer.
                                </p>
                            </div>
                        </div>

                        <div className="w-full h-[360px] md:h-[420px] overflow-hidden rounded-[2px]">
                            <img
                                src={AboutPic}
                                alt="Customers shopping"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </section>

                {/* STATS */}

                <section className="max-w-[1170px] mx-auto px-4 lg:px-0 mt-[80px] md:mt-[85px]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px] md:gap-[20px]">
                        {stats.map((stat) => (
                            <StatCard key={stat.label} stat={stat} />
                        ))}
                    </div>
                </section>
                {/* TEAM */}

                <section className="max-w-[1170px] mx-auto px-4 lg:px-0 mt-[82px] md:mt-[85px]">

                    {/* Horizontal scrolling container */}
                    <div
                        ref={teamSliderRef}
                        className="
              flex
              gap-[30px]
              overflow-x-auto
              snap-x
              snap-mandatory
              scroll-smooth
              pb-[15px]
              scrollbar-hide
            "
                    >
                        {team.map((member) => (
                            <article
                                key={member.name}
                                className="
                  flex-none
                  w-[calc(100%-0px)]
                  sm:w-[calc(50%-15px)]
                  lg:w-[370px]
                  snap-start
                "
                            >
                                {/* Image */}
                                <div className="w-full h-[330px] bg-[#F5F5F5] overflow-hidden rounded-[2px]">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-top"
                                    />
                                </div>

                                {/* Name */}
                                <h2 className="m-0 mt-[17px] text-[24px] leading-[28px] font-medium tracking-[0.02em]">
                                    {member.name}
                                </h2>

                                {/* Role */}
                                <p className="m-0 mt-[5px] text-[13px] leading-[18px]">
                                    {member.role}
                                </p>

                                {/* Social */}
                                <div className="flex items-center gap-[13px] mt-[10px]">
                                    <a
                                        href="#"
                                        aria-label={`${member.name} Twitter`}
                                        className="text-black hover:text-[#DB4444] transition-colors"
                                    >
                                        <Twitter size={16} strokeWidth={1.8} />
                                    </a>

                                    <a
                                        href="#"
                                        aria-label={`${member.name} Instagram`}
                                        className="text-black hover:text-[#DB4444] transition-colors"
                                    >
                                        <Instagram size={16} strokeWidth={1.8} />
                                    </a>

                                    <a
                                        href="#"
                                        aria-label={`${member.name} LinkedIn`}
                                        className="text-black hover:text-[#DB4444] transition-colors"
                                    >
                                        <Linkedin size={16} strokeWidth={1.8} />
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Team Pagination Dots */}
                    <div className="flex justify-center items-center gap-[8px] mt-[28px]">
                        {[0, 1, 2].map((index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => scrollToTeamGroup(index)}
                                aria-label={`Show team members ${index * 3 + 1} to ${index * 3 + 3
                                    }`}
                                className={`
        rounded-full
        transition-all
        duration-300
        cursor-pointer
        ${activeTeamDot === index
                                        ? 'w-[9px] h-[9px] bg-[#DB4444] ring-1 ring-[#DB4444] ring-offset-1'
                                        : 'w-[8px] h-[8px] bg-[#BDBDBD]'
                                    }
      `}
                            />
                        ))}
                    </div>



                    {/* Mobile scroll hint */}
                    <div className="flex md:hidden justify-center items-center gap-[6px] mt-[18px]">
                        <span className="text-[11px] text-[#888]">
                            Swipe to view more team members
                        </span>
                    </div>
                </section>

                {/* FEATURES */}

                <section className="max-w-[1170px] mx-auto px-4 lg:px-0 mt-[80px] md:mt-[82px] pb-[82px]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-[55px] md:gap-[30px]">
                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.title}
                                    className="flex flex-col items-center text-center"
                                >
                                    <div className="w-[50px] h-[50px] rounded-full bg-[#D3D3D3] flex items-center justify-center">
                                        <div className="w-[36px] h-[36px] rounded-full bg-black text-white flex items-center justify-center">
                                            <Icon size={19} strokeWidth={1.8} />
                                        </div>
                                    </div>

                                    <h3 className="m-0 mt-[15px] text-[14px] leading-[20px] font-bold">
                                        {feature.title}
                                    </h3>

                                    <p className="m-0 mt-[5px] text-[11px] leading-[17px] text-[#333]">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AboutPage;
