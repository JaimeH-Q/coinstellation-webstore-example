"use client";

import React, { useState } from "react";
import { Tag, Clock, AlertCircle, X as CloseIcon } from "lucide-react";
import {
  Topbar,
  HeaderBanner,
  ProductSection,
  AboutSection,
  Sidebar,
  ProductModal,
  PaymentModal,
  Footer,
} from "@/components";
import {
  PERMANENT_PRODUCTS,
  TEMPORARY_PRODUCTS,
  RECENT_PURCHASES,
  DONOR_OF_THE_MONTH,
} from "@/data/mock-data";
import { Product, CartItem, PaymentDetails } from "@/types/webstore";
import { createPayment } from "@/lib/payment-service";

export default function WebstorePage() {
  const [currency, setCurrency] = useState("USD");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("rangos-permanentes");

  // Estados para el flujo de pago con Coinstellation / Stellar
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // Añadir producto al carrito
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => [
      ...prev,
      {
        id: `${product.id}-${Date.now()}`,
        name: product.name,
        price: product.price,
      },
    ]);
  };

  // Eliminar producto del carrito
  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Abrir modal de detalles del producto
  const handleOpenInfo = (product: Product) => {
    setActiveModalProduct(product);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveModalProduct(null);
  };

  // Navegación suave entre secciones
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Procesar checkout llamando a la pasarela de pagos
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    const total = cartItems.reduce((acc, item) => acc + item.price, 0);
    setIsCheckingOut(true);
    setCheckoutError(null);

    try {
      const orderNumber = Math.floor(1000 + Math.random() * 9000);
      const primaryItem = cartItems[0]?.name || "Ítems";
      const description = `Orden #${orderNumber} (${cartItems.length} ítems - ${primaryItem})`;
      const packageId = primaryItem.toLowerCase().includes("vip")
        ? "package-basic"
        : primaryItem.toLowerCase().includes("titan")
        ? "package-pro"
        : "package-enterprise";

      const res = await createPayment({
        amount: total.toFixed(2),
        currency: "XLM",
        description,
        packageId,
      });

      if (res && res.payment) {
        setPaymentAmount(total);
        setPaymentDetails(res.payment);
        setIsPaymentModalOpen(true);
      } else {
        throw new Error("Respuesta inválida de la pasarela de pagos.");
      }
    } catch (err: any) {
      console.error("Error en checkout:", err);
      setCheckoutError(err.message || "Error al procesar el pago");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Topbar */}
      <Topbar
        selectedCurrency={currency}
        onCurrencyChange={setCurrency}
        username="Invitado"
        onLoginClick={() => alert("Iniciar sesión")}
      />

      {/* Hero Header con IP y Discord */}
      <HeaderBanner
        title="CRAFTNETWORK"
        subtitle="TIENDA OFICIAL"
        serverIp="PLAY.CRAFTNETWORK.NET"
        discordHandle="DISCORD.GG/CRAFT"
        discordUrl="https://discord.gg/craft"
      />

      {/* Banner de error de pago si ocurre */}
      {checkoutError && (
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-4">
          <div className="flex items-start justify-between gap-3 rounded-xl border border-red-500/40 bg-red-950/50 p-4 text-red-200 shadow-xl backdrop-blur-xs">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-300">
                  No se pudo crear la orden de pago
                </h4>
                <p className="mt-1 text-xs text-red-200/90 leading-relaxed font-mono">
                  {checkoutError}
                </p>
                <p className="mt-2 text-[11px] text-red-300/80">
                  💡 Configura tu URL en <code className="bg-red-900/60 px-1 py-0.5 rounded font-mono">lib/payment-config.ts</code> o mediante <code className="bg-red-900/60 px-1 py-0.5 rounded font-mono">COINSTELLATION_API_URL</code> en <code className="bg-red-900/60 px-1 py-0.5 rounded font-mono">.env.local</code>.
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

      {/* Contenedor Principal */}
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          {/* Columna Izquierda: Secciones de Productos & Info */}
          <main className="flex flex-col gap-6">
            <ProductSection
              id="rangos-permanentes"
              title="Rangos Permanentes"
              icon={<Tag className="h-4 w-4 text-[#2b7fff]" />}
              products={PERMANENT_PRODUCTS}
              onOpenInfo={handleOpenInfo}
              onAddToCart={handleAddToCart}
            />

            <ProductSection
              id="rangos-temporales"
              title="Rangos Temporales"
              icon={<Clock className="h-4 w-4 text-[#2b7fff]" />}
              products={TEMPORARY_PRODUCTS}
              onOpenInfo={handleOpenInfo}
              onAddToCart={handleAddToCart}
            />

            <AboutSection id="about-section" serverName="CraftNetwork" />
          </main>

          {/* Columna Derecha: Sidebar (Nav, Carrito, Donador, Recientes) */}
          <Sidebar
            activeSection={activeSection}
            onNavigate={handleNavigate}
            cartItems={cartItems}
            onRemoveCartItem={handleRemoveFromCart}
            onCheckout={handleCheckout}
            isCheckingOut={isCheckingOut}
            donor={DONOR_OF_THE_MONTH}
            recentPurchases={RECENT_PURCHASES}
          />
        </div>
      </div>

      {/* Modal de Producto */}
      <ProductModal
        isOpen={isModalOpen}
        product={activeModalProduct}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />

      {/* Modal de Pago Stellar (Coinstellation) */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        payment={paymentDetails}
        amount={paymentAmount.toFixed(2)}
        currency="XLM"
        description="Orden de compra en CraftNetwork"
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={() => {
          setCartItems([]);
        }}
      />

      {/* Footer */}
      <Footer serverName="CraftNetwork" year={2026} />
    </div>
  );
}
