const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
  card.addEventListener("click", () => {
    console.log("goto this event");
  });
});
function setToDateConstraints() {
  let fromDate = document.getElementById('from').value;
  let toDateInput = document.getElementById('to');
  let toDate = toDateInput.value;
  toDateInput.disabled = false;
  toDateInput.min = fromDate;
  if (toDate < fromDate) {
      toDateInput.value = fromDate;
  }
}