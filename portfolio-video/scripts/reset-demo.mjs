import { PrismaClient } from "@prisma/client";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const envText = await readFile(path.resolve(here, "../../.env"), "utf8");
for (const line of envText.split(/\r?\n/)) {
  const match = line.match(/^\s*([^#=]+)=(.*)$/);
  if (match && !process.env[match[1].trim()]) {
    process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
}

const prisma = new PrismaClient();
try {
  const email = process.env.DEMO_CUSTOMER_EMAIL;
  if (!email) throw new Error("DEMO_CUSTOMER_EMAIL is not configured");
  const customer = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!customer) throw new Error("Demo customer was not found");
  const orders = await prisma.order.findMany({ where: { userId: customer.id }, select: { id: true } });
  const orderIds = orders.map(({ id }) => id);
  await prisma.$transaction(async (tx) => {
    if (orderIds.length) {
      await tx.payment.deleteMany({ where: { orderId: { in: orderIds } } });
      await tx.couponUsage.deleteMany({ where: { orderId: { in: orderIds } } });
      await tx.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
      await tx.auditLog.deleteMany({ where: { entityType: "Order", entityId: { in: orderIds } } });
      await tx.order.deleteMany({ where: { id: { in: orderIds } } });
    }
    await tx.inventory.updateMany({ data: { reserved: 0 } });
    await tx.wishlistItem.deleteMany({ where: { wishlist: { userId: customer.id } } });
  });
  console.log(`Demo commerce state reset for one local demo customer (${orderIds.length} orders removed).`);
} finally {
  await prisma.$disconnect();
}
