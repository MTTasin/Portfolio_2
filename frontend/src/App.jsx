import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence, useMotionValue } from 'framer-motion';
import { Linkedin, Github, Twitter, Facebook, ArrowUp, X, Menu } from 'lucide-react';

// API Configuration
const API_BASE_URL = "https://tasinportfolio2.pythonanywhere.com";

// A map for social icons from lucide-react
const iconComponents = {
    Github: Github,
    Linkedin: Linkedin,
    Twitter: Twitter,
    Facebook: Facebook,
    X : X
};


// Loading Screen Component
const LoadingScreen = () => (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-[100]">
        <motion.div
            className="w-16 h-16 border-4 border-t-4 border-t-indigo-500 border-gray-700 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-white mt-4 text-lg">Loading Portfolio...</p>
    </div>
);

// Custom Animated Cursor
const AnimatedCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };
        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        document.addEventListener('mousemove', handleMouseMove);
        document.querySelectorAll('a, button, [data-hover]').forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.querySelectorAll('a, button, [data-hover]').forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-50 hidden md:block w-8 h-8 rounded-full border-2 border-indigo-500 bg-indigo-500/20 backdrop-blur-sm"
            style={{ translateX: position.x - 16, translateY: position.y - 16, }}
            animate={{ scale: isHovering ? 1.5 : 1, backgroundColor: isHovering ? 'rgba(99, 102, 241, 0.5)' : 'rgba(99, 102, 241, 0.8)', }}
            transition={{ type: 'spring', stiffness: 400, damping: 20, }}
        >
        </motion.div>
    );
};

// Header Component
const Header = () => {
    const [hidden, setHidden] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useEffect(() => {
        return scrollY.on("change", (latest) => {
            const previous = scrollY.getPrevious();
            if (latest > previous && latest > 150) {
                setHidden(true);
            } else {
                setHidden(false);
            }
        });
    }, [scrollY]);
    
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const navLinks = [ { name: 'About', href: '#about' }, { name: 'Projects', href: '#projects' }, { name: 'Contact', href: '#contact' }];

    const mobileMenuVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
    };
    const mobileLinkVariants = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0 } };

    return (
        <>
            <motion.header
                variants={{ visible: { y: 0 }, hidden: { y: '-100%' }, }}
                animate={hidden ? 'hidden' : 'visible'}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="fixed top-0 left-0 w-full z-40"
            >
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center backdrop-blur-md bg-black/30 rounded-b-lg">
                    <a href="#" className="text-2xl font-bold text-white tracking-wider">
                        <img src="./logo.webp" alt="" className='w-10 rounded-full'/>
                    </a>
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <a key={link.name} href={link.href} className="text-gray-300 hover:text-indigo-500 transition-colors duration-300" data-hover>
                                {link.name}
                            </a>
                        ))}
                    </div>
                    <a href="#contact" className="hidden md:inline-block bg-indigo-500 text-white px-6 py-2 rounded-full hover:bg-indigo-600 transition-colors duration-300 shadow-lg shadow-indigo-500/30" data-hover>
                        Hire Me
                    </a>
                    <div className="md:hidden">
                        <button onClick={toggleMobileMenu} className="text-white focus:outline-none" data-hover>
                           {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                        </button>
                    </div>
                </nav>
            </motion.header>
            <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div 
                    className="md:hidden fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-30 pt-24"
                    initial="hidden" animate="visible" exit="hidden" variants={mobileMenuVariants}
                >
                    <div className="container mx-auto px-6 flex flex-col items-center space-y-8">
                         {navLinks.map((link) => (
                            <motion.a 
                                key={link.name} href={link.href} className="text-3xl text-gray-300 hover:text-indigo-500 transition-colors duration-300" 
                                onClick={toggleMobileMenu} variants={mobileLinkVariants}
                            >
                                {link.name}
                            </motion.a>
                        ))}
                        <motion.a href="#contact" 
                            className="bg-indigo-500 text-white text-xl px-8 py-3 rounded-full hover:bg-indigo-600 transition-colors duration-300 shadow-lg shadow-indigo-500/30" 
                            onClick={toggleMobileMenu} variants={mobileLinkVariants}>
                            Hire Me
                        </motion.a>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </>
    );
};

// Hero Section
const HeroSection = React.forwardRef(({ profile }, ref) => {
    const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
    const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
    
    const handleMouseMove = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 768;

    const springConfig = { stiffness: 100, damping: 20 };
    const blob1X = useSpring(useTransform(mouseX, [0, windowWidth], [-15, 15]), springConfig);
    const blob1Y = useSpring(useTransform(mouseY, [0, windowHeight], [-15, 15]), springConfig);
    const blob2X = useSpring(useTransform(mouseX, [0, windowWidth], [25, -25]), springConfig);
    const blob2Y = useSpring(useTransform(mouseY, [0, windowHeight], [25, -25]), springConfig);
    const blob3X = useSpring(useTransform(mouseX, [0, windowWidth], [-20, 20]), springConfig);
    const blob3Y = useSpring(useTransform(mouseY, [0, windowHeight], [20, -20]), springConfig);

    const textVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 0.8, ease: "easeOut" } })
    };

    return (
        <motion.section 
            id="hero" ref={ref} onMouseMove={handleMouseMove}
            className="min-h-screen flex items-center justify-center bg-gray-900 text-white relative overflow-hidden"
        >
            <div className="absolute inset-0 z-0">
                <motion.div className="absolute top-0 left-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-30" style={{ x: blob1X, y: blob1Y }} animate={{ x: [0, 30, -20, 0], y: [0, -50, 20, 0], scale: [1, 1.1, 0.9, 1] }} transition={{ duration: 8, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}/>
                <motion.div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-30" style={{ x: blob2X, y: blob2Y }} animate={{ x: [0, -30, 40, 0], y: [0, 50, -20, 0], scale: [1, 0.9, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity, repeatType: "loop", ease: "easeInOut", delay: 2 }}/>
                <motion.div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-30" style={{ x: blob3X, y: blob3Y }} animate={{ x: [0, 40, -10, 0], y: [0, -30, 50, 0], scale: [1, 1.2, 0.8, 1] }} transition={{ duration: 9, repeat: Infinity, repeatType: "loop", ease: "easeInOut", delay: 4 }}/>
            </div>
            <div className="container mx-auto px-6 text-center z-10">
                <motion.h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4" variants={textVariants} initial="hidden" animate="visible" custom={0}>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">{profile.name || "M.T. Tasin"}</span>
                </motion.h1>
                <motion.p className="text-xl md:text-2xl text-gray-300 mb-8" variants={textVariants} initial="hidden" animate="visible" custom={1}>{profile.tagline || "Full Stack Developer"}</motion.p>
                <motion.p className="max-w-2xl mx-auto text-gray-400 mb-12" variants={textVariants} initial="hidden" animate="visible" custom={2}>Crafting immersive digital experiences with cutting-edge technology and a passion for motion.</motion.p>
                <motion.div variants={textVariants} initial="hidden" animate="visible" custom={3}>
                    <a href="#projects" className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-3 px-8 rounded-full hover:scale-105 transform transition-transform duration-300 ease-in-out inline-block shadow-lg shadow-indigo-500/40" data-hover>View My Work</a>
                </motion.div>
            </div>
            <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: 'reverse' }}>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </motion.div>
        </motion.section>
    );
});

// About Section
const AboutSection = React.forwardRef(({ profile, skills }, ref) => {
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
    const skillVariants = { hidden: { opacity: 0, x: -20 }, visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' } }) };
    
    return (
        <section id="about" ref={ref} className="py-20 bg-gray-900 text-white overflow-hidden">
            <div className="container mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }} className="text-center mb-12">
                    <h2 className="text-4xl font-bold">About Me</h2>
                    <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded"></div>
                </motion.div>
                <div className="grid md:grid-cols-5 gap-12 items-center">
                    <motion.div className="md:col-span-2" initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
                         <motion.div style={{y}} className="w-full h-auto p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-2xl">
                            <img src={profile.profile_image ? `${API_BASE_URL}${profile.profile_image}` : "https://placehold.co/400x400/16161d/ffffff?text=M.T.Tasin"} alt={profile.name} className="rounded-lg w-full" />
                         </motion.div>
                    </motion.div>
                    <motion.div className="md:col-span-3" initial={{ opacity: 0, x: 100 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
                        <p className="text-gray-300 mb-6 leading-relaxed">{profile.bio || "Passionate developer description here..."}</p>
                        <div className="flex flex-wrap gap-3">
                            {skills.map((skill, i) => (
                                <motion.span key={skill} className="bg-gray-800 text-indigo-400 text-sm font-medium px-4 py-2 rounded-full" custom={i} variants={skillVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} data-hover>
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
});

// Projects Section
const ProjectCard = ({ project }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
    const rotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);

    return (
        <motion.div ref={ref} style={{ scale, rotate }} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 ease-in-out group" data-hover>
            <div className="relative overflow-hidden">
                <img src={project.image ? `${API_BASE_URL}${project.image}` : "https://placehold.co/600x400/1a1a2e/6366f1?text=Project"} alt={project.title} className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute inset-0 bg-black/40"></div>
            </div>
            <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map(tech => ( <span key={tech} className="bg-gray-700 text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full">{tech}</span> ))}
                </div>
                <div className="flex justify-between items-center mt-6">
                    <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-500 transition-colors duration-300" data-hover>Live Demo</a>
                    <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" className="text-white hover:text-indigo-500 transition-colors duration-300" data-hover>GitHub</a>
                </div>
            </div>
        </motion.div>
    );
};

const ProjectsSection = React.forwardRef(({ projects }, ref) => {
    return (
        <section id="projects" ref={ref} className="py-20 bg-gray-900">
            <div className="container mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }} className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white">My Projects</h2>
                    <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded"></div>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">A selection of my work, showcasing my skills in creating modern web applications.</p>
                </motion.div>
                <div className="grid md:grid-cols-2 gap-12">
                    {projects.map((project) => ( <ProjectCard key={project.id} project={project} /> ))}
                </div>
            </div>
        </section>
    );
});


// Contact Section
const ContactSection = React.forwardRef(({ socialLinks }, ref) => {
    const iconVariants = { hover: { y: -5, scale: 1.1, color: '#6366f1', transition: { type: 'spring', stiffness: 300 } } };
    return (
        <section id="contact" ref={ref} className="py-20 bg-gray-900 text-white relative overflow-hidden">
             <div className="absolute inset-0 z-0">
                <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
                <div className="absolute -top-40 -left-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
            </div>
            <div className="container mx-auto px-6 text-center relative z-10">
                <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }}>
                    <h2 className="text-4xl font-bold">Get In Touch</h2>
                    <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded"></div>
                    <p className="text-gray-400 mt-6 max-w-lg mx-auto">I'm currently open to new opportunities and collaborations. Feel free to reach out!</p>
                    <a href="mailto:m.t.tasin20@gmail.com" className="inline-block mt-8 text-2xl font-semibold text-indigo-400 hover:text-indigo-500 transition-colors duration-300" data-hover>m.t.tasin20@gmail.com</a>
                    <div className="flex justify-center space-x-8 mt-12">
                        {socialLinks.map(link => {
                            const IconComponent = iconComponents[link.icon_name];
                            return IconComponent ? (
                                <motion.a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-400" variants={iconVariants} whileHover="hover" data-hover>
                                    <IconComponent size={24} />
                                </motion.a>
                            ) : null;
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
});

// Scroll Progress Indicator
const ScrollProgressIndicator = ({ sectionRefs }) => {
    const [activeSection, setActiveSection] = useState(sectionRefs[0].id);
    const dotRefs = useRef([]);
    const ballY = useSpring(0, { stiffness: 300, damping: 30 });

    useEffect(() => {
        const observers = sectionRefs.map((section) => {
            const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setActiveSection(section.id); } }, { root: null, rootMargin: "0px", threshold: 0.5 });
            if (section.ref.current) { observer.observe(section.ref.current); }
            return observer;
        });
        return () => observers.forEach((observer) => observer.disconnect());
    }, [sectionRefs]);

    useEffect(() => {
        const activeIndex = sectionRefs.findIndex((s) => s.id === activeSection);
        const activeDotEl = dotRefs.current[activeIndex];
        if (activeDotEl) { const newY = activeDotEl.offsetTop + activeDotEl.offsetHeight / 2 - 20 / 2; ballY.set(newY); }
    }, [activeSection, sectionRefs, ballY]);

    return (
        <div className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 h-64 flex-col items-center justify-between z-40">
            <div className="w-0.5 h-full bg-gray-700 absolute top-0 left-1/2 -translate-x-1/2" />
            <motion.div className="w-5 h-5 rounded-full bg-indigo-500 absolute top-0 left-1/2 -translate-x-1/2" style={{ y: ballY }}/>
            {sectionRefs.map((section, index) => (
                <a ref={(el) => (dotRefs.current[index] = el)} href={`#${section.id}`} key={section.id} data-hover className="w-6 h-6 rounded-full flex items-center justify-center z-10" aria-label={`Go to ${section.id} section`}>
                    <div className={`w-3 h-3 rounded-full transition-all duration-300 ${ activeSection === section.id ? 'bg-indigo-500 scale-125' : 'bg-gray-600' }`}></div>
                </a>
            ))}
        </div>
    );
};

// Footer & ScrollToTop Components
const Footer = () => (<footer className="bg-gray-900 text-gray-500 py-6 text-center"><p>&copy; {new Date().getFullYear()} M.T. Tasin. All Rights Reserved.</p></footer>)
const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => { const toggleVisibility = () => { if (window.pageYOffset > 300) { setIsVisible(true); } else { setIsVisible(false); } }; window.addEventListener('scroll', toggleVisibility); return () => window.removeEventListener('scroll', toggleVisibility); }, []);
    const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
    return (<AnimatePresence>{isVisible && (<motion.button onClick={scrollToTop} className="fixed bottom-8 right-8 bg-indigo-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-50" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }} whileHover={{ scale: 1.1, backgroundColor: '#4f46e5' }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} data-hover><ArrowUp size={24} /></motion.button>)}</AnimatePresence>);
};
const GlobalStyles = () => (<style jsx="true" global="true">{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');html{scroll-behavior:smooth;}body{font-family:'Inter',sans-serif;cursor:none;}@media (max-width:768px){body{cursor:auto;}}`}</style>);

// Main App Component
export default function App() {
    const [portfolioData, setPortfolioData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const heroRef = useRef(null);
    const aboutRef = useRef(null);
    const projectsRef = useRef(null);
    const contactRef = useRef(null);
    
    const sectionRefs = [ { id: 'hero', ref: heroRef }, { id: 'about', ref: aboutRef }, { id: 'projects', ref: projectsRef }, { id: 'contact', ref: contactRef }, ];

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/portfolio-data/`);
                if (!response.ok) { throw new Error('Network response was not ok'); }
                const data = await response.json();
                setPortfolioData(data);
            } catch (error) {
                console.error("Failed to fetch portfolio data:", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPortfolioData();
    }, []);
    
    useEffect(() => {
        const smoothScrollHandler = (e) => { e.preventDefault(); const targetElement = document.querySelector(e.currentTarget.getAttribute('href')); if (targetElement) { targetElement.scrollIntoView({ behavior: 'smooth' }); } };
        const anchors = document.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => anchor.addEventListener('click', smoothScrollHandler));
        return () => { anchors.forEach(anchor => anchor.removeEventListener('click', smoothScrollHandler)); };
    }, [portfolioData]); // Re-attach listeners after data loads

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
    
    if (isLoading) { return <LoadingScreen />; }
    if (error) { return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Error: Could not load portfolio data. Please ensure the backend server is running.</div>; }
    if (!portfolioData) { return null; }

    return (
        <div className="bg-gray-900 antialiased font-sans relative">
            <GlobalStyles />
            <AnimatedCursor />
            <ScrollProgressIndicator sectionRefs={sectionRefs} />
            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 origin-left z-50" style={{ scaleX }} />
            <Header />
            <main>
                <HeroSection ref={heroRef} profile={portfolioData.profile} />
                <AboutSection ref={aboutRef} profile={portfolioData.profile} skills={portfolioData.skills} />
                <ProjectsSection ref={projectsRef} projects={portfolioData.projects} />
                <ContactSection ref={contactRef} socialLinks={portfolioData.social_links} />
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    );
}
