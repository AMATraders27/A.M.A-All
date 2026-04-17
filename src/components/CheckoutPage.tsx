/// <reference types="vite/client" />
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "motion/react";
import { ArrowLeft, MessageCircle, Truck, CreditCard, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/src/CartContext";

const checkoutSchema = z.object({
  name: z.string().min(3, "Full Name is required"),
  phone: z.string().min(10, "Valid Phone Number is required"),
  email: z.string().email("Valid Email is required"),
  address: z.string().min(10, "Complete Address is required"),
  city: z.string().min(3, "City is required"),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema)
  });

  const handleWhatsAppOrder = () => {
    const values = getValues();
    const productList = cart.map(item => `${item.title} x${item.quantity} (PKR ${item.price.toLocaleString()})`).join("\n");
    const message = `New Order:\nName: ${values.name}\nPhone: ${values.phone}\nAddress: ${values.address}, ${values.city}\nProducts:\n${productList}\nTotal: PKR ${cartTotal.toLocaleString()}`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/923054224038?text=${encoded}`, "_blank");
  };

  const handleCODOrder = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: data,
          items: cart,
          total: cartTotal,
          method: "COD"
        })
      });

      if (response.ok) {
        clearCart();
        navigate("/order-success");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStripeOrder = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: data,
          items: cart
        })
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold italic mb-6">Your Cart is Empty</h2>
        <Link to="/">
          <Button className="rounded-none bg-primary text-white px-8 uppercase tracking-widest text-[10px]">Return to Boutique</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] pt-24 pb-24">
       <nav className="fixed top-0 w-full z-50 bg-[#131921] h-16 flex items-center px-4">
        <Link to="/cart" className="text-white flex items-center gap-2 hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Cart
        </Link>
      </nav>

      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white p-10 shadow-sm space-y-10">
            <div className="flex items-center gap-4 border-b border-border pb-6">
              <Sparkles className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold italic">Secure Checkout</h1>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Encryption level: Boutique Standard</p>
              </div>
            </div>

            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Full Name</label>
                <input 
                  {...register("name")}
                  className={`w-full p-3 border-b-2 bg-gray-50 focus:outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-border focus:border-primary'}`}
                  placeholder="e.g. Abdullah Kamal"
                />
                {errors.name && <p className="text-[10px] text-red-500 uppercase">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold">Phone</label>
                  <input 
                    {...register("phone")}
                    className={`w-full p-3 border-b-2 bg-gray-50 focus:outline-none transition-colors ${errors.phone ? 'border-red-500' : 'border-border focus:border-primary'}`}
                    placeholder="03xx xxxxxxx"
                  />
                  {errors.phone && <p className="text-[10px] text-red-500 uppercase">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold">City</label>
                  <input 
                    {...register("city")}
                    className={`w-full p-3 border-b-2 bg-gray-50 focus:outline-none transition-colors ${errors.city ? 'border-red-500' : 'border-border focus:border-primary'}`}
                    placeholder="e.g. Lahore"
                  />
                  {errors.city && <p className="text-[10px] text-red-500 uppercase">{errors.city.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Email</label>
                <input 
                  {...register("email")}
                  className={`w-full p-3 border-b-2 bg-gray-50 focus:outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-border focus:border-primary'}`}
                  placeholder="you@luxury.com"
                />
                {errors.email && <p className="text-[10px] text-red-500 uppercase">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold">Shipping Address</label>
                <textarea 
                  {...register("address")}
                  rows={3}
                  className={`w-full p-3 border-b-2 bg-gray-50 focus:outline-none transition-colors resize-none ${errors.address ? 'border-red-500' : 'border-border focus:border-primary'}`}
                  placeholder="Street, Area, Block..."
                />
                {errors.address && <p className="text-[10px] text-red-500 uppercase">{errors.address.message}</p>}
              </div>
            </form>
          </div>

          {/* Payment Methods */}
          <div className="space-y-8">
            <div className="bg-[#1a1a1a] text-white p-10 space-y-8">
              <h2 className="text-2xl font-bold italic border-b border-white/10 pb-6">Payment Method</h2>
              
              <div className="grid gap-4">
                <button 
                  onClick={handleSubmit(handleWhatsAppOrder)}
                  className="flex items-center gap-6 p-6 border border-white/10 hover:border-primary hover:bg-white/5 transition-all text-left group"
                >
                  <div className="w-12 h-12 bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold uppercase tracking-widest text-xs">Order via WhatsApp</p>
                    <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-widest">Connect with a Studio Concierge</p>
                  </div>
                </button>

                <button 
                  onClick={handleSubmit(handleCODOrder)}
                  disabled={isSubmitting}
                  className="flex items-center gap-6 p-6 border border-white/10 hover:border-primary hover:bg-white/5 transition-all text-left group"
                >
                  <div className="w-12 h-12 bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold uppercase tracking-widest text-xs">Cash on Delivery</p>
                    <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-widest">Pay when Legacy Arrives</p>
                  </div>
                  {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                </button>

                <button 
                  onClick={handleSubmit(handleStripeOrder)}
                  disabled={isSubmitting}
                  className="flex items-center gap-6 p-6 border border-white/10 hover:border-primary hover:bg-white/5 transition-all text-left group"
                >
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold uppercase tracking-widest text-xs">Card Payment (Stripe)</p>
                    <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-widest">Instant Global Transaction</p>
                  </div>
                   {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                </button>
              </div>

              <div className="pt-8 mt-8 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500">Order Total</span>
                  <span className="text-4xl font-bold tracking-tighter italic">PKR {cartTotal.toLocaleString()}</span>
                </div>
                <p className="text-[9px] text-center text-gray-500 uppercase tracking-widest italic">Includes +2000 PKR Studio Verification Fee</p>
              </div>
            </div>

            <div className="bg-white p-8 border border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center">
                By placing this order, you agree to the Rich Choice Elite Standards and Terms of Delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
