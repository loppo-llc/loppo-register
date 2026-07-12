// server.js
import express from "express";
import path from "path";
import { randomUUID } from "crypto";
import {
  SquareClient,
  SquareEnvironment,
  SquareError,
} from "square";
import "dotenv/config";

// BigInt → JSON 出力対策
/* eslint-disable no-extend-native */
BigInt.prototype.toJSON = function () {
  return Number(this);
};
/* eslint-enable */

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "production";
const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;
const SQUARE_DEVICE_ID = process.env.SQUARE_DEVICE_ID;
const SQUARE_CATEGORY_FILTER = process.env.SQUARE_CATEGORY_FILTER
  ? process.env.SQUARE_CATEGORY_FILTER.split(',').map(cat => cat.trim())
  : null;

// Square クライアント初期化
const squareClient = new SquareClient({
  token: SQUARE_ACCESS_TOKEN,
  environment:
    NODE_ENV === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(path.resolve(), "build")));

// -----------------------------------------------------------------------------
// ルート
// -----------------------------------------------------------------------------
app.get("/", (_req, res) => {
  res.sendFile(path.join(path.resolve(), "build", "index.html"));
});

// -----------------------------------------------------------------------------
// Terminal チェックアウト生成
// -----------------------------------------------------------------------------
app.post("/api/create-terminal-checkout", async (req, res) => {
  try {
    const { order, amountMoney, paymentType = "CARD_PRESENT" } = req.body;

    const ALLOWED = new Set(["CARD_PRESENT","FELICA_ALL", "FELICA_TRANSPORTATION_GROUP", "FELICA_ID", "FELICA_QUICPAY","QR_CODE"]);
    if (!ALLOWED.has(paymentType)) {
      return res.status(400).json({ error: "サポートされていない決済手段が指定された" });
    }

    // 注文を先に作成
    const orderId = await createOrder(order);

    // Square Terminal Checkout 作成
    const checkoutResponse = await squareClient.terminal.checkouts.create({
      idempotencyKey: randomUUID(),
      checkout: {
        amountMoney: {
          // 金額は BigInt 必須
          amount: BigInt(amountMoney.amount),
          currency: amountMoney.currency,
        },
        deviceOptions: {
          deviceId: SQUARE_DEVICE_ID,
          skip_receipt_screen: true,
          show_itemized_cart: false,
        },
        referenceId: orderId,
        orderId,
        paymentType,
        note: "セルフレジでの決済"
      },
    });

    res.json(checkoutResponse);
  } catch (error) {
    handleError("Terminal Checkout 作成エラー", error, res);
  }
});

// -----------------------------------------------------------------------------
// Terminal チェックアウト状態取得
// -----------------------------------------------------------------------------
app.get("/api/get-checkout-status", async (req, res) => {
  try {
    const { checkoutId } = req.query;
    if (!checkoutId) {
      return res.status(400).json({ error: "checkoutId が必要です" });
    }

    const response = await squareClient.terminal.checkouts.get({
      checkoutId,
    });

    res.json({
      status: response.checkout.status,
      checkout: response.checkout,
    });
  } catch (error) {
    handleError("Checkout 状態取得エラー", error, res);
  }
});

// -----------------------------------------------------------------------------
// カタログ取得  ★ 改訂ポイント
//   - すべてのページをストリームで取得
//   - 画像 / カテゴリ / バリエーション / isArchived などを付加
// -----------------------------------------------------------------------------
app.get("/api/catalog-items", async (_req, res) => {
  try {
    const TYPES = "ITEM,ITEM_VARIATION,CATEGORY,IMAGE"; // 必要なタイプをすべて列挙
    //------------------------------------------------------------------
    // ① すべて読み込む
    //------------------------------------------------------------------
    const objects = [];
    for await (const obj of await squareClient.catalog.list({ types: TYPES }))
      objects.push(obj);

    //------------------------------------------------------------------
    // ② CATEGORY / IMAGE / VARIATION を先にマップ化
    //------------------------------------------------------------------
    const imageMap     = {};
    const categoryMap  = {};
    const variationMap = {};

    for (const o of objects) {
      switch (o.type) {
        case "IMAGE":
          if (o.imageData?.url) imageMap[o.id] = o.imageData.url;
          break;
        case "CATEGORY":
          if (o.categoryData?.name) categoryMap[o.id] = o.categoryData.name;
          break;
        case "ITEM_VARIATION":
          const itemId = o.itemVariationData?.itemId;
          if (itemId) (variationMap[itemId] ||= []).push(o);
          break;
      }
    }

    //------------------------------------------------------------------
    // ③ ITEM を展開し、先に作ったマップで情報を埋め込む
    //------------------------------------------------------------------
    let filtered = objects
      .filter((o) => o.type === "ITEM")
      .map((item) => {
        const d = item.itemData ?? {};
        const imgId        = d.imageIds?.[0] ?? null;
        const categoryIds  = (d.categories ?? []).map((c) => c.id);
        const categoryNames = categoryIds.map((id) => categoryMap[id]).filter(Boolean);

        return {
          id: item.id,
          name: d.name,
          description: d.description,
          categoryIds,
          categoryNames,
          imageUrl: imgId ? imageMap[imgId] ?? null : null,
          variations: variationMap[item.id] ?? [],
          isArchived: d.isArchived ?? false,
          productType: d.productType,
          taxable: d.taxable,
          labelColor: d.labelColor,
          availableOnline: d.availableOnline,
          updatedAt: item.updatedAt,
        };
      })
      // -- 非アーカイブのみ対象 --
      .filter(item => !item.isArchived);
      
    // 環境変数でカテゴリーフィルターが指定されている場合のみフィルター適用
    if (SQUARE_CATEGORY_FILTER && SQUARE_CATEGORY_FILTER.length > 0) {
      filtered = filtered.filter(item => 
        SQUARE_CATEGORY_FILTER.some(category => 
          item.categoryNames.includes(category)
        )
      );
    }

    res.json(filtered);
  } catch (error) {
    handleError("カタログアイテム取得エラー", error, res);
  }
});

// -----------------------------------------------------------------------------
// バーコードからアイテム検索（既存実装を温存）
// -----------------------------------------------------------------------------
app.get("/api/item-by-barcode/:barcode", async (req, res) => {
  try {
    const { barcode } = req.params;

    // GTIN → バリエーション検索
    let response = await squareClient.catalog.search({
      objectTypes: ["ITEM_VARIATION"],
      query: {
        exactQuery: {
          attributeName: "upc",
          attributeValue: barcode,
        },
      },
    });

    // 見つからなければテキスト検索
    if (!response.objects?.length) {
      response = await squareClient.catalog.search({
        objectTypes: ["ITEM_VARIATION"],
        query: { textQuery: { keywords: [barcode] } },
      });
    }

    // 以降は元のロジックを踏襲
    if (response.objects?.length) {
      const variation = response.objects[0];
      const itemId = variation.itemVariationData?.itemId;

      if (itemId) {
        const itemResponse = await squareClient.catalog.object.get({
          objectId: itemId,
          includeRelatedObjects: true,
        });

        if (itemResponse.object) {
          const imgUrl =
            itemResponse.relatedObjects?.find((o) => o.type === "IMAGE")
              ?.imageData?.url ?? null;

          return res.json({
            item: itemResponse.object,
            variation,
            price: variation.itemVariationData?.priceMoney ?? null,
            name: `${itemResponse.object.itemData?.name ?? ""}${variation.itemVariationData?.name ? ` - ${variation.itemVariationData.name}` : ""}`,
            imageUrl: imgUrl,
          });
        }
      }
      return res.json({ variation });
    }

    res.status(404).json({ error: "商品が見つかりません" });
  } catch (error) {
    handleError("バーコード検索エラー", error, res);
  }
});

// -----------------------------------------------------------------------------
// 内部ユーティリティ
// -----------------------------------------------------------------------------
async function createOrder(orderData) {
  // Money.amount を bigint へ変換
  const normalizeLineItems = (items = []) => items.map((li) => {
    const money = li.basePriceMoney || {};
    return {
      ...li,
      basePriceMoney: {
        ...money,
        amount: BigInt(money.amount ?? 0), // ここで bigint 化
      },
    };
  });

  const response = await squareClient.orders.create({
    order: {
      locationId: SQUARE_LOCATION_ID,
      lineItems: normalizeLineItems(orderData.lineItems),
    },
    idempotencyKey: randomUUID(),
  });
  if (!response.order?.id) {
    throw new Error("Order ID が取得できませんでした");
  }
  return response.order.id;
}

function handleError(label, err, res) {
  if (err instanceof SquareError) {
    console.error(label, err.body);
    return res.status(err.statusCode || 500).json(err.body);
  }
  console.error(label, err);
  return res.status(500).json({ error: err.message });
}

// -----------------------------------------------------------------------------
// サーバー起動
// -----------------------------------------------------------------------------
app.listen(PORT, process.env.HOST || "0.0.0.0", () => {
  console.log(`🚀 Server running → http://localhost:${PORT}`);
});
