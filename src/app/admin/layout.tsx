import Link from "next/link";
import { LayoutGrid, UtensilsCrossed, ClipboardList, Home } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col bg-[var(--background)]">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">🏠 管理后台</h1>
          <nav className="flex items-center gap-0.5">
            <Link
              href="/admin/categories"
              className="px-3 py-2 text-sm rounded-lg hover:bg-orange-50 text-gray-600 hover:text-[var(--primary)] flex items-center gap-1.5 transition-colors"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">分类</span>
            </Link>
            <Link
              href="/admin/dishes"
              className="px-3 py-2 text-sm rounded-lg hover:bg-orange-50 text-gray-600 hover:text-[var(--primary)] flex items-center gap-1.5 transition-colors"
            >
              <UtensilsCrossed className="h-4 w-4" />
              <span className="hidden sm:inline">菜品</span>
            </Link>
            <Link
              href="/admin/orders"
              className="px-3 py-2 text-sm rounded-lg hover:bg-orange-50 text-gray-600 hover:text-[var(--primary)] flex items-center gap-1.5 transition-colors"
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">订单</span>
            </Link>
            <Link
              href="/"
              className="ml-1 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center gap-1.5 transition-colors"
            >
              <Home className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-5 py-6">
        {children}
      </main>
    </div>
  );
}
