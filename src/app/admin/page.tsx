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
    { label: "分类", count: categoryCount, href: "/admin/categories", icon: LayoutGrid, color: "from-blue-400 to-blue-600", shadow: "shadow-blue-200" },
    { label: "菜品", count: dishCount, href: "/admin/dishes", icon: UtensilsCrossed, color: "from-orange-400 to-orange-600", shadow: "shadow-orange-200" },
    { label: "订单", count: orderCount, href: "/admin/orders", icon: ClipboardList, color: "from-green-400 to-green-600", shadow: "shadow-green-200" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">管理面板</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="card-hover flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100"
          >
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-lg ${stat.shadow}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
