module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const orderId = req.query.order_id;

  if (!orderId) {
    return res.status(400).json({
      success: false,
      error: "Order ID is required"
    });
  }

  try {
    const response = await fetch(
      `https://api.cashfree.com/pg/orders/${orderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01"
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: "Unable to verify payment"
      });
    }

    return res.status(200).json({
      success: data.order_status === "PAID",
      order_status: data.order_status,
      order_id: orderId
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Payment verification failed"
    });
  }
};
