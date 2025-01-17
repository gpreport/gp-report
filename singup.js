let distList;
let blockList;
let gramList;
let hmValue;

/*"https://script.google.com/macros/s/AKfycbwbeXqQTwh9MhXpyR56ox3597T2CyqfhXaa1VQUWN0YVesL6Ie4ia8iGEV3S205pgXL/exec";
 */
document.addEventListener("DOMContentLoaded", (event) => {
  fetchDistList();
});
async function fetchDistList() {
  showLoading();
  let apiUrl = `${m_api}?action=dist`;
  try {
    const response = await fetch(apiUrl); // Replace with your API URL
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    distList = await response.json();
    if (distList.result.length > 0) {
      setTimeout(() => {
        loadDistData();
        hideLoading();
      }, 500);
    } else {
      hideLoading();
    }
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function loadDistData() {
  const distSelectBox = document.getElementById("dist");
  distList.result.forEach((dist) => {
    const option = document.createElement("option");
    option.value = dist.distCode; // Set the value attribute
    option.textContent = `${dist.distNameEn} | ${dist.distNameMr}`; // Set the display text
    distSelectBox.appendChild(option); // Add the option to the select box
  });
}

async function fetchBlockList() {
  showLoading();
  let distCode = document.getElementById("dist").value;
  let apiUrl = `${m_api}?action=blk&distCode=${distCode}`;
  try {
    const response = await fetch(apiUrl); // Replace with your API URL
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    blockList = await response.json();
    if (blockList.result.length > 0) {
      setTimeout(() => {
        loadBlockData();
        hideLoading();
      }, 500);
    } else {
      hideLoading();
    }
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function loadBlockData() {
  const blockSelectBox = document.getElementById("block");
  blockList.result.forEach((block) => {
    const option = document.createElement("option");
    option.value = block.blockCode;
    option.textContent = `${block.blockNameEn} | ${block.blockNameMr}`; // Set the display text
    blockSelectBox.appendChild(option);
  });
}

async function fetchGramList() {
  showLoading();
  let blockCode = document.getElementById("block").value;
  let apiUrl = `${m_api}?action=grm&blockCode=${blockCode}`;
  try {
    const response = await fetch(apiUrl); // Replace with your API URL
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    gramList = await response.json();
    if (gramList.result.length > 0) {
      setTimeout(() => {
        loadGramData();
        hideLoading();
      }, 500);
    } else {
      hideLoading();
    }
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function loadGramData() {
  const gramSelectBox = document.getElementById("gram");
  gramList.result.forEach((gram) => {
    const option = document.createElement("option");
    option.value = gram.gramCode;
    option.textContent = `${gram.gramNameEn} | ${gram.gramNameMr}`; // Set the display text
    gramSelectBox.appendChild(option);
  });
}

function registerAction() {
  showLoading();
  const dist = document.getElementById("dist");
  const block = document.getElementById("block");
  const gram = document.getElementById("gram");
  let distCode = dist.value;
  const distName = dist.options[dist.selectedIndex].text.split("|");
  let blockCode = block.value;
  const blockName = block.options[block.selectedIndex].text.split("|");
  let gramCode = gram.value;
  const gramName = gram.options[gram.selectedIndex].text.split("|");

  const formData = new FormData();
  formData.append("distCode", distCode);
  formData.append("distName", distName[1]);
  formData.append("distNameEn", distName[0].trim());
  formData.append("blockCode", blockCode);
  formData.append("blockName", blockName[1]);
  formData.append("blockNameEn", blockName[0].trim());
  formData.append("gramNameEn", gramName[0].trim());
  formData.append("gramNameMr", gramName[1].trim());
  formData.append("gramCode", gramCode);
  formData.append("hmValue", hmValue);

  formData.append("personName", document.getElementById("personName").value);
  formData.append("username", document.getElementById("username").value);
  formData.append("otp", document.getElementById("otp").value);
  formData.append("phone", document.getElementById("phone").value);

  let apiUrl = `${m_api}?action=signup`;
  fetch(apiUrl, { method: "POST", body: formData })
    .then((response) => {
      console.log("Success!", response);
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      console.log("Success! Response data:", data);
      if (data.statusCode === "201 CREATED") {
        console.log("successfully!");
        hideLoading();
        showMsgModal(
          "",
          "आपली ग्रामपंचायत नोंदणी यशस्वीरित्या झाली आहे.",
          "bg-success"
        );
        generateInitDataFiles(gramCode, gramName[0].trim());
      } else if (data.statusCode === "403") {
        console.log("User already exists!");
        console.log(`Data: ${data.result[0].username}`);
        hideLoading();
        showMsgModal(
          "",
          `ग्रामपंचायत नोंदणी उपलब्ध आहे. आपण पुन्हा या वर्षासाठी नोंदणी करू शकत नाही. उपलब्ध युजर : ${data.result[0].username} `,
          "bg-warning"
        );
      }
      if (data.statusCode === "400") {
        console.log("successfully!");
        hideLoading();
        showMsgModal("", "कृपया योग्य ओ टी पी भरा.", "bg-warning");
        generateInitDataFiles(gramCode, gramName[0].trim());
      } else {
        console.log("Failed");
      }
    })
    .catch((error) => console.error("Error!", error.message));
}

function sendOtp() {
  showLoading();
  let emailId = document.getElementById("username").value;
  let apiUrl = `${m_api}?action=otpaction&emailId=${emailId}`;

  const xhr = new XMLHttpRequest();

  // Open a new connection, using the POST request
  xhr.open("POST", apiUrl, true);

  // Send the request with the JSON payload
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log("Response:", xhr.responseText);
        let response = xhr.responseText;
        hmValue = JSON.parse(response).hmvalue;
        hideLoading();
        showMsgModal(
          "",
          "ई-मेल आयडीवर ओटीपी यशस्वीरीत्या पाठवण्यात आला आहे .",
          "bg-success"
        );
      } else {
        hideLoading();
        console.error("Error:", xhr.status, xhr.statusText);
      }
    }
  };
}
