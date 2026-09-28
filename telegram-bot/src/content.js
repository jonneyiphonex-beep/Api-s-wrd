export const FAQ_ANSWERS = {
  hours: "Our support hours are Monday to Friday, 09:00-17:00. Replace this with your local hours and timezone.",
  pricing: "For current pricing, visit your business website or contact our support team.",
  orders: "For order help, contact our support team with your order number. Do not send payment card details in Telegram.",
};

export const FAQ_LABELS = {
  hours: "Opening hours",
  pricing: "Pricing",
  orders: "Order help",
};

export function getWelcomeMessage(businessName) {
  return `Welcome to ${businessName} support. Choose a topic below or contact our team.`;
}