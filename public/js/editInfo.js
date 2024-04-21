const editBtn = document.querySelector(".edit");
const formElements = document.querySelectorAll(".form-elements");
const btnContainer = document.querySelector(".btn-container");

formElements.forEach((element) => {
  element.disabled = true;
});

editBtn.addEventListener("click", function () {
  formElements.forEach((element) => {
    element.disabled = !element.disabled;
  });
  editBtn.remove();
  const saveBtn = document.createElement("button");
  saveBtn.classList.add("save");
  saveBtn.textContent = "Save";
  saveBtn.type = "submit";

  btnContainer.appendChild(saveBtn);
});
