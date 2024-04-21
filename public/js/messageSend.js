const successMessage = document.getElementById("success-message");
const form = document.querySelector("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(form);

  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  fetch("/send-msg", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, message }),
  })
    .then((response) => {
      if (response.ok) {
        successMessage.classList.remove("hidden");
        setTimeout(function () {
          successMessage.classList.add("hidden");
        }, 5000);
        form.reset();
      } else {
        throw new Error("Error sending message");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
