import type { PaymentProvider } from "./types";
import { MockPaymentProvider } from "./mock-provider";
export function getPaymentProvider(): PaymentProvider { const provider = process.env.PAYMENT_PROVIDER ?? "mock"; if (provider === "mock") return new MockPaymentProvider(); throw new Error(`Payment provider '${provider}' has not been configured.`); }
