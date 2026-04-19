import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Menu, 
  Star, 
  MessageCircle, 
  ShoppingBag,
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
  const [copiedText, setCopiedText] = useState<string|null>(null);

  const categories = [
    "All"
  ];

  const broadTerms = [
    "Artificial Intelligence",
    "Cyber Security",
    "Cloud Architecture",
    "Blockchain Expert",
    "Fintech Solutions"
  ];

  useEffect(() => {
    fetchProducts();
  }, [filter, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products?category=${filter}&q=${searchQuery}&page=1&limit=20`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
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
    const message = `Hello A.M.A Freelancing, I would like to Hire your service: ${product.title}. Please provide details on how to proceed.`;
    const whatsappUrl = `https://wa.me/9203054242038?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-green-500 selection:text-white">
      {/* Top Header Contact Bar */}
      <div className="bg-black text-white py-2 px-4 sticky top-0 z-[100] border-b border-white/5">
        <div className="max-w-[1600px] mx-auto flex justify-center sm:justify-between items-center text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em]">
          <div className="hidden lg:flex items-center gap-6">
            <span className="text-white font-black bg-green-500 px-2 py-0.5 rounded-sm">SITE TYPE: HIGH-DEMAND SERVICE BOUTIQUE</span>
            <span className="text-gray-500 italic">Global High-Demand Skills</span>
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
      <section className="pt-26 relative bg-black/90">
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

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold self-center mr-2">Broad Search Terms:</span>
              {broadTerms.map(term => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-4 py-2 border border-white/10 text-[10px] text-gray-300 uppercase tracking-widest hover:bg-green-500 hover:text-black hover:border-green-500 transition-all italic font-medium"
                >
                  {term}
                </button>
              ))}
            </div>

            <Button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} size="lg" className="rounded-none px-16 h-16 bg-white text-black hover:bg-green-500 hover:text-white transition-all font-black uppercase tracking-widest text-[12px] border-none shadow-2xl">
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
                {searchQuery ? `Searching for "${searchQuery}"` : "Elite High-Demand Skills"}
              </h2>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                A.M.A Verified Global Portfolio
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
                  <div className="relative aspect-square overflow-hidden bg-[#131921] border-b border-border flex items-center justify-center p-6 text-center">
                    <Link to={`/product/${product.id}`} className="absolute inset-0 z-10 block" />
                    <h4 className="text-3xl font-black italic tracking-widest text-white uppercase leading-tight">
                       {product.category}
                    </h4>
                    <span className="absolute bottom-6 text-green-500 text-[10px] font-bold tracking-[0.3em] uppercase">Premium Service Tier</span>
                    <Badge className="absolute top-4 left-4 rounded-none bg-green-500 text-black font-bold border-0 uppercase text-[8px] tracking-widest z-20">
                      A.M.A Verified
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
                          <ShoppingBag className="w-4 h-4" /> Hire Services
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

          {products.length === 0 && !loading && (
            <div className="text-center py-24 bg-gray-50 border border-dashed border-gray-300 px-6">
              <h3 className="text-2xl font-bold italic mb-2">No items matching your request</h3>
              <p className="text-muted-foreground font-light italic mb-8">The archive is vast, but "{searchQuery}" remains elusive. <br /> Try a broader search term.</p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {broadTerms.map(term => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="px-6 py-3 bg-white border border-border text-[10px] text-black uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all shadow-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
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
