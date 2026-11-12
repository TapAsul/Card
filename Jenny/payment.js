/* ALR STEEL PAYMENT PAGE
   Bank transfer details: tap to copy the account
   number or account name. Works inside in-app
   browsers (Messenger / Instagram / TikTok), where
   the async clipboard API is often blocked. */

const payStatus = document.getElementById("payStatus");

function setStatus(message) {
  if (payStatus) payStatus.textContent = message;
}

async function copyText(text) {
  if (!text) return false;

  // 1. Modern clipboard (https pages in a real browser)
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    /* fall through to the manual path */
  }

  // 2. Fallback that works inside in-app webviews
  try {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.top = "-1000px";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.focus();
    field.select();
    field.setSelectionRange(0, field.value.length);
    const copied = document.execCommand("copy");
    field.remove();
    return copied;
  } catch (error) {
    return false;
  }
}

async function handleCopy(value, label) {
  const copied = await copyText(value);
  setStatus(
    copied
      ? label + " copied — paste it in your banking app."
      : "Copy failed. Long-press the " + label.toLowerCase() + " to copy it manually."
  );
}

// Copy buttons
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => {
    handleCopy(button.dataset.copy || "", button.dataset.copyLabel || "Details");
  });
});

// Tapping the account number itself also copies it
const accountNumber = document.getElementById("accountNumber");
if (accountNumber) {
  accountNumber.addEventListener("click", () => {
    handleCopy(accountNumber.textContent.trim(), "Account number");
  });

  accountNumber.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCopy(accountNumber.textContent.trim(), "Account number");
    }
  });
}
