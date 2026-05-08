"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "./image-upload";

interface Category {
  id: string;
  name: string;
}

interface DishData {
  id?: string;
  name: string;
  categoryId: string;
  description: string;
  imageUrl: string | null;
  ingredients: string;
  cookingMethod: string;
  isAvailable: boolean;
}

interface DishFormProps {
  categories: Category[];
  initialData?: DishData;
}

export function DishForm({ categories, initialData }: DishFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: initialData?.name || "",
    categoryId: initialData?.categoryId || (categories[0]?.id || ""),
    description: initialData?.description || "",
    imageUrl: initialData?.imageUrl || null as string | null,
    ingredients: initialData?.ingredients
      ? (() => {
          try {
            return (JSON.parse(initialData.ingredients) as string[]).join(", ");
          } catch {
            return initialData.ingredients;
          }
        })()
      : "",
    cookingMethod: initialData?.cookingMethod || "",
    isAvailable: initialData?.isAvailable ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.categoryId || !form.ingredients.trim()) return;

    setLoading(true);
    try {
      // Convert comma-separated ingredients to JSON array
      const ingredientsArray = form.ingredients
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: form.name.trim(),
        categoryId: form.categoryId,
        description: form.description.trim() || null,
        imageUrl: form.imageUrl,
        ingredients: JSON.stringify(ingredientsArray),
        cookingMethod: form.cookingMethod.trim() || null,
        isAvailable: form.isAvailable,
      };

      const url = initialData?.id
        ? `/api/dishes/${initialData.id}`
        : "/api/dishes";
      const method = initialData?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/dishes");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "保存失败");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          菜名 *
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          placeholder="菜品名称"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          分类 *
        </label>
        <select
          required
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
        >
          <option value="">选择分类</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          图片
        </label>
        <ImageUpload
          value={form.imageUrl}
          onChange={(url) => setForm({ ...form, imageUrl: url })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          描述
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          placeholder="口味描述、小贴士等"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          食材 * <span className="text-gray-400 font-normal">（逗号分隔）</span>
        </label>
        <textarea
          required
          value={form.ingredients}
          onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
          rows={2}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          placeholder="例如：五花肉500g，生抽，冰糖，八角"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          做法
        </label>
        <textarea
          value={form.cookingMethod}
          onChange={(e) => setForm({ ...form, cookingMethod: e.target.value })}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          placeholder="详细烹饪步骤..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isAvailable"
          checked={form.isAvailable}
          onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
        />
        <label htmlFor="isAvailable" className="text-sm text-gray-700">
          可供点菜
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "保存中..." : initialData?.id ? "更新" : "创建"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
      </div>
    </form>
  );
}
