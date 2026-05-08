import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center mb-5">
        <CheckCircle className="h-10 w-10 text-green-500" />
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">下单成功！</h1>
      <p className="text-sm text-gray-500 mb-8 max-w-xs leading-relaxed">
        订单已发送给厨师，TA 会通过微信收到包含菜品和所需食材的通知。
      </p>
      <Link
        href="/"
        className="rounded-full bg-[var(--primary)] px-8 py-3 text-sm font-bold text-white hover:bg-[var(--primary-dark)] transition-colors shadow-lg shadow-orange-200/50"
      >
        继续点菜
      </Link>
    </main>
  );
}
