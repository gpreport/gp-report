// Function to dynamically create and show a modal
function showMsgModal(heading, message, headerbgColor) {
  // Create the modal structure
  const modalHTML = `
  <div class="modal fade" id="dynamicModal" tabindex="-1" aria-labelledby="dynamicModalLabel" aria-hidden="true">
    <div class="modal-dialog custom-modal-width">
      <div class="modal-content">
        <div class="modal-header msg-header">
          <h5 class="modal-title" id="dynamicModalLabel">${heading}</h5>
        </div>
        <div class="modal-body">
          ${message}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
`;

  // Append the modal to the body
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  const modalHeader = document.querySelector(".msg-header");
  modalHeader.className = `modal-header msg-header ${headerbgColor}`;
  //modalHeader.style.backgroundColor = "#f8d7da"; // Set your desired color here (light red)
  modalHeader.style.color = "#fff";
  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById("dynamicModal"));
  modal.show();

  // Remove the modal from the DOM once it is hidden
  document
    .getElementById("dynamicModal")
    .addEventListener("hidden.bs.modal", () => {
      document.getElementById("dynamicModal").remove();
    });
}
