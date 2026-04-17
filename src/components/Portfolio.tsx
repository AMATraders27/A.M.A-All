import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Menu, 
  Star, 
  MessageCircle, 
  Phone, 
  Mail, 
  Copy,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  Video,
  Monitor,
  Code2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/src/types";

export default function Portfolio() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [copiedText, setCopiedText] = useState<string|null>(null);

  const categories = [
    "All"
  ];

  useEffect(() => {
    fetchProducts();
  }, [filter, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products?category=${filter}&q=${searchQuery}&page=1&limit=12`);
      const data = await response.json();
      setProducts(data);
      setPage(1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      // We explicitly send limit/offset or page. Since the server now supports 'page', we'll use that.
      const response = await fetch(`/api/products?category=${filter}&q=${searchQuery}&page=${nextPage}&limit=12`);
      const data = await response.json();
      
      // Filter out any potential duplicates by ID just in case
      setProducts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newItems = data.filter((p: Product) => !existingIds.has(p.id));
        return [...prev, ...newItems];
      });
      setPage(nextPage);
    } catch (error) {
      console.error("Error loading more:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleOrderViaWhatsApp = (product: Product) => {
    const message = `Hello A.M.A Freelancing, I am interested in your service: ${product.title}. Can we discuss the details?`;
    const whatsappUrl = `https://wa.me/9203054242038?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-green-500 selection:text-white">
      {/* Top Header Contact Bar */}
      <div className="bg-black text-white py-2 px-4 sticky top-0 z-[100] border-b border-white/5">
        <div className="max-w-[1600px] mx-auto flex justify-center sm:justify-between items-center text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em]">
          <div className="hidden sm:flex items-center gap-6">
            <span className="text-gray-500 italic">Professional Freelance Services</span>
            <div className="flex items-center gap-2 text-green-500">
              <ShieldCheck className="w-3 h-3" />
              <span>A.M.A Verified Provider</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer hover:text-green-500 transition-colors relative" onClick={() => copyToClipboard("9203054242038", "Phone")}>
              <Phone className="w-3 h-3" />
              <span>9203054242038</span>
              {copiedText === "Phone" && <span className="absolute -bottom-6 left-0 text-green-500 font-bold animate-bounce">Copied!</span>}
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:text-green-500 transition-colors relative" onClick={() => copyToClipboard("allahmuhammadmakkah786@gmail.com", "Email")}>
              <Mail className="w-3 h-3" />
              <span className="lowercase hidden md:inline">allahmuhammadmakkah786@gmail.com</span>
              <span className="md:hidden">Email A.M.A</span>
              {copiedText === "Email" && <span className="absolute -bottom-6 left-0 text-green-500 font-bold animate-bounce">Copied!</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-8 sm:top-10 w-full z-50 bg-[#131921] text-white">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-green-500 flex items-center justify-center text-white font-bold rounded italic">A</div>
            <span className="text-xl font-bold tracking-tight hidden sm:block italic">A.M.A Freelancing</span>
          </Link>
          
          <div className="flex-1 max-w-2xl relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search for any service from A.M.A..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 px-4 rounded-md text-black focus:outline-none placeholder:italic"
            />
          </div>

          <div className="flex items-center gap-8 ml-auto text-sm font-medium">
            {/* Direct Chat Removed as requested */}
          </div>
        </div>
        
        {/* Categories Bar */}
        <div className="bg-[#232f3e] h-10 flex items-center px-4 text-sm font-medium">
          <button 
            onClick={() => setFilter("All")}
            className={`flex items-center gap-1 hover:border border-white p-1 whitespace-nowrap ${filter === "All" ? 'border-white' : 'border-transparent'}`}
          >
            <Menu className="w-5 h-5" /> All Services
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-26 relative">
        <div className="absolute inset-0 h-[600px] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
        </div>
        
        <div className="max-w-[1500px] mx-auto px-4 relative pt-32 pb-24 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
          >
            <Badge className="bg-green-500 mb-6 rounded-none px-6 py-2 uppercase tracking-[0.3em] text-[10px]">Professional Excellence</Badge>
            <h1 className="text-6xl md:text-8xl font-black mb-8 italic tracking-tighter text-white">
              A.M.A <br /><span className="text-green-500 not-italic uppercase tracking-widest block mt-4 text-4xl md:text-5xl">FREELANCING</span>
            </h1>
            <p className="text-xl text-gray-400 mb-12 font-light italic max-w-xl mx-auto leading-relaxed">
              Bespoke digital solutions crafted with precision and professional integrity by A.M.A. 
            </p>
            <Button onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })} size="lg" className="rounded-none px-16 h-16 bg-white text-black hover:bg-green-500 hover:text-white transition-all font-black uppercase tracking-widest text-[12px] border-none shadow-2xl">
              Explore Services
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main Grid Section */}
      <div className="bg-background">
        {/* Product Grid */}
        <section className="max-w-[1500px] mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight italic">
                {searchQuery ? `Searching for "${searchQuery}"` : "Infinite Gigs"}
              </h2>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Exploring 10M+ Services in {filter}
              </p>
            </div>
            <div className="h-[2px] flex-1 bg-border mx-8 hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white group overflow-hidden border border-border hover:shadow-2xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Link to={`/product/${product.id}`} className="relative block h-full">
                      <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      {/* A.M.A Professional Watermark Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                        <span className="text-4xl font-black italic tracking-widest text-[#131921] rotate-[-45deg] select-none">A.M.A PROFESSIONAL</span>
                      </div>
                    </Link>
                    <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="secondary" className="rounded-full shadow-lg">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      </Button>
                    </div>
                    <Badge className="absolute top-4 left-4 rounded-none bg-black/80 text-white border-0">
                      {product.category}
                    </Badge>
                  </div>

                  <div className="p-6 flex-1 flex flex-col bg-black text-white">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
                        <h3 className="text-lg font-bold italic leading-tight line-clamp-2">{product.title}</h3>
                      </Link>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className={`w-3 h-3 ${i <= 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} />
                      ))}
                      <span className="text-[10px] text-gray-500 ml-2">(4.8/5)</span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-xs text-green-500 font-bold uppercase tracking-widest">Available for Hire</span>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <Button 
                          onClick={() => handleOrderViaWhatsApp(product)}
                          className="w-full rounded-none bg-green-600 hover:bg-green-700 text-white text-[10px] uppercase tracking-widest h-12 flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" /> Message Seller
                        </Button>
                        <Link to={`/product/${product.id}`} className="block">
                          <Button variant="outline" className="w-full rounded-none border-white/20 text-white hover:bg-white/10 text-[10px] uppercase tracking-widest h-10">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {products.length > 0 && (
            <div className="mt-16 flex flex-col items-center gap-6">
              <div className="flex items-center gap-4 w-full">
                <div className="h-[1px] flex-1 bg-border" />
                <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400">Deep Archive Access</p>
                <div className="h-[1px] flex-1 bg-border" />
              </div>
              <Button 
                onClick={loadMore}
                disabled={loading}
                className="rounded-none bg-black text-white px-12 h-14 uppercase tracking-[0.3em] font-bold text-xs hover:bg-primary transition-all shadow-xl disabled:opacity-50"
              >
                {loading ? "Discovering..." : "Load More Excellence"}
              </Button>
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="text-center py-24 bg-gray-50 border border-dashed border-gray-300">
              <h3 className="text-2xl font-bold italic mb-2">No items matching your request</h3>
              <p className="text-muted-foreground font-light italic">The archive is vast, but "${searchQuery}" remains elusive. <br /> Try a broader search term.</p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="bg-[#131921] text-white pt-12 pb-6 px-4">
          <div className="max-w-[1500px] mx-auto text-center border-b border-white/10 pb-12 mb-6">
            <div className="w-12 h-12 bg-green-500 flex items-center justify-center text-white font-bold rounded mx-auto mb-4 text-2xl italic">A</div>
            <h2 className="text-2xl font-bold tracking-widest uppercase italic mb-4">A.M.A Freelancing</h2>
            <div className="flex flex-wrap justify-center gap-8 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              <Link to="/" className="hover:text-green-500 transition-colors">Home</Link>
              <Link to="/products" className="hover:text-green-500 transition-colors">Services</Link>
              <Link to="/contact" className="hover:text-green-500 transition-colors">Contact A.M.A</Link>
            </div>
            <div className="mt-8 text-xs text-gray-500 space-y-2">
              <p>Phone: 9203054242038</p>
              <p>Email: allahmuhammadmakkah786@gmail.com</p>
            </div>
          </div>
          <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 uppercase tracking-widest">
            <p>© 2026 A.M.A Freelancing Network. Professional Pakistani Excellence.</p>
            <div className="flex gap-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Safety Guide</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
