module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const orderId =
      "order_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);

    const response = await fetch(
      "https://sandbox.cashfree.com/pg/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01"
        },
        body: JSON.stringify({
          order_id: orderId,
          order_amount: 499,
          order_currency: "INR",
          customer_details: {
            customer_id: "customer_" + Date.now(),
            customer_email: req.body?.email || "customer@example.com",
            customer_phone: req.body?.phone || "9999999999"
          },
          order_meta: {
            return_url:
              "https://samcreation.vercel.app/success.html?order_id={order_id}"
          },
          order_note: "AI Website to Cash Digital Product"
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json({
      payment_session_id: data.payment_session_id,
      order_id: data.order_id
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Unable to create payment order"
    });
  }
};
