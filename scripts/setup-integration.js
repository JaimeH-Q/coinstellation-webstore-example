const fs = require('fs');
const path = require('path');

const frontendDir = path.resolve(__dirname, '..', '..', 'coinstellation-frontend');

console.log('Connecting to coinstellation-frontend at:', frontendDir);

if (!fs.existsSync(frontendDir)) {
  console.error('ERROR: coinstellation-frontend not found at:', frontendDir);
  process.exit(1);
}

// 1. Create PaymentsStore.ts
const paymentsStorePath = path.join(frontendDir, 'backend', 'payments', 'PaymentsStore.ts');
const paymentsStoreContent = `import fs from "fs";
import path from "path";
import {
  Payment,
  PaymentStatus,
  createExamplePayments,
} from "./PaymentsHistory";

export interface AddPaymentInput {
  id: string;
  destination: string;
  amount: string;
  currency: string;
  description?: string;
  packageId?: string;
  userId?: string;
  memo?: string;
}

const DATA_FILE = path.resolve(__dirname, "payments-data.json");

class PaymentsStore {
  private payments: Payment[] = [];
  private baseExamples: Payment[] = [];
  private isLoaded = false;

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        this.payments = JSON.parse(raw);
      }
    } catch (err) {
      console.error("[PaymentsStore] Error loading data from disk:", err);
      this.payments = [];
    }
    this.isLoaded = true;
  }

  private saveToDisk() {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.payments, null, 2), "utf-8");
    } catch (err) {
      console.error("[PaymentsStore] Error saving data to disk:", err);
    }
  }

  private mapPackageId(description?: string, packageId?: string): string {
    if (packageId) return packageId;
    if (!description) return "package-pro";
    const lower = description.toLowerCase();
    if (lower.includes("vip") || lower.includes("basic") || lower.includes("hierro")) {
      return "package-basic";
    }
    if (lower.includes("titan") || lower.includes("pro") || lower.includes("oro")) {
      return "package-pro";
    }
    if (lower.includes("enterprise") || lower.includes("god") || lower.includes("diamante") || lower.includes("esmeralda")) {
      return "package-enterprise";
    }
    return "package-pro";
  }

  public addPayment(input: AddPaymentInput): Payment {
    if (!this.isLoaded) this.loadFromDisk();

    const existing = this.payments.find((p) => p.id === input.id);
    if (existing) return existing;

    const amountNum = parseFloat(input.amount) || 0;
    const feeNum = parseFloat((amountNum * 0.02).toFixed(2));
    const now = new Date().toISOString();

    const newPayment: Payment = {
      id: input.id,
      userId: input.userId || "demo-user",
      packageId: this.mapPackageId(input.description, input.packageId),
      amount: amountNum.toFixed(2),
      fees: feeNum.toFixed(2),
      finalAmount: amountNum.toFixed(2),
      asset: {
        currency: (input.currency || "XLM").toUpperCase(),
        network: "STELLAR",
      },
      status: "pending",
      transactionId: null,
      createdAt: now,
      updatedAt: now,
      metadata: {
        destination: input.destination,
        description: input.description,
        memo: input.memo,
        source: "webstore",
      },
    };

    this.payments.unshift(newPayment);
    this.saveToDisk();
    return newPayment;
  }

  public completePayment(id: string, txHash: string): Payment | null {
    if (!this.isLoaded) this.loadFromDisk();

    // Buscar por ID exacto o por memo si coincide
    const payment = this.payments.find(
      (p) => p.id === id || (p.metadata && p.metadata.memo === id)
    );

    if (!payment) {
      console.warn(\`[PaymentsStore] Payment with ID '\${id}' not found for completion.\`);
      return null;
    }

    const now = new Date().toISOString();
    payment.status = "completed";
    payment.transactionId = txHash;
    payment.blockchain = {
      transactionId: txHash,
      network: payment.asset.network || "STELLAR",
      asset: payment.asset.currency,
      toAddress: (payment.metadata?.destination as string) || undefined,
      confirmations: 1,
      confirmedAt: now,
    };
    payment.updatedAt = now;

    this.saveToDisk();
    return payment;
  }

  public getPayments(userId: string = "demo-user", count: number = 50): Payment[] {
    if (!this.isLoaded) this.loadFromDisk();

    if (this.baseExamples.length === 0) {
      this.baseExamples = createExamplePayments(userId, 8);
    }

    // Los pagos de la webstore tienen prioridad absoluta al inicio
    const all = [...this.payments, ...this.baseExamples];
    return all.slice(0, count);
  }
}

export const paymentsStore = new PaymentsStore();
`;
fs.writeFileSync(paymentsStorePath, paymentsStoreContent, 'utf-8');
console.log('✓ Created PaymentsStore.ts');

// 2. Update CosmosPayments.ts
const cosmosPaymentsPath = path.join(frontendDir, 'backend', 'payments', 'CosmosPayments.ts');
const cosmosPaymentsContent = `import { Assets, Client } from "@cosmosapp/pay_sdk";

export interface CreateCosmosPaymentInput {
  /** Public Stellar address of the webstore owner. */
  destination: string;
  amount: string;
  currency: string;
  description?: string;
  callback?: string;
}

let cosmosClient: Client | undefined;

function getCosmosClient(): Client {
  const apiKey = process.env.COSMOS_PAY_API_KEY;

  if (!apiKey) {
    throw new Error("COSMOS_PAY_API_KEY is not configured.");
  }

  cosmosClient ??= new Client({ apiKey });
  return cosmosClient;
}

function resolveAsset(currency: string) {
  const normalizedCurrency = currency.trim().toUpperCase();

  if (normalizedCurrency === "XLM") {
    return Assets.XLM;
  }

  return normalizedCurrency;
}

/** Crea el intent en Cosmos o en modo simulación para desarrollo si no hay API key configurada. */
export async function createCosmosPayment(input: CreateCosmosPaymentInput) {
  const destination = input.destination.trim();
  const memo = createMemoId();

  if (!destination) {
    throw new Error("The webstore creator's Stellar wallet is required.");
  }

  const apiKey = process.env.COSMOS_PAY_API_KEY;

  if (!apiKey) {
    // Modo de desarrollo / simulación sin requerir API key externa
    const paymentId = \`pay_\${Date.now()}_\${Math.random().toString(36).substring(2, 7)}\`;
    const sep7Uri = \`web+stellar:pay?destination=\${encodeURIComponent(
      destination
    )}&amount=\${encodeURIComponent(input.amount)}&asset_code=\${encodeURIComponent(
      input.currency.trim().toUpperCase()
    )}&memo=\${memo}&memo_type=MEMO_ID\`;
    const qrCode = \`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=\${encodeURIComponent(
      sep7Uri
    )}\`;

    return {
      id: paymentId,
      status: "PENDING",
      network: "testnet",
      destination,
      amount: input.amount,
      asset: input.currency.trim().toUpperCase(),
      memo,
      uri: sep7Uri,
      qr: qrCode,
      createdAt: new Date().toISOString(),
    };
  }

  const intent = await getCosmosClient().paymentIntents.createPay({
    destination,
    amount: input.amount,
    asset: resolveAsset(input.currency),
    memo,
    ...(input.description ? { msg: input.description.trim() } : {}),
    ...(input.callback ? { callback: input.callback.trim() } : {}),
  });

  return {
    id: intent.id,
    status: intent.status,
    network: intent.network,
    destination: intent.destination,
    amount: intent.amount,
    asset: intent.asset,
    memo: intent.memo,
    uri: intent.uri,
    qr: intent.qr,
    createdAt: intent.createdAt,
  };
}

export async function validateCosmosPayment(id: string, txHash: string) {
  const apiKey = process.env.COSMOS_PAY_API_KEY;

  if (!apiKey) {
    return {
      valid: true,
      status: "CONFIRMED",
      reason: undefined,
      paymentIntent: {
        id,
        txHash,
        status: "CONFIRMED",
      },
    };
  }

  const outcome = await getCosmosClient().paymentIntents.validate(id, { txHash });

  return {
    valid: outcome.valid,
    status: outcome.status,
    reason: outcome.reason,
    paymentIntent: outcome.paymentIntent,
  };
}

function createMemoId(): string {
  return String(Date.now() * 1000 + Math.floor(Math.random() * 1000));
}
`;
fs.writeFileSync(cosmosPaymentsPath, cosmosPaymentsContent, 'utf-8');
console.log('✓ Updated CosmosPayments.ts');

// 3. Update app/api/payments/create/route.ts
const paymentsCreateRoutePath = path.join(frontendDir, 'app', 'api', 'payments', 'create', 'route.ts');
const paymentsCreateRouteContent = `import { createCosmosPayment } from "@/backend/payments/CosmosPayments";
import { paymentsStore } from "@/backend/payments/PaymentsStore";

export const runtime = "nodejs";

/** Crea un intent SEP-7 para que una webstore externa pueda mostrar su checkout. */
export async function POST(request: Request) {
  if (!isAuthorizedWebstore(request)) {
    return Response.json({ error: "Invalid webstore API key." }, { status: 401, headers: corsHeaders() });
  }

  const body = await readRequestBody(request);

  if (body === null) {
    return Response.json({ error: "Body must be a valid JSON object." }, { status: 400 });
  }

  if (!isCreatePaymentBody(body)) {
    return Response.json(
      { error: "creator wallet, amount and currency are required with valid types." },
      { status: 422 },
    );
  }

  try {
    const payment = await createCosmosPayment(body);

    // Registrar en el almacén de pagos para que impacte en el dashboard
    const record = paymentsStore.addPayment({
      id: payment.id,
      destination: body.destination,
      amount: body.amount,
      currency: body.currency,
      description: body.description,
      packageId: (body as any).packageId,
      userId: (body as any).userId,
      memo: payment.memo,
    });

    return Response.json({ payment, record }, { status: 201, headers: corsHeaders() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cosmos Pay is unavailable.";
    const status = message.includes("COSMOS_PAY") ? 503 : 502;

    return Response.json({ error: message }, { status, headers: corsHeaders() });
  }
}

async function readRequestBody(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function isCreatePaymentBody(value: unknown): value is Parameters<typeof createCosmosPayment>[0] & { packageId?: string; userId?: string } {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const body = value as Record<string, unknown>;

  return (
    typeof body.destination === "string" &&
    body.destination.trim().length > 0 &&
    typeof body.amount === "string" &&
    /^\\d+(\\.\\d+)?$/.test(body.amount) &&
    Number(body.amount) > 0 &&
    typeof body.currency === "string" &&
    body.currency.trim().length > 0 &&
    (body.description === undefined || typeof body.description === "string") &&
    (body.callback === undefined || typeof body.callback === "string") &&
    (body.packageId === undefined || typeof body.packageId === "string") &&
    (body.userId === undefined || typeof body.userId === "string")
  );
}

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": process.env.WEBSTORE_ALLOWED_ORIGIN ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Store-Key",
  };
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

function isAuthorizedWebstore(request: Request): boolean {
  const expectedKey = process.env.WEBSTORE_API_KEY;

  if (!expectedKey) {
    return process.env.NODE_ENV !== "production";
  }

  return request.headers.get("X-Store-Key") === expectedKey;
}
`;
fs.writeFileSync(paymentsCreateRoutePath, paymentsCreateRouteContent, 'utf-8');
console.log('✓ Updated app/api/payments/create/route.ts');

// 4. Update app/api/payments/[id]/validate/route.ts
const paymentsValidateRoutePath = path.join(frontendDir, 'app', 'api', 'payments', '[id]', 'validate', 'route.ts');
const paymentsValidateRouteContent = `import { validateCosmosPayment } from "@/backend/payments/CosmosPayments";
import { paymentsStore } from "@/backend/payments/PaymentsStore";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAuthorizedWebstore(request)) {
    return Response.json({ error: "Invalid webstore API key." }, { status: 401, headers: corsHeaders() });
  }

  const { id } = await params;
  const body = await readBody(request);

  if (!body || typeof body.txHash !== "string" || !body.txHash.trim()) {
    return Response.json({ error: "txHash is required." }, { status: 422 });
  }

  try {
    const outcome = await validateCosmosPayment(id, body.txHash.trim());
    let record = null;
    if (outcome.valid) {
      record = paymentsStore.completePayment(id, body.txHash.trim());
    }
    return Response.json(
      { payment: outcome, record },
      { headers: corsHeaders() },
    );
  } catch (error: any) {
    return Response.json({ error: error?.message || "Unable to validate the Cosmos payment." }, { status: 502 });
  }
}

async function readBody(request: Request): Promise<{ txHash?: unknown } | null> {
  try {
    const body: unknown = await request.json();
    return body && typeof body === "object" ? (body as { txHash?: unknown }) : null;
  } catch {
    return null;
  }
}

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": process.env.WEBSTORE_ALLOWED_ORIGIN ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Store-Key",
  };
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

function isAuthorizedWebstore(request: Request): boolean {
  const expectedKey = process.env.WEBSTORE_API_KEY;

  if (!expectedKey) {
    return process.env.NODE_ENV !== "production";
  }

  return request.headers.get("X-Store-Key") === expectedKey;
}
`;
fs.writeFileSync(paymentsValidateRoutePath, paymentsValidateRouteContent, 'utf-8');
console.log('✓ Updated app/api/payments/[id]/validate/route.ts');

// 5. Update app/api/payments/route.ts
const paymentsRoutePath = path.join(frontendDir, 'app', 'api', 'payments', 'route.ts');
const paymentsRouteContent = `import { paymentsStore } from "@/backend/payments/PaymentsStore";

const DEFAULT_PAYMENT_COUNT = 50;

/** Devuelve los pagos (incluyendo las ventas reales de webstores) asociados al usuario. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id")?.trim() || "demo-user";

  const count = parseCount(searchParams.get("count"));
  if (count === null) {
    return Response.json(
      { error: "The count query parameter must be a non-negative integer." },
      { status: 400 },
    );
  }

  const payments = paymentsStore.getPayments(userId, count);

  return Response.json(
    { payments },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    }
  );
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function parseCount(value: string | null): number | null {
  if (value === null || value === "") {
    return DEFAULT_PAYMENT_COUNT;
  }

  const count = Number(value);
  return Number.isInteger(count) && count >= 0 ? count : null;
}
`;
fs.writeFileSync(paymentsRoutePath, paymentsRouteContent, 'utf-8');
console.log('✓ Updated app/api/payments/route.ts');

console.log('All frontend updates applied successfully!');
