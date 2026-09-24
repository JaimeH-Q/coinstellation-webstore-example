"use client";

import React, { useState } from "react";
import { Tag, Clock } from "lucide-react";
import {
  Topbar,
  HeaderBanner,
  ProductSection,
  AboutSection,
  Sidebar,
  ProductModal,
  Footer,
} from "@/components";
import {
  PERMANENT_PRODUCTS,
  TEMPORARY_PRODUCTS,
  RECENT_PURCHASES,
  DONOR_OF_THE_MONTH,
} from "@/data/mock-data";
import { Product, CartItem } from "@/types/webstore";

export default function WebstorePage() {
  const [currency, setCurrency] = useState("USD");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("rangos-permanentes");

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

  // Simular checkout
  const handleCheckout = () => {
    alert("Redirigiendo a la pasarela de pagos segura...");
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

      {/* Footer */}
      <Footer serverName="CraftNetwork" year={2026} />
    </div>
  );
}
