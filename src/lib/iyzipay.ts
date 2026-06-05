// eslint-disable-next-line @typescript-eslint/no-require-imports
const Iyzipay = require("iyzipay");

/**
 * İyzico sandbox/prod client singleton.
 * Sandbox URI: https://sandbox-api.iyzipay.com
 * Prod URI   : https://api.iyzipay.com
 *
 * Gerekli env değişkenleri (.env.local):
 *   IYZIPAY_API_KEY=sandbox_xxxxxxxxxxx
 *   IYZIPAY_SECRET_KEY=sandbox_xxxxxxxxxxx
 */
const apiKey = process.env.IYZIPAY_API_KEY ?? "sandbox-OlKWGMkCew0koAp2sL5sxPIuwnsbpWP3";
const secretKey = process.env.IYZIPAY_SECRET_KEY ?? "sandbox-8M63IDsNO8ZFJfptgxk5xoUhIllQgquP";
const isSandbox = apiKey.startsWith("sandbox-");

const iyzipay = new Iyzipay({
  apiKey,
  secretKey,
  uri: isSandbox ? "https://sandbox-api.iyzipay.com" : "https://api.iyzipay.com",
});

export default iyzipay;

// ---------- Sabitler ----------
export const IYZICO_LOCALE = Iyzipay.LOCALE;
export const IYZICO_CURRENCY = Iyzipay.CURRENCY;
export const IYZICO_PAYMENT_CHANNEL = Iyzipay.PAYMENT_CHANNEL;
export const IYZICO_PAYMENT_GROUP = Iyzipay.PAYMENT_GROUP;
export const IYZICO_BASKET_ITEM_TYPE = Iyzipay.BASKET_ITEM_TYPE;

// ---------- Helper: callback → Promise ----------
export function iyzicoCreate(
  method: { create: (req: object, cb: (err: unknown, result: IyzicoResult) => void) => void },
  request: object
): Promise<IyzicoResult> {
  return new Promise((resolve, reject) => {
    method.create(request, (err: unknown, result: IyzicoResult) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

export interface IyzicoResult {
  status: "success" | "failure";
  errorCode?: string;
  errorMessage?: string;
  errorGroup?: string;
  paymentId?: string;
  price?: string;
  paidPrice?: string;
  fraudStatus?: number;
  [key: string]: unknown;
}
