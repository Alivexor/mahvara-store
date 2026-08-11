import { describe,expect,it } from "vitest";
import { addCartLine,canReserve,cartSubtotal } from "@/lib/cart";
describe("سبد و موجودی",()=>{it("تعداد را از موجودی بیشتر نمی‌کند",()=>expect(addCartLine([{productId:"p1",quantity:3}],"p1",4,5)).toEqual([{productId:"p1",quantity:5}]));it("جمع را از قیمت مرجع محاسبه می‌کند",()=>expect(cartSubtotal([{productId:"p1",quantity:2}],new Map([["p1",125_000]]))).toBe(250_000));it("رزرو منفی یا بیش از موجودی آزاد را نمی‌پذیرد",()=>{expect(canReserve(10,8,3)).toBe(false);expect(canReserve(10,8,2)).toBe(true);expect(canReserve(10,0,-1)).toBe(false)})});
