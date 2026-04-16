import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Phone, ArrowRight, ChevronDown, Sparkles } from "lucide-react";

const CATEGORIES = ["All", "Watches", "Footwear", "Jewelry", "Accessories"];

const INITIAL_PROJECTS = [
  {
    id: 1,
    title: "The Obsidian Chrono",
    category: "Watches",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
    brand: "A.M.A Studio",
    description: "Bespoke timepiece design featuring a matte obsidian finish and sapphire crystal."
  },
  {
    id: 2,
    title: "Velvet Strider",
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop",
    brand: "A.M.A Studio",
    description: "Hand-crafted Italian leather sneakers with a minimalist velvet accent."
  },
  {
    id: 3,
    title: "The Celestial Ring",
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop",
    brand: "A.M.A Studio",
    description: "Platinum band set with a rare celestial blue diamond, curated in our London studio."
  },
  {
    id: 4,
    title: "Midnight Navigator",
    category: "Watches",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1200&auto=format&fit=crop",
    brand: "A.M.A Studio",
    description: "A professional-grade diving watch engineered for precision and elegance."
  },
  {
    id: 5,
    title: "Azure Oxford",
    category: "Footwear",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1200&auto=format&fit=crop",
    brand: "A.M.A Studio",
    description: "Classic oxford silhouette reimagined with a contemporary azure patina."
  },
  {
    id: 6,
    title: "The Sovereign Cuff",
    category: "Jewelry",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop",
    brand: "A.M.A Studio",
    description: "18k gold cuff with intricate hand-engraved patterns, a studio masterpiece."
  }
];

// Simulate a massive database of 10M+ items
const GENERATED_PROJECTS = Array.from({ length: 200 }).map((_, i) => {
  const category = CATEGORIES[1 + (i % (CATEGORIES.length - 1))];
  return {
    id: 10 + i,
    title: `${category} Masterpiece No. ${1250 + i}`,
    category,
    image: `https://images.unsplash.com/photo-${1500000000000 + i}?q=80&w=1200&auto=format&fit=crop&sig=${i}`,
    image_fallback: `https://picsum.photos/seed/ama${i}/1200/1500`,
    brand: "A.M.A Studio",
    description: "An elite addition to our global archive of over 10 million bespoke luxury creations."
  };
});

const ALL_PROJECTS = [...INITIAL_PROJECTS, ...GENERATED_PROJECTS];

export default function Portfolio() {
  const [filter, setFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const filteredProjects = ALL_PROJECTS.filter(p => filter === "All" || p.category === filter);
  const visibleProjects = filteredProjects.slice(0, visibleCount);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 12);
      setIsLoading(false);
    }, 1000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch("https://formspree.io/f/xgorojaa", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setFormStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      setFormStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-8 h-24 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-xl">A</div>
            <div className="text-2xl font-heading font-light tracking-[0.2em] uppercase">
              A.M.A DESIGNERS
            </div>
          </motion.div>
          <div className="hidden lg:flex items-center gap-12 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <a href="#archive" className="hover:text-primary transition-colors relative group">Archive</a>
            <button onClick={() => setFilter("Watches")} className="hover:text-primary transition-colors relative group uppercase">Watches</button>
            <button onClick={() => setFilter("Footwear")} className="hover:text-primary transition-colors relative group uppercase">Footwear</button>
            <a href="#partnership" className="hover:text-primary transition-colors relative group">Partnership</a>
            <a href="#contact" className="hover:text-primary transition-colors relative group">Contact</a>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end text-[10px] uppercase tracking-widest opacity-60">
              <span>Main Office</span>
              <span className="font-bold text-foreground">Mayfair, London</span>
            </div>
            <Button className="rounded-none px-10 h-12 bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-500 uppercase tracking-widest text-[11px]">
              Inquiry
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,255,0.15),transparent_70%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,0,0,0.1),transparent_50%)]" />
          <Sparkles className="w-full h-full text-primary/20" />
        </div>
        <div className="max-w-[1600px] mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-12 bg-primary shadow-[0_0_10px_rgba(255,0,0,0.8)]" />
              <Badge variant="outline" className="px-6 py-1.5 rounded-none uppercase tracking-[0.4em] text-[10px] border-primary/50 text-primary shadow-[0_0_15px_rgba(255,0,0,0.3)]">
                10,000,000+ Bespoke Creations
              </Badge>
            </div>
            <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-heading font-light italic leading-[0.85] tracking-tighter mb-12">
              PRODUCT <br />
              <span className="text-primary not-italic font-bold drop-shadow-[0_0_30px_rgba(255,0,0,0.5)]">MASTERY.</span>
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
              <div className="lg:col-span-5">
                <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed">
                  Headquartered in London, A.M.A Designers Studio manages a global 
                  archive of over 10 million luxury products. We define the 
                  absolute pinnacle of artistic and technical excellence.
                </p>
              </div>
              <div className="lg:col-span-7 flex flex-wrap gap-8 justify-end">
                <div className="text-right group">
                  <div className="text-4xl font-heading font-bold text-secondary group-hover:text-primary transition-colors duration-500">10M+</div>
                  <div className="text-[10px] uppercase tracking-widest opacity-50">Archived Designs</div>
                </div>
                <div className="text-right group">
                  <div className="text-4xl font-heading font-bold text-secondary group-hover:text-primary transition-colors duration-500">LONDON</div>
                  <div className="text-[10px] uppercase tracking-widest opacity-50">Main Headquarters</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Partnership Section */}
      <section id="partnership" className="py-32 px-8 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-background to-primary/20 opacity-50" />
        <div className="max-w-[1600px] mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <Badge variant="outline" className="mb-8 px-6 py-1.5 rounded-none uppercase tracking-[0.4em] text-[10px] border-primary/30 text-primary">
                Brand Partnership
              </Badge>
              <h2 className="text-5xl md:text-7xl font-heading font-light italic mb-10 leading-tight">
                Elevating Global <br />
                <span className="text-primary not-italic font-bold tracking-tighter">IDENTITIES.</span>
              </h2>
              <div className="space-y-8 text-xl font-light opacity-80 leading-relaxed">
                <p>
                  In the world of ultra-luxury, mediocrity is the enemy. A.M.A Designers 
                  doesn't just create visuals; we engineer desire. Our London-based 
                  creative engine is dedicated to the world's most elite brands.
                </p>
                <p className="text-primary font-medium italic">
                  "We don't follow trends. We define the standard by which all others are measured."
                </p>
                <p>
                  Join an exclusive circle of global leaders who trust A.M.A Designers 
                  to protect and project their legacy across every continent.
                </p>
              </div>
              <Button size="lg" className="mt-12 bg-primary text-primary-foreground hover:bg-secondary hover:shadow-[0_0_30px_rgba(0,0,255,0.5)] transition-all duration-500 rounded-none h-16 px-12 text-[12px] uppercase tracking-[0.3em] font-bold">
                Partner With Us
              </Button>
            </div>
            <div className="relative aspect-square group">
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop" 
                alt="Luxury Office" 
                className="object-cover w-full h-full opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 border-[20px] border-primary/20 m-8 pointer-events-none group-hover:border-secondary/30 transition-colors duration-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="archive" className="py-32 px-8 bg-secondary/50">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-8">
            <div className="flex flex-col">
              <h2 className="text-5xl md:text-6xl font-heading font-light italic">The Global Archive</h2>
              <p className="text-muted-foreground mt-4 uppercase tracking-[0.2em] text-[10px]">Displaying curated selection from 10,000,000+ items</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setFilter(cat); setVisibleCount(12); }}
                  className={`px-8 py-3 text-[10px] uppercase tracking-[0.2em] transition-all border ${
                    filter === cat 
                    ? "bg-primary border-primary text-primary-foreground" 
                    : "bg-transparent border-border hover:border-primary text-muted-foreground hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {visibleProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
                >
                  <div className="group relative aspect-[3/4] overflow-hidden bg-card border border-border hover:border-secondary/50 transition-colors duration-500">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // @ts-ignore
                        if (project.image_fallback && target.src !== project.image_fallback) {
                          // @ts-ignore
                          target.src = project.image_fallback;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500 flex flex-col justify-end p-8 text-white">
                      <div className="text-[9px] uppercase tracking-[0.3em] text-primary mb-2 font-bold group-hover:text-secondary transition-colors">{project.brand}</div>
                      <h3 className="text-2xl font-heading font-light italic mb-3 group-hover:translate-x-2 transition-transform">{project.title}</h3>
                      <p className="text-xs opacity-70 mb-6 line-clamp-2">{project.description}</p>
                      <Button variant="outline" className="w-fit rounded-none border-primary/30 h-10 hover:bg-primary hover:text-white hover:border-primary uppercase tracking-widest text-[9px] transition-all">
                        View Details
                      </Button>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-secondary/80 backdrop-blur-md border-secondary/20 text-white rounded-none uppercase tracking-widest text-[8px] px-2 shadow-[0_0_10px_rgba(0,0,255,0.5)]">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {visibleCount < filteredProjects.length && (
            <div className="mt-24 flex flex-col items-center gap-6">
              <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground opacity-50">
                Endless Archive • {ALL_PROJECTS.length} Selected • 10M+ Total
              </p>
              <Button 
                onClick={handleLoadMore} 
                disabled={isLoading}
                variant="outline" 
                className="rounded-none px-16 h-16 border-primary/30 hover:border-primary text-[12px] uppercase tracking-[0.3em] group"
              >
                {isLoading ? "Accessing Archive..." : (
                  <>
                    Load More Items <ChevronDown className="ml-2 w-4 h-4 transition-transform group-hover:translate-y-1" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-40 px-8 border-t border-border relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-primary/5 -z-10 skew-y-3" />
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
            <div>
              <Badge variant="outline" className="mb-8 px-6 py-1.5 rounded-none uppercase tracking-[0.4em] text-[10px] border-primary/30 text-primary">
                Global Concierge
              </Badge>
              <h2 className="text-6xl md:text-8xl font-heading font-light italic mb-12 leading-[0.9]">
                Connect with <br />
                <span className="text-primary not-italic font-bold">LONDON HQ</span>
              </h2>
              <div className="space-y-12 mt-16">
                <div className="flex items-start gap-8 group">
                  <div className="w-16 h-16 rounded-none bg-primary flex items-center justify-center text-primary-foreground transition-transform group-hover:rotate-12">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Global Inquiries</div>
                    <a href="mailto:allahmuhammadmakkah786@gmail.com" className="text-2xl font-light hover:text-primary transition-colors">
                      allahmuhammadmakkah786@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-8 group">
                  <div className="w-16 h-16 rounded-none bg-primary flex items-center justify-center text-primary-foreground transition-transform group-hover:rotate-12">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Direct Line</div>
                    <a href="tel:03054224038" className="text-2xl font-light hover:text-primary transition-colors">
                      03054224038
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-8 group">
                  <div className="w-16 h-16 rounded-none bg-primary flex items-center justify-center text-primary-foreground transition-transform group-hover:rotate-12">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Main Studio</div>
                    <div className="text-2xl font-light">Mayfair, London, W1K</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card p-12 md:p-20 border border-border shadow-2xl relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles className="w-24 h-24" />
              </div>
              {formStatus === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-8"
                >
                  <div className="w-24 h-24 rounded-none bg-primary flex items-center justify-center text-primary-foreground">
                    <Sparkles className="w-12 h-12" />
                  </div>
                  <h3 className="text-4xl font-heading italic">Inquiry Received</h3>
                  <p className="text-muted-foreground max-w-md">
                    Our London HQ concierge has received your vision. We will reach out to you within 24 hours to discuss the next steps of your ultra-luxury project.
                  </p>
                  <Button 
                    onClick={() => setFormStatus("idle")}
                    variant="outline" 
                    className="rounded-none uppercase tracking-widest px-12"
                  >
                    Send Another
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Your Name</label>
                      <input 
                        name="name"
                        type="text" 
                        required
                        className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-primary transition-colors text-lg font-light" 
                        placeholder="Full Name" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Email Address</label>
                      <input 
                        name="email"
                        type="email" 
                        required
                        className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-primary transition-colors text-lg font-light" 
                        placeholder="email@luxury.com" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Brand / Project</label>
                    <input 
                      name="brand"
                      type="text" 
                      className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-primary transition-colors text-lg font-light" 
                      placeholder="Project Vision" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Message</label>
                    <textarea 
                      name="message"
                      rows={4} 
                      required
                      className="w-full bg-transparent border-b border-border py-3 focus:outline-none focus:border-primary transition-colors resize-none text-lg font-light" 
                      placeholder="Describe your ultra-luxury requirements..."
                    ></textarea>
                  </div>
                  {formStatus === "error" && (
                    <p className="text-primary text-xs uppercase tracking-widest">Something went wrong. Please try again or contact us directly.</p>
                  )}
                  <Button 
                    type="submit"
                    disabled={formStatus === "submitting"}
                    size="lg" 
                    className="w-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground rounded-none h-20 text-[14px] uppercase tracking-[0.4em] font-bold transition-all duration-700"
                  >
                    {formStatus === "submitting" ? "Transmitting..." : "Send Global Inquiry"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-border bg-secondary/30">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-2xl">A</div>
              <div className="text-3xl font-heading font-light tracking-[0.3em] uppercase">A.M.A DESIGNERS</div>
            </div>
            <div className="flex flex-wrap gap-12 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="flex items-center"><span className="text-primary mr-3">●</span>Ultra Luxury Standards</span>
              <span className="flex items-center"><span className="text-primary mr-3">●</span>Global Brand Excellence</span>
              <span className="flex items-center"><span className="text-primary mr-3">●</span>Bespoke Design Solutions</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-border/50 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <div>&copy; 2024 A.M.A Designers Portfolio. All Rights Reserved.</div>
            <div className="flex gap-10">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
