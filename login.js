var responseData;
const form = document.forms["loginForm"];
const loadingOverlay = document.getElementById("loadingOverlay");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  showLoading();
  let apiUrl = `${m_api}?action=auth`;
  fetch(apiUrl, { method: "POST", body: new FormData(form) })
    .then((response) => {
      console.log("Success!", response);
      if (response.ok) {
        // Assuming the response is JSON
        return response.json();
      }
    })
    .then((data) => {
      console.log("Success! Response data:", data);
      if (data.statusCode === "200 OK") {
        console.log("User authenticated successfully!");
        const parsedData = data.user[0];
        localStorage.setItem("user", JSON.stringify(parsedData));

        const userData = localStorage.getItem("user");

        // Parse the JSON string back into an object
        if (userData) {
          const userObject = JSON.parse(userData);
          console.log(userObject.personname); // Output: John Doe
        }
        hideLoading();
        window.location.href = "dashboard.html";
      } else {
        console.log("UnAuthorised user tried to login " + data.user);
        hideLoading();
        document.getElementById("alert-validation").style.display = "flex";
      }
      // You can now use 'data' to work with the response values
    })

    .catch((error) => console.error("Error!", error.message));
});
