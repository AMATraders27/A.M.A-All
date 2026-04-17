import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Stripe from "stripe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ORDERS_FILE = path.join(process.cwd(), "orders.json");

// Define basic types
interface Order {
  id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  items: any[];
  total: number;
  method: "COD" | "STRIPE" | "WHATSAPP";
  status: "pending" | "completed";
  createdAt: string;
}

// Lazy initialize Stripe
let stripe: Stripe | null = null;
const getStripe = () => {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Data helpers
  const getOrders = (): Order[] => {
    if (!fs.existsSync(ORDERS_FILE)) return [];
    try {
      return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));
    } catch {
      return [];
    }
  };

  const saveOrder = (order: Order) => {
    const orders = getOrders();
    orders.push(order);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  };

  // API Routes
  app.get("/api/products", (req, res) => {
    const query = (req.query.q as string || "").toLowerCase();
    const categoryFilter = (req.query.category as string || "All");
    const limit = parseInt(req.query.limit as string) || 12;
    // Calculate offset based on 'page' if provided, otherwise use 'offset'
    let offset = parseInt(req.query.offset as string) || 0;
    const page = parseInt(req.query.page as string);
    if (!isNaN(page) && page > 0) {
      offset = (page - 1) * limit;
    }

    // Curated Freelance Services (Gigs)
    const baseGigs = [
      { 
        id: "g1", 
        title: "A.M.A will design a modern minimalist logo for your brand", 
        description: "Transform your brand identity with A.M.A's premium minimalist logo design. Our script focuses on architectural symmetry and timeless elegance, ensuring your business stands out in the global marketplace with a symbol that resonates across cultures.", 
        category: "Graphics", 
        images: [
          "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800",
          "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=800",
          "https://images.unsplash.com/photo-1626785774625-ddc7c82a1e50?q=80&w=800",
          "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800"
        ], 
        owner: "A.M.A Professional" 
      },
      { 
        id: "g2", 
        title: "A.M.A will develop a high-performance React application", 
        description: "Experience the pinnacle of frontend engineering. A.M.A crafts responsive, blazing-fast web applications using React and TypeScript. From complex state management to fluid Tailwind-driven UI, our scripts are written for scalability and seamless user experiences worldwide.", 
        category: "Programming", 
        images: [
          "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800",
          "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=800",
          "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800",
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800"
        ], 
        owner: "A.M.A Professional" 
      },
      { 
        id: "g3", 
        title: "A.M.A will write SEO optimized global content", 
        description: "Engage a worldwide audience with A.M.A's superior content writing. Our scripts combine linguistic precision with SEO architecture, driving organic traffic and positioning your brand as a global thought leader. We write for humans and optimize for algorithms.", 
        category: "Writing", 
        images: [
          "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800",
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800",
          "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=800",
          "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800"
        ], 
        owner: "A.M.A Professional" 
      },
      { 
        id: "g4", 
        title: "A.M.A will manage global social media growth", 
        description: "Navigate the digital landscape with A.M.A's strategic social media management. We deploy culturally-aware marketing scripts across Instagram, LinkedIn, and X, ensuring your brand story reaches every corner of the globe with maximum impact and engagement.", 
        category: "Marketing", 
        images: [
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800",
          "https://images.unsplash.com/photo-1611926653458-09294b319dd7?q=80&w=800",
          "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=800",
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800"
        ], 
        owner: "A.M.A Professional" 
      }
    ];

    // Helper to generate a "unique" gig based on index
    const generateGig = (index: number) => {
      const categories = [
        "Graphics", "Programming", "Writing", "Marketing", "Video", "Audio", 
        "Business", "Lifestyle", "Data", "AI Services", "Animation", "Editing",
        "Translation", "Legal", "Finance", "Virtual Assistant", "E-commerce"
      ];
      const items = [
        { cat: "Graphics", sub: "Minimalist Logo Design", keyword: "logo_minimal" },
        { cat: "Programming", sub: "Cloud Infrastructure Setup", keyword: "server_cloud" },
        { cat: "Writing", sub: "Professional Legal Research", keyword: "law_document" },
        { cat: "Marketing", sub: "Social Media Ads Suite", keyword: "ads_social" },
        { cat: "Video", sub: "Cinematic 4K Color Grading", keyword: "cinema_grading" },
        { cat: "Audio", sub: "Podcast Mastering & Edit", keyword: "audio_mastering" },
        { cat: "Business", sub: "Strategic Finance Planning", keyword: "finance_strategy" },
        { cat: "Lifestyle", sub: "Personal Fitness Coaching", keyword: "gym_fitness" },
        { cat: "Data", sub: "Advanced Machine Learning", keyword: "data_ml" },
        { cat: "AI Services", sub: "Custom AI Agent Integration", keyword: "ai_bot" },
        { cat: "Animation", sub: "Advanced 3D Character Rig", keyword: "animation_3d" },
        { cat: "Editing", sub: "High-end Wedding Video Edit", keyword: "wedding_edit" },
        { cat: "Translation", sub: "Universal Document Translate", keyword: "language_global" },
        { cat: "Legal", sub: "Global Intellectual Property", keyword: "legal_patent" },
        { cat: "Finance", sub: "International Tax Compliance", keyword: "tax_global" },
        { cat: "Virtual Assistant", sub: "Executive Virtual Support", keyword: "exec_assistant" },
        { cat: "E-commerce", sub: "Advanced Shopify Store Dev", keyword: "shopify_dev" },
        { cat: "Programming", sub: "Real-time Data Dashboard", keyword: "web_dashboard" },
        { cat: "Graphics", sub: "Bespoke Digital Art Collection", keyword: "digital_art" },
        { cat: "Writing", sub: "Technical System Architecture", keyword: "tech_spec" },
        { cat: "Marketing", sub: "Influencer Campaign Strategy", keyword: "influencer_marketing" },
        { cat: "Video", sub: "Commercial TV Ad Production", keyword: "commercial_video" },
        { cat: "Data", sub: "Big Data ETL Pipeline", keyword: "big_data" },
        { cat: "Business", sub: "Venture Capital Pitch Deck", keyword: "pitch_deck" },
        { cat: "Graphics", sub: "UI/UX Mobile App Interface", keyword: "mobile_ui" },
        { cat: "Programming", sub: "Decentralized Smart Contracts", keyword: "blockchain_solidity" },
        { cat: "Lifestyle", sub: "Luxury Interior Architecture", keyword: "interior_design" },
        { cat: "AI Services", sub: "Neural Voice Transformation", keyword: "ai_voice" },
        { cat: "Photography", sub: "Commercial Product Session", keyword: "product_photo" },
        { cat: "Animation", sub: "Explainer Motion Graphics", keyword: "motion_graphics" }
      ];
      
      const item = items[index % items.length];
      const cat = item.cat;
      const sub = item.sub;
      const key = item.keyword;

      const scripts = [
        `Empower your project with A.M.A's specialized ${cat.toLowerCase()} mastery. We deliver professional ${sub} crafted for the highest tier of global excellence.`,
        `A.M.A provides top-tier ${sub} results by combining technical rigor with creative vision. Our worldwide network ensures your ${cat.toLowerCase()} goals are achieved with distinction.`,
        `Revolutionize your workflow with A.M.A's premium ${cat.toLowerCase()} offerings. We specialize in accurate ${sub} delivery, serving high-profile global clients.`,
        `Superior ${sub} by A.M.A. Our refined English documentation and technical precision establish us as the leading choice for critical ${cat.toLowerCase()} initiatives.`,
        `Drive global impact with A.M.A's elite ${cat.toLowerCase()} experts. Our focus on ${sub} ensures every deliverable meets the peerless standards of the A.M.A brand.`
      ];

      const script = scripts[index % scripts.length];
      const owner = "A.M.A Professional";
      
      // We use index, category, and keyword to ensure the seed is highly unique
      const seedBase = `ama_v4_${cat}_${key}_idx${index}`;
      
      return {
        id: `ama_gig_${index}`,
        title: `A.M.A will provide expert ${sub} for your global brand #${index + 5000}`,
        description: `${script} This A.M.A service is precisely engineered for performance and global delivery. Includes multi-region support and A.M.A verified quality.`,
        category: cat,
        images: [
          `https://picsum.photos/seed/${seedBase}_p/1000/1000`,
          `https://picsum.photos/seed/${seedBase}_a1/1000/1000`,
          `https://picsum.photos/seed/${seedBase}_a2/1000/1000`,
          `https://picsum.photos/seed/${seedBase}_a3/1000/1000`
        ],
        owner: owner,
        isVideo: cat === "Video" || cat === "Animation" || cat === "Editing"
      };
    };

    let results: any[] = [];
    const baseGigsFiltered = baseGigs.filter(g => 
      (categoryFilter === "All" || g.category === categoryFilter) &&
      (g.title.toLowerCase().includes(query) || g.description.toLowerCase().includes(query))
    );

    // To ensure "Load More" works correctly, we generate from a consistent virtual list
    // and skip based on offset AFTER filtering.
    let pool: any[] = [...baseGigsFiltered];
    let i = 0;
    const targetCount = offset + limit;
    
    // We loop until we have enough matching items to satisfy the offset + limit
    // adding a safety break at 500 items
    while (pool.length < targetCount && i < 500) {
      const g = generateGig(i);
      // Ensure we don't pick a gig that's already in the baseGigsFiltered (by title)
      const isDuplicate = baseGigsFiltered.some(bg => bg.title === g.title);
      
      if (!isDuplicate && g.title.toLowerCase().includes(query) && (categoryFilter === "All" || g.category === categoryFilter)) {
        pool.push(g);
      }
      i++;
    }

    res.json(pool.slice(offset, offset + limit));
  });

  app.post("/api/orders", (req, res) => {
    const { customer, items, total, method } = req.body;
    
    if (!customer || !items || !total || !method) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      customer,
      items,
      total,
      method,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    saveOrder(newOrder);
    res.json({ success: true, orderId: newOrder.id });
  });

  app.post("/api/create-checkout-session", async (req, res) => {
    const { items, customer } = req.body;
    const stripeClient = getStripe();

    if (!stripeClient) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    try {
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items.map((item: any) => ({
          price_data: {
            currency: "pkr",
            product_data: {
              name: item.title,
              images: [item.image],
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${process.env.APP_URL || 'http://localhost:3000'}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/cart`,
        customer_email: customer.email,
        metadata: {
          customer_name: customer.name,
          customer_phone: customer.phone,
          customer_address: `${customer.address}, ${customer.city}`
        }
      });

      res.json({ id: session.id, url: session.url });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`A.M.A Freelancing Server running on http://localhost:${PORT}`);
  });
}

startServer();
