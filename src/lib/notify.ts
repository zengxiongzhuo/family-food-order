interface OrderNotifyData {
  items: { dishName: string; quantity: number; ingredients: string }[];
  notes: string | null;
  orderTime: Date;
}

export async function sendOrderNotification(data: OrderNotifyData): Promise<boolean> {
  const appToken = process.env.WXPUSHER_APP_TOKEN;
  const uid = process.env.WXPUSHER_UID;

  if (!appToken || !uid) {
    console.error("WxPusher 未配置: 缺少 WXPUSHER_APP_TOKEN 或 WXPUSHER_UID");
    return false;
  }

  const timeStr = data.orderTime.toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
  });

  // Aggregate and deduplicate ingredients
  const allIngredients: string[] = [];
  for (const item of data.items) {
    try {
      const parsed = JSON.parse(item.ingredients) as string[];
      allIngredients.push(...parsed);
    } catch {
      allIngredients.push(
        ...item.ingredients.split(",").map((s) => s.trim())
      );
    }
  }
  const uniqueIngredients = [...new Set(allIngredients.filter(Boolean))].sort();

  // Build markdown content
  const itemsList = data.items
    .map((item) => `- **${item.dishName}** x ${item.quantity}`)
    .join("\n");

  const ingredientsList = uniqueIngredients.join("、");

  const content = `# 🍽️ 收到新订单！

## 📋 点菜清单
${itemsList}

## 🥬 所需食材汇总
${ingredientsList}

## 📝 特殊要求
${data.notes || "无"}

---
⏰ 下单时间：${timeStr}`;

  try {
    const res = await fetch("https://wxpusher.zjiecode.com/api/send/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appToken,
        content,
        summary: `新订单：${data.items.map((i) => i.dishName).join("、")}`,
        contentType: 3, // Markdown
        uids: [uid],
      }),
    });

    const result = await res.json();
    if (result.code === 1000 && result.success) {
      return true;
    } else {
      console.error("WxPusher 推送失败:", result.msg);
      return false;
    }
  } catch (error) {
    console.error("WxPusher 请求失败:", error);
    return false;
  }
}
