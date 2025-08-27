import { DebtCalculator } from "@/components/debt-calculator";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-2 py-4">
        <DebtCalculator />
      </div>
      <Footer />
    </main>
  );
}
