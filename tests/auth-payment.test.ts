import { describe,expect,it } from "vitest";
import { compare,hash } from "bcryptjs";
import { canAccessAdmin,canManageOrders,canManageProducts } from "@/lib/auth/policy";
import { MockPaymentProvider } from "@/lib/payment/mock-provider";
import { checkoutSchema } from "@/schemas/checkout";
describe("احراز هویت و مجوز",()=>{it("رمز را Hash و بررسی می‌کند",async()=>{const encoded=await hash("SecurePass123!",6);expect(encoded).not.toContain("SecurePass123!");expect(await compare("SecurePass123!",encoded)).toBe(true)});it("RBAC را تفکیک می‌کند",()=>{expect(canAccessAdmin("CUSTOMER")).toBe(false);expect(canManageProducts("EDITOR")).toBe(true);expect(canManageOrders("SUPPORT")).toBe(true);expect(canManageOrders("EDITOR")).toBe(false)})});
describe("Checkout و پرداخت",()=>{it("نشانی یا سبد ناقص را رد می‌کند",()=>expect(checkoutSchema.safeParse({items:[]}).success).toBe(false));it("Mock تنها موفقیت صریح را Verify می‌کند",async()=>{const provider=new MockPaymentProvider();const created=await provider.create({paymentId:"p",orderNumber:"o",amount:100,callbackUrl:"/"});expect((await provider.verify({authority:created.authority,amount:100,status:"success"})).success).toBe(true);expect((await provider.verify({authority:created.authority,amount:100,status:"failed"})).success).toBe(false)})});
