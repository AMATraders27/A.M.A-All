import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Portfolio from "@/src/components/Portfolio";
import ProductDetails from "@/src/components/ProductDetails";
import OrderSuccess from "@/src/components/OrderSuccess";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
    </Router>
  );
}
