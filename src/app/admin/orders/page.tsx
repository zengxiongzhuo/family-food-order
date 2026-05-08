import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATUS_MAP: Record<string, string> = {
  PENDING: "待处理",
  EMAIL_SENT: "已通知",
  COMPLETED: "已完成",
};

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: { select: { id: true, dishName: true, quantity: true, ingredients: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">订单记录</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-400 py-8">暂无订单</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg bg-white border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleString("zh-CN", {
                    timeZone: "Asia/Shanghai",
                  })}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === "EMAIL_SENT"
                      ? "bg-green-100 text-green-700"
                      : order.status === "COMPLETED"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {STATUS_MAP[order.status] || order.status}
                </span>
              </div>
              <ul className="space-y-1 mb-2">
                {order.items.map((item) => (
                  <li key={item.id} className="text-sm text-gray-700">
                    {item.dishName} <span className="text-gray-400">x{item.quantity}</span>
                  </li>
                ))}
              </ul>
              {order.notes && (
                <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  备注：{order.notes}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                共 {order.totalItems} 道菜
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
