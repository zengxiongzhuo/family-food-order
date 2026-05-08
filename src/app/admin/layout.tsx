import Link from "next/link";
import { LayoutGrid, UtensilsCrossed, ClipboardList, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">Admin</h1>
          <nav className="flex items-center gap-1">
            <Link
              href="/admin/categories"
              className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 text-gray-700 flex items-center gap-1.5"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Categories</span>
            </Link>
            <Link
              href="/admin/dishes"
              className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 text-gray-700 flex items-center gap-1.5"
            >
              <UtensilsCrossed className="h-4 w-4" />
              <span className="hidden sm:inline">Dishes</span>
            </Link>
            <Link
              href="/admin/orders"
              className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 text-gray-700 flex items-center gap-1.5"
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </Link>
            <Link
              href="/"
              className="px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 text-gray-500 flex items-center gap-1.5"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  );
}
