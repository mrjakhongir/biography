import { NextResponse } from "next/server";

import type { SellerBalanceDTO } from "@/entities/seller/model/types";
import { supabaseAdmin } from "@/shared/lib/supabase/admin";
import { getSessionPayload } from "@/shared/lib/telegram/get-current-user";

export async function GET() {
  try {
    const session = await getSessionPayload();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .rpc("get_seller_balance", {
        p_user_id: session.userId,
      })
      .single()
      .overrideTypes<SellerBalanceDTO, { merge: false }>();

    if (error) {
      console.error("Get seller balance RPC error:", error);

      return NextResponse.json({ error: "Unable to get seller balance" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({
        balance: {
          availableStars: 0,
          totalEarnedStars: 0,
          totalWithdrawnStars: 0,
        },
        earnings: [],
        withdrawals: [],
      });
    }

    return NextResponse.json({
      balance: {
        availableStars: Number(data.available_stars),
        totalEarnedStars: Number(data.total_earned_stars),
        totalWithdrawnStars: Number(data.total_withdrawn_stars),
      },

      earnings: data.earnings.map((earning) => ({
        id: earning.id,
        createdAt: earning.created_at,
        testId: earning.test_id,
        testTitle: earning.test_title,
        grossStars: Number(earning.gross_stars),
        platformFeeStars: Number(earning.platform_fee_stars),
        netStars: Number(earning.net_stars),
      })),

      withdrawals: data.withdrawals.map((withdrawal) => ({
        id: withdrawal.id,
        createdAt: withdrawal.created_at,
        amountStars: Number(withdrawal.amount_stars),
      })),
    });
  } catch (error) {
    console.error("Seller balance error:", error);

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
