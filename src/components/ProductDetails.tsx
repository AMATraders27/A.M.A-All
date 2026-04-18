import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Star, Share2, ShieldCheck, Truck, RefreshCcw, MessageCircle, Phone, Mail, Copy, Monitor, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/src/types";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [copiedText, setCopiedText] = useState<string|null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        const p = data.find((item: any) => item.id === id);
        setProduct(p);
        
        if (p) {
          // Fetch related products from same category
          fetch(`/api/products?category=${encodeURIComponent(p.category)}&limit=4`)
            .then(res => res.json())
            .then(related => {
              setRelatedProducts(related.filter((r: Product) => r.id !== p.id));
            });
        }
      });
  }, [id]);

  const handleOrderViaWhatsApp = () => {
    if (!product) return;
    const message = `Hello A.M.A Freelancing!\nI am viewing your gig: ${product.title}\nCategory: ${product.category}\n\nI would like to discuss this service further with A.M.A.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/9203054242038?text=${encoded}`, "_blank");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  if (!product) return <div className="min-h-screen flex items-center justify-center">Loading Service from A.M.A...</div>;

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-24 pb-12">
      <nav className="fixed top-0 w-full z-50 bg-[#131921] h-16 flex items-center px-4 justify-between">
        <Link to="/" className="text-white flex items-center gap-2 hover:text-green-500 transition-colors uppercase text-xs font-bold tracking-widest">
          <ArrowLeft className="w-5 h-5" /> A.M.A Portfolio
        </Link>
        <div className="flex items-center gap-6 text-white/60 text-[10px] font-medium uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors relative" onClick={() => copyToClipboard("9203054242038", "Phone")}>
            <Phone className="w-3 h-3" />
            <span>9203054242038</span>
            {copiedText === "Phone" && <span className="absolute -top-6 left-0 text-green-500 font-bold animate-bounce">Copied!</span>}
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors relative" onClick={() => copyToClipboard("allahmuhammadmakkah786@gmail.com", "Email")}>
            <Mail className="w-3 h-3" />
            <span className="lowercase">allahmuhammadmakkah786@gmail.com</span>
            {copiedText === "Email" && <span className="absolute -top-6 left-0 text-green-500 font-bold animate-bounce">Copied!</span>}
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-4 mt-8">
        <div className="bg-white p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 shadow-sm">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-[#131921] border border-border overflow-hidden">
              <img 
                src={product.images[activeImage]} 
                alt={product.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex gap-4">
              {product.images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-24 h-24 border-2 transition-all ${activeImage === i ? 'border-green-500' : 'border-border grayscale hover:grayscale-0'}`}
                >
                  <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="border-primary text-primary rounded-none uppercase tracking-[0.2em] text-[10px] px-4">
                  {product.category}
                </Badge>
                <div className="flex gap-4 text-gray-400">
                  <Share2 className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
                </div>
              </div>
              <h1 className="text-4xl font-bold italic tracking-tighter mb-4">{product.title}</h1>
              <div className="flex items-center gap-2">
                <div className="flex gap-1 text-yellow-500 fill-yellow-500">
                  <Star className="w-4 h-4" /><Star className="w-4 h-4" /><Star className="w-4 h-4" /><Star className="w-4 h-4" /><Star className="w-4 h-4 text-gray-300" />
                </div>
                <span className="text-sm font-medium text-gray-500">(24 Reviews)</span>
              </div>
            </div>

            <div className="py-8 border-y border-border">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-bold text-green-500">A.M.A Global Pricing</span>
              </div>
              <p className="text-xs text-green-600 font-bold uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> A.M.A Verified Worldwide Provider
              </p>
            </div>

            <div className="bg-gray-50 p-6 border-l-4 border-green-500">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-4 text-gray-400 italic">Professional Service Script</h3>
              <p className="text-gray-800 leading-relaxed font-light text-xl italic selection:bg-green-100">
                "{product.description}"
              </p>
              <div className="mt-6 flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <span className="flex items-center gap-1"><Monitor className="w-3 h-3" /> Digital Precision</span>
                <span className="flex items-center gap-1"><Code2 className="w-3 h-3" /> Global Standards</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 opacity-60">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-8 h-8 text-green-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">Express<br />Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 border-x border-border">
                <ShieldCheck className="w-8 h-8 text-green-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">A.M.A<br />Verified</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RefreshCcw className="w-8 h-8 text-green-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">24/7<br />Support</span>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <Button 
                onClick={handleOrderViaWhatsApp}
                className="w-full h-16 rounded-none bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-[0.3em] text-[12px] shadow-xl flex items-center justify-center gap-3"
              >
                Contact A.M.A <MessageCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Similar section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold italic mb-8 border-l-4 border-green-500 pl-4">Recommended Services in {product.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.length > 0 ? (
              relatedProducts.map(rp => (
                <Link key={rp.id} to={`/product/${rp.id}`} className="bg-white overflow-hidden border border-border group hover:shadow-xl transition-all p-4">
                  <div className="aspect-square bg-gray-50 mb-4 overflow-hidden">
                    <img src={rp.images[0]} alt={rp.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="font-bold italic truncate text-sm mb-2">{rp.title}</h3>
                  <p className="text-green-500 font-bold uppercase text-[10px]">Hire Expert</p>
                </Link>
              ))
            ) : (
              <div className="col-span-full bg-white p-12 border border-border text-center">
                <p className="text-gray-400 italic font-light">Loading more archival excellence for you...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
