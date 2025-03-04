// Import and configure environment variables
require("dotenv").config();

// Initialize dependencies
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const app = express();

// Constants
const PORT = process.env.PORT || 5000;
const YOUR_DOMAIN = `http://localhost:${PORT}`;

// Middleware
app.use(express.static("public"));

/**
 * Creates a Stripe checkout session and redirects user to payment page
 * @route POST /create-checkout-session
 * @returns {void} Redirects to Stripe checkout URL
 */
app.post("/create-checkout-session", async (req, res) => {
  try {
    // Create a new checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.PRICE_ID, // Price ID from Stripe dashboard
          quantity: 1,
        },
      ],
      mode: "payment", // One-time payment mode
      success_url: `${YOUR_DOMAIN}/success.html`, // Redirect URL on success
      cancel_url: `${YOUR_DOMAIN}/cancel.html`, // Redirect URL on cancellation
    });

    // Redirect to Stripe checkout page with 303 status (See Other)
    res.redirect(303, session.url);
  } catch (error) {
    // Handle any errors that occur during session creation
    console.error("Error creating checkout session:", error);
    res.status(500).json({
      error: "Failed to create checkout session",
      message: error.message,
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
