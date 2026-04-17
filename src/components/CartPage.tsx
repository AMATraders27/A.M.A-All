import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/src/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <div className="min-h-screen bg-[#f3f3f3] pb-24">
      <nav className="fixed top-0 w-full z-50 bg-[#131921] h-16 flex items-center px-4">
        <Link to="/" className="text-white flex items-center gap-2 hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Boutique
        </Link>
      </nav>

      <div className="max-w-[1200px] mx-auto px-4 mt-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* List */}
          <div className="flex-1 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold italic mb-8 border-b border-border pb-4">Shopping Cart</h1>
            
            {cart.length === 0 ? (
              <div className="text-center py-24 space-y-6">
                <div className="w-24 h-24 bg-gray-50 flex items-center justify-center rounded-full mx-auto">
                  <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-xl font-light italic">Your selection is currently empty.</h2>
                <Link to="/">
                  <Button className="rounded-none bg-black text-white px-12 uppercase tracking-widest text-[10px]">
                    Continue Searching
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-border last:border-0"
                    >
                      <div className="w-32 h-32 bg-gray-50 border border-border flex-shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-contain p-2" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-lg font-bold italic leading-tight">{item.title}</h3>
                          <p className="text-xl font-bold text-primary">PKR {item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center border border-border rounded">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center text-sm font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Summary */}
          {cart.length > 0 && (
            <div className="w-full lg:w-[350px] bg-white p-8 shadow-sm h-fit sticky top-24">
              <h2 className="text-xl font-bold italic mb-6">Order Summary</h2>
              <div className="space-y-4 text-sm mb-8">
                <div className="flex justify-between text-muted-foreground">
                  <span>Items ({cartCount})</span>
                  <span>PKR {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold uppercase text-[10px]">Free</span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between">
                  <span className="text-lg font-bold italic">Subtotal</span>
                  <span className="text-2xl font-bold text-primary">PKR {cartTotal.toLocaleString()}</span>
                </div>
              </div>
              <Link to="/checkout" className="block w-full">
                <Button className="w-full h-14 rounded-none bg-primary hover:bg-red-700 text-white font-bold uppercase tracking-[0.3em] text-[10px] group">
                  Finalize Checkout <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <div className="mt-8 pt-8 border-t border-border space-y-4 opacity-50">
                <p className="text-[9px] uppercase tracking-widest text-center leading-relaxed">
                  Trusted by 10,000+ Luxury Clients <br /> Secure Encryption Active
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
