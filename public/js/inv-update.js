function enableUpdateButton(formId) {
  const form = document.querySelector(formId);
  form.addEventListener("change", function () {
    const updateBtn = form.querySelector("button");
    updateBtn.removeAttribute("disabled");
  });
}

enableUpdateButton("#updateForm");

enableUpdateButton("#updatePassForm");
