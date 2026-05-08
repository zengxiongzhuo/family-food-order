import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LayoutGrid, UtensilsCrossed, ClipboardList } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [categoryCount, dishCount, orderCount] = await Promise.all([
    prisma.category.count(),
    prisma.dish.count(),
    prisma.order.count(),
  ]);

  const stats = [
    { label: "分类", count: categoryCount, href: "/admin/categories", icon: LayoutGrid },
    { label: "菜品", count: dishCount, href: "/admin/dishes", icon: UtensilsCrossed },
    { label: "订单", count: orderCount, href: "/admin/orders", icon: ClipboardList },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">管理面板</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="h-10 w-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
