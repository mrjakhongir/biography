import type { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { supabaseAdmin } from "@/shared/lib/supabase/admin";

export function registerPaymentHandlers(bot: Telegraf) {
  bot.on("pre_checkout_query", async (ctx) => {
    const query = ctx.preCheckoutQuery;

    try {
      const { data: invoice, error } = await supabaseAdmin
        .from("test_invoices")
        .select("id, user_id, test_id, status, amount_stars, invoice_payload")
        .eq("id", query.invoice_payload)
        .maybeSingle();

      if (error) {
        console.error("Pre-checkout invoice lookup error:", error);

        await ctx.answerPreCheckoutQuery(false, "Something went wrong.");
        return;
      }

      if (!invoice) {
        await ctx.answerPreCheckoutQuery(false, "This invoice is no longer available.");
        return;
      }

      if (invoice.status !== "pending") {
        await ctx.answerPreCheckoutQuery(false, "This invoice has already been processed.");
        return;
      }

      if (invoice.amount_stars !== query.total_amount) {
        console.error("Payment amount mismatch:", {
          invoiceId: invoice.id,
          expected: invoice.amount_stars,
          received: query.total_amount,
        });

        await ctx.answerPreCheckoutQuery(false, "The payment amount is invalid.");
        return;
      }

      await ctx.answerPreCheckoutQuery(true);
    } catch (error) {
      console.error("Pre-checkout handler error:", error);

      await ctx.answerPreCheckoutQuery(false, "Unable to process this payment.");
    }
  });

  bot.on(message("successful_payment"), async (ctx) => {
    const payment = ctx.message.successful_payment;

    try {
      const { error } = await supabaseAdmin.rpc("complete_test_invoice", {
        p_invoice_id: payment.invoice_payload,
        p_telegram_charge_id: payment.telegram_payment_charge_id,
        p_provider_charge_id: payment.provider_payment_charge_id,
        p_amount_stars: payment.total_amount,
      });

      if (error) {
        console.error("Complete test invoice RPC error:", error);
        return;
      }
    } catch (error) {
      console.error("Successful payment handler error:", error);
    }
  });
}
