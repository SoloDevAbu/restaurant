import Link from "next/link";

export function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-2 pb-2 pt-1 bg-background border-t border-border shadow-lg rounded-t-xl">
      <Link href="/" className="flex flex-col items-center justify-center text-primary hover:bg-muted transition-all active:scale-90 duration-200 rounded-xl px-4 py-1">
        <span className="material-symbols-outlined">home</span>
        <span className="text-[10px] uppercase font-bold tracking-wider mt-1">Home</span>
      </Link>
      <Link href="/menu" className="flex flex-col items-center justify-center text-secondary hover:bg-muted transition-all active:scale-90 duration-200 rounded-xl px-4 py-1">
        <span className="material-symbols-outlined">restaurant_menu</span>
        <span className="text-[10px] uppercase font-bold tracking-wider mt-1">Menu</span>
      </Link>
      <Link href="/orders/tracking" className="flex flex-col items-center justify-center text-secondary hover:bg-muted transition-all active:scale-90 duration-200 rounded-xl px-4 py-1">
        <span className="material-symbols-outlined">receipt_long</span>
        <span className="text-[10px] uppercase font-bold tracking-wider mt-1">Orders</span>
      </Link>
      <Link href="/cart" className="flex flex-col items-center justify-center text-secondary hover:bg-muted transition-all active:scale-90 duration-200 rounded-xl px-4 py-1">
        <span className="material-symbols-outlined">shopping_cart</span>
        <span className="text-[10px] uppercase font-bold tracking-wider mt-1">Cart</span>
      </Link>
    </nav>
  );
}
