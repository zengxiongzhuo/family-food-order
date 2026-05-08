import { Resend } from "resend";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

interface OrderEmailData {
  items: { dishName: string; quantity: number; ingredients: string }[];
  notes: string | null;
  orderTime: Date;
}

export async function sendOrderEmail(data: OrderEmailData) {
  const resend = getResend();
  if (!resend) {
    console.error("RESEND_API_KEY not configured");
    return false;
  }

  const toEmail = process.env.ORDER_NOTIFICATION_EMAIL;
  if (!toEmail) {
    console.error("ORDER_NOTIFICATION_EMAIL not configured");
    return false;
  }

  const itemsList = data.items
    .map((item) => `  ${item.dishName} x ${item.quantity}`)
    .join("\n");

  // Aggregate and deduplicate ingredients
  const allIngredients: string[] = [];
  for (const item of data.items) {
    try {
      const parsed = JSON.parse(item.ingredients) as string[];
      allIngredients.push(...parsed);
    } catch {
      // If not valid JSON, split by comma
      allIngredients.push(
        ...item.ingredients.split(",").map((s) => s.trim())
      );
    }
  }
  const uniqueIngredients = [...new Set(allIngredients.filter(Boolean))].sort();

  const ingredientsList = uniqueIngredients
    .map((ing) => `  ${ing}`)
    .join("\n");

  const timeStr = data.orderTime.toLocaleString("zh-CN", {
    timeZone: "Asia/Shanghai",
  });

  const textContent = `
━━━━━━━━━━━━━━━━━━━━━━
  收到新订单!
━━━━━━━━━━━━━━━━━━━━━━

点菜清单:
${itemsList}

所需原材料汇总:
${ingredientsList}

特殊要求:
  ${data.notes || "无"}

下单时间: ${timeStr}
━━━━━━━━━━━━━━━━━━━━━━
`;

  const htmlContent = `
<div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
  <h2 style="text-align: center; border-bottom: 2px solid #f97316; padding-bottom: 12px;">
    &#127869; 收到新订单!
  </h2>
  
  <h3>&#128203; 点菜清单:</h3>
  <ul style="list-style: none; padding: 0;">
    ${data.items.map((item) => `<li style="padding: 6px 0; border-bottom: 1px solid #eee;">${item.dishName} <strong>x ${item.quantity}</strong></li>`).join("")}
  </ul>
  
  <h3>&#129365; 所需原材料汇总:</h3>
  <div style="display: flex; flex-wrap: wrap; gap: 6px;">
    ${uniqueIngredients.map((ing) => `<span style="background: #fef3c7; padding: 4px 10px; border-radius: 12px; font-size: 14px;">${ing}</span>`).join("")}
  </div>
  
  <h3>&#128221; 特殊要求:</h3>
  <p style="background: #f9fafb; padding: 12px; border-radius: 8px; color: #374151;">
    ${data.notes || "无"}
  </p>
  
  <p style="color: #6b7280; font-size: 13px; margin-top: 24px; text-align: center;">
    &#9200; 下单时间: ${timeStr}
  </p>
</div>
`;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: toEmail,
      subject: `新订单 - ${timeStr}`,
      text: textContent,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
