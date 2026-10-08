import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { getSessionPayload } from "@/shared/lib/telegram/get-current-user";
import { createInvoiceLink } from "@/shared/lib/telegram/service/create-payment";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

type CreateInvoiceResult = {
  invoice_id: string;
  price_stars: number;
  test_title: string;
};

export async function POST(_request: Request, { params }: Params) {
  try {
    const session = await getSessionPayload();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: testId } = await params;
    if (!testId) return NextResponse.json({ error: "Test ID is required" }, { status: 400 });

    const { data, error } = await supabaseAdmin.rpc("create_test_invoice", {
      p_user_id: session.userId,
      p_test_id: testId,
    });

    if (error) {
      console.error("Create test invoice RPC error:", error);

      switch (error.message) {
        case "TEST_NOT_FOUND":
          return NextResponse.json({ error: "Test not found" }, { status: 404 });

        case "CANNOT_INVOICE_OWN_TEST":
          return NextResponse.json({ error: "You cannot invoice your own test" }, { status: 400 });

        case "TEST_NOT_FOR_SALE":
          return NextResponse.json({ error: "This test is not currently for sale" }, { status: 400 });

        case "TEST_HAS_INVALID_PRICE":
          return NextResponse.json({ error: "This test has an invalid price" }, { status: 400 });

        case "TEST_ALREADY_PURCHASED":
          return NextResponse.json({ error: "You already invoiced this test" }, { status: 409 });

        default:
          return NextResponse.json({ error: "Unable to create invoice" }, { status: 500 });
      }
    }

    const invoice = data?.[0] as CreateInvoiceResult | undefined;

    if (!invoice) {
      return NextResponse.json({ error: "Unable to create invoice" }, { status: 500 });
    }

    const invoiceUrl = await createInvoiceLink({
      title: invoice.test_title,
      description: `Test: ${invoice.test_title}`,
      payload: invoice.invoice_id,
      amount: invoice.price_stars,
    });

    return NextResponse.json({
      invoiceId: invoice.invoice_id,
      invoiceUrl,
      priceStars: invoice.price_stars,
    });
  } catch (error) {
    console.error("Invoice test error:", error);

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
