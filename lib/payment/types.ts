export type CreatePaymentInput = { paymentId: string; orderNumber: string; amount: number; callbackUrl: string };
export type CreatePaymentResult = { authority: string; redirectUrl: string };
export type VerifyPaymentInput = { authority: string; amount: number; status?: string };
export type VerifyPaymentResult = { success: boolean; referenceId?: string; failureReason?: string };
export interface PaymentProvider { readonly name: string; create(input: CreatePaymentInput): Promise<CreatePaymentResult>; verify(input: VerifyPaymentInput): Promise<VerifyPaymentResult>; }
