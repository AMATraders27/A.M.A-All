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

    // Curated High-Demand Global Services
    const baseGigs = [
      { 
        id: "hd1", 
        title: "A.M.A will build a custom Enterprise AI Solution", 
        description: "Harness the power of Large Language Models with A.M.A's expertise. We integrate custom AI agents and neural processing into your existing workflow, specializing in global-scale automation and intelligent data synthesis for the modern world.", 
        category: "AI & Tech", 
        images: [
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200&h=1200",
          "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=1200&h=1200"
        ], 
        owner: "A.M.A Professional" 
      },
      { 
        id: "hd2", 
        title: "A.M.A will architect your Global Cloud Infrastructure", 
        description: "Scalable reaching every continent. A.M.A provides multi-cloud solutions (AWS, Azure, GCP) with high-availability architectures and zero-trust security protocols, built for the modern worldwide demand.", 
        category: "Cloud & Security", 
        images: [
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200&h=1200",
          "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=1200&h=1200"
        ], 
        owner: "A.M.A Professional" 
      }
    ];

    // Helper to generate a "unique" gig based on index
    const generateGig = (index: number) => {
      const highDemandItems = [
        { cat: "AI & Tech", sub: "NLP & LLM Integration", keyword: "artificial_intelligence", id: "photo-1677442136019-21780ecad995" },
        { cat: "Cloud & Security", sub: "Global Cyber Security Audit", keyword: "cybersecurity", id: "photo-1544197150-b99a580bb7a8" },
        { cat: "Development", sub: "Scalable Fintech Platforms", keyword: "fintech", id: "photo-1551288049-bebda4e38f71" },
        { cat: "Data Science", sub: "Predictive Analytics Architecture", keyword: "data_science", id: "photo-1551288049-bebda4e38f71" },
        { cat: "AI & Tech", sub: "Computer Vision Systems", keyword: "ai_vision", id: "photo-1593508512255-86ab42a8e620" },
        { cat: "Development", sub: "Web3 Smart Contract Security", keyword: "blockchain", id: "photo-1639762681485-074b7f938ba0" },
        { cat: "Design", sub: "High-Tier Digital Product Strategy", keyword: "ux_design", id: "photo-1581291518633-83b4ebd1d83e" },
        { cat: "AI & Tech", sub: "Generative AI Artistry", keyword: "neural_art", id: "photo-1593508512255-86ab42a8e620" }
      ];
      
      const item = highDemandItems[index % highDemandItems.length];
      const cat = item.cat;
      const sub = item.sub;
      const imgId = item.id;

      const scripts = [
        `Empower your global enterprise with A.M.A's specialized ${cat} mastery. We deliver high-demand ${sub} solutions tailored for modern excellence.`,
        `A.M.A delivers precision-engineered ${sub} that drives worldwide growth. Our elite network ensures your ${cat} requirements are met with peerless quality.`,
        `Experience the future of global services with A.M.A's high-demand ${cat} suite. We specialize in accurate ${sub} delivery for international brands.`,
        `Superior ${sub} by A.M.A. Our refined technical execution and strategic insight make us the leading partner for critical ${cat} projects globally.`
      ];

      const script = scripts[index % scripts.length];
      const owner = "A.M.A Professional";
      
      // Use direct Unsplash IDs for maximum stability
      const images = [
        `https://images.unsplash.com/${imgId}?auto=format&fit=crop&q=80&w=1200&h=1200`,
        `https://images.unsplash.com/photo-1510511459019-5dee995d3ff4?auto=format&fit=crop&q=80&w=1200&h=1200`
      ];

      return {
        id: `ama_hd_${index}`,
        title: `A.M.A will provide elite ${sub} service #${index + 7000}`,
        description: `${script} This A.M.A service is precisely engineered for high-demand performance and global delivery. Includes A.M.A verified global quality standards.`,
        category: cat,
        images: images,
        owner: owner,
        isVideo: false,
        sub: sub
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
