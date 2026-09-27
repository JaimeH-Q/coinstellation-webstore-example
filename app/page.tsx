"use client";

import React, { useState } from "react";
import { Shield, Package, Flame, Zap, Sparkles, Gem, Check, AlertCircle, X as CloseIcon } from "lucide-react";
import {
  Topbar,
  HeaderBanner,
  ProductSection,
  AboutSection,
  Sidebar,
  ProductModal,
  PaymentModal,
  Footer,
  MinecraftParticles,
  CrateSimulatorModal,
  PlayerConnectModal,
} from "@/components";
import {
  ALL_PRODUCTS,
  CRYPTO_RATES,
} from "@/data/mock-data";
import { Product, CartItem, PaymentDetails } from "@/types/webstore";
import { createPayment } from "@/lib/payment-service";

export default function WebstorePage() {
  const [currency, setCurrency] = useState("USD");
  const [username, setUsername] = useState("Notch");
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "demo-1",
      name: "Rango MVP+ COIN-MASTER",
      price: 14.99,
      rarity: "legendary",
    },
  ]);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Crate Simulator Modal State
  const [crateProduct, setCrateProduct] = useState<Product | null>(null);
  const [isCrateModalOpen, setIsCrateModalOpen] = useState(false);

  // Player Profile Modal State
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);

  // Stellar / Coinstellation Payment Modal State
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // Active section for sidebar highlights
  const [activeSection, setActiveSection] = useState("ranks");

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Products by Category
  const rankProducts = ALL_PRODUCTS.filter((p) => p.category === "ranks");
  const crateProducts = ALL_PRODUCTS.filter((p) => p.category === "crates");
  const spawnerProducts = ALL_PRODUCTS.filter((p) => p.category === "spawners");
  const boosterProducts = ALL_PRODUCTS.filter((p) => p.category === "boosters");
  const cosmeticProducts = ALL_PRODUCTS.filter((p) => p.category === "cosmetics");
  const coinProducts = ALL_PRODUCTS.filter((p) => p.category === "coins");

  // Cart actions
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => [
      ...prev,
      {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        rarity: product.rarity,
        minecraftIcon: product.minecraftIcon,
      },
    ]);
    showToast(`¡"${product.name}" añadido al carrito!`);
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    showToast("Item eliminado del carrito");
  };

  // Open Product Info
  const handleOpenInfo = (product: Product) => {
    setActiveModalProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveModalProduct(null);
  };

  // Open Crate Demo
  const handleOpenCrateDemo = (product: Product) => {
    setCrateProduct(product);
    setIsCrateModalOpen(true);
  };

  // Save Player Profile
  const handleSavePlayer = (newUsername: string) => {
    setUsername(newUsername);
    showToast(`Perfil sincronizado: ${newUsername}`);
  };

  // Smooth Navigation
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Checkout Handler: Coinstellation / Stellar Payment Integration
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    const rateInfo = CRYPTO_RATES[currency] || CRYPTO_RATES.USD;
    const total = cartItems.reduce((acc, item) => acc + item.price, 0);
    const convertedTotal = total * rateInfo.ratePerUSD;

    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const orderNumber = Math.floor(1000 + Math.random() * 9000);
      const res = await createPayment({
        amount: total.toFixed(2),
        currency: "XLM",
        description: `Orden #${orderNumber} de ${username} (${cartItems.length} ítems)`,
      });

      if (res && res.payment) {
        setPaymentAmount(total);
        setPaymentDetails(res.payment);
        setIsPaymentModalOpen(true);
      } else {
        throw new Error("Respuesta inválida de la pasarela de pagos.");
      }
    } catch (err: any) {
      console.warn("API de pagos Coinstellation:", err);
      // Fallback modal demo o alerta informativa
      const formattedTotal = rateInfo.isCrypto
        ? `${convertedTotal.toFixed(rateInfo.symbol === "BTC" ? 6 : rateInfo.symbol === "ETH" ? 5 : rateInfo.symbol === "SOL" ? 3 : 2)} ${rateInfo.symbol}`
        : `${rateInfo.icon}${convertedTotal.toFixed(2)} ${rateInfo.symbol}`;

      alert(
        `⚡ Pasarela de pago segura para ${username}\n\nTotal: ${formattedTotal}\nMétodo: ${rateInfo.name}\nEntrega: Segundos tras la confirmación de la red.`
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Background Animated Particles (Subtle and Behind) */}
      <MinecraftParticles />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-[#0e1220]/95 px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-2xl shadow-emerald-500/20 backdrop-blur-md animate-in slide-in-from-bottom-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-black">
            <Check className="h-3.5 w-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Topbar: Nav, Multi-Currency Selector, Player Skin Profile */}
      <Topbar
        selectedCurrency={currency}
        onCurrencyChange={setCurrency}
        username={username}
        onLoginClick={() => setIsPlayerModalOpen(true)}
      />

      {/* Hero Header: Title framed by floating 3D Minecraft cubes & Server IP */}
      <HeaderBanner
        title="CRAFTNETWORK"
        serverIp="PLAY.CRAFTNETWORK.NET"
      />

      {/* Banner de error si la pasarela backend no responde */}
      {checkoutError && (
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-4">
          <div className="flex items-start justify-between gap-3 rounded-xl border border-red-500/40 bg-red-950/50 p-4 text-red-200 shadow-xl backdrop-blur-xs">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-300">
                  Aviso de Pasarela de Pagos
                </h4>
                <p className="mt-1 text-xs text-red-200/90 leading-relaxed font-mono">
                  {checkoutError}
                </p>
              </div>
            </div>
            <button
              onClick={() => setCheckoutError(null)}
              className="text-red-400 hover:text-white cursor-pointer shrink-0"
              aria-label="Cerrar alerta"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_310px]">
          {/* Left Column: Minecraft Store Sections */}
          <main className="flex flex-col gap-6">
            {/* 1. RANGOS VIP & EXCLUSIVOS */}
            <ProductSection
              id="ranks"
              title="Rangos VIP & Exclusivos"
              subtitle="Beneficios permanentes, multiplicadores de economía y comandos exclusivos"
              icon={<Shield className="h-5 w-5 text-cyan-400" />}
              products={rankProducts}
              selectedCurrency={currency}
              onOpenInfo={handleOpenInfo}
              onAddToCart={handleAddToCart}
            />

            {/* 2. LLAVES & CRATES CÓSMICAS */}
            <ProductSection
              id="crates"
              title="Llaves & Crates Cósmicas"
              subtitle="Cajas misteriosas con sets Netherite y armas legendarias con apertura animada"
              icon={<Package className="h-5 w-5 text-fuchsia-400" />}
              products={crateProducts}
              selectedCurrency={currency}
              onOpenInfo={handleOpenInfo}
              onAddToCart={handleAddToCart}
              onOpenCrateDemo={handleOpenCrateDemo}
            />

            {/* 3. SPAWNERS & FARMEO SMP */}
            <ProductSection
              id="spawners"
              title="Spawners de Economía & Farmeo"
              subtitle="Generadores automáticos de hierro, pólvora y varas de blaze para tu economía"
              icon={<Flame className="h-5 w-5 text-amber-400" />}
              products={spawnerProducts}
              selectedCurrency={currency}
              onOpenInfo={handleOpenInfo}
              onAddToCart={handleAddToCart}
            />

            {/* 4. BOOSTERS & PASES */}
            <ProductSection
              id="boosters"
              title="Boosters Globales & Pase de Batalla"
              subtitle="Multiplica el progreso de todo el servidor y desbloquea 50 niveles premium"
              icon={<Zap className="h-5 w-5 text-emerald-400" />}
              products={boosterProducts}
              selectedCurrency={currency}
              onOpenInfo={handleOpenInfo}
              onAddToCart={handleAddToCart}
            />

            {/* 5. COSMÉTICOS & CAPAS */}
            <ProductSection
              id="cosmetics"
              title="Capas Animadas & Auras Místicas"
              subtitle="Físicas personalizadas, partículas orbitantes y cosméticos visibles en todos los clientes"
              icon={<Sparkles className="h-5 w-5 text-purple-400" />}
              products={cosmeticProducts}
              selectedCurrency={currency}
              onOpenInfo={handleOpenInfo}
              onAddToCart={handleAddToCart}
            />

            {/* 6. GEMAS & TOKENS */}
            <ProductSection
              id="coins"
              title="Gemas de Red & Tokens Web3"
              subtitle="Moneda para la casa de subastas in-game y Black Market"
              icon={<Gem className="h-5 w-5 text-teal-400" />}
              products={coinProducts}
              selectedCurrency={currency}
              onOpenInfo={handleOpenInfo}
              onAddToCart={handleAddToCart}
            />

            {/* Información & Entrega */}
            <AboutSection id="about-section" serverName="CraftNetwork" />
          </main>

          {/* Right Column: Clean Sidebar with Cart and Nav Menu */}
          <Sidebar
            activeSection={activeSection}
            onNavigate={handleNavigate}
            cartItems={cartItems}
            selectedCurrency={currency}
            username={username}
            onRemoveCartItem={handleRemoveFromCart}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductModal
        isOpen={isModalOpen}
        product={activeModalProduct}
        selectedCurrency={currency}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />

      {/* Crate Opening Simulator Modal */}
      <CrateSimulatorModal
        isOpen={isCrateModalOpen}
        product={crateProduct}
        onClose={() => setIsCrateModalOpen(false)}
      />

      {/* Player Connect Modal */}
      <PlayerConnectModal
        isOpen={isPlayerModalOpen}
        currentUsername={username}
        onClose={() => setIsPlayerModalOpen(false)}
        onSavePlayer={handleSavePlayer}
      />

      {/* Modal de Pago Stellar / Coinstellation */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        payment={paymentDetails}
        amount={paymentAmount.toFixed(2)}
        currency="XLM"
        description="Orden de compra en CraftNetwork"
        onClose={() => setIsPaymentModalOpen(false)}
      />

      {/* Footer */}
      <Footer serverName="CraftNetwork" year={2026} />
    </div>
  );
}
