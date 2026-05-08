import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="text-green-500 mb-4">
        <CheckCircle className="h-16 w-16 mx-auto" />
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">下单成功！</h1>
      <p className="text-sm text-gray-600 mb-6 max-w-xs">
        订单已发送给厨师，TA 会收到一封包含菜品和所需食材的邮件通知。
      </p>
      <Link
        href="/"
        className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
      >
        继续点菜
      </Link>
    </main>
  );
}
