import { randomBytes } from "node:crypto";
import type { CreatePaymentInput, CreatePaymentResult, PaymentProvider, VerifyPaymentInput, VerifyPaymentResult } from "./types";

export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock";
  async create(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const authority = `MOCK-${randomBytes(12).toString("hex")}`;
    return { authority, redirectUrl: `/payment/mock?authority=${encodeURIComponent(authority)}&order=${encodeURIComponent(input.orderNumber)}` };
  }
  async verify(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    if (!input.authority.startsWith("MOCK-") || input.status !== "success") return { success: false, failureReason: "پرداخت در محیط نمایشی ناموفق یا لغو شد." };
    return { success: true, referenceId: `REF-${randomBytes(8).toString("hex").toUpperCase()}` };
  }
}
