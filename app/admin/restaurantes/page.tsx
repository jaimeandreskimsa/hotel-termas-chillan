import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import RestaurantesAdminClient from "./RestaurantesAdminClient";
import { db } from "@/lib/db";
import { restaurantItems, familyPrograms } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";

export default async function RestaurantesAdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  const role = (session.user as { role?: string })?.role;
  const module = (session.user as { module?: string })?.module;
  if (role !== "superadmin" && module !== "restaurantes") redirect("/admin");

  const items = await db.select().from(restaurantItems).orderBy(restaurantItems.restaurant, restaurantItems.category, restaurantItems.order);
  const programs = await db.select().from(familyPrograms).where(inArray(familyPrograms.type, ["hero_rest_arboleda", "hero_rest_lagrieta", "hero_rest_muffin"]));

  return <AdminShell><RestaurantesAdminClient initialItems={items} initialPrograms={programs} /></AdminShell>;
}
