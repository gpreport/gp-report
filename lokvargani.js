let userObject;
let finYearObject;
let themeName;
let themesArr;

document.addEventListener("DOMContentLoaded", (event) => {
  userObject = fetchSessionUserData();
  finYearObject = fetchSessionFinYearData();
  themeName = localStorage.getItem("themeName");
  themesArr = themeName.split("|").map((item) => item.trim());
  console.log(`themeName: ${themeName}`);

  fetchThemeActivityList();
  fetchDataList();
  setTimeout(() => {
    fetchThemeActivity();
  }, 1000);
});
const steps = document.querySelectorAll(".step");
const formSteps = document.querySelectorAll(".form-step");
const btnNext = document.querySelector(".btn-next");
const btnPrev = document.querySelector(".btn-prev");

let currentStep = 0;
let stepValue = 0;

btnNext.addEventListener("click", () => {
  if (currentStep < steps.length - 1) {
    steps[currentStep].classList.remove("active");
    formSteps[currentStep].classList.remove("active");
    currentStep++;
    steps[currentStep].classList.add("active");
    formSteps[currentStep].classList.add("active");
  }
  stepValue = stepValue + 1;
  loadTblData(tblResponseData);
  fetchThemeActivity();
  updateButtons();
});

btnPrev.addEventListener("click", () => {
  if (currentStep > 0) {
    steps[currentStep].classList.remove("active");
    formSteps[currentStep].classList.remove("active");
    currentStep--;
    steps[currentStep].classList.add("active");
    formSteps[currentStep].classList.add("active");
  }
  stepValue = stepValue - 1;
  // fetchBlockTblData(stepValue);
  loadTblData(tblResponseData);
  fetchThemeActivity();
  updateButtons();
});
console.log(`stepValue: ${stepValue}`);
function updateButtons() {
  btnPrev.disabled = currentStep === 0;
  btnNext.disabled = currentStep === steps.length - 1;

  // Populate the review step if on the last step
  if (currentStep === steps.length - 1) {
    document.getElementById("review-name").textContent =
      document.getElementById("name").value;
    document.getElementById("review-age").textContent =
      document.getElementById("age").value;
    document.getElementById("review-email").textContent =
      document.getElementById("email").value;
    document.getElementById("review-phone").textContent =
      document.getElementById("phone").value;
  }
}
let themeActivitiesNameList;
let dataList;

function fetchThemeActivity() {
  themeActivitiesNameList = responseData;
  loadThemeTblData(themeActivitiesNameList);
}

function getFilterValues() {
  if (stepValue == 0) {
    return `{"fa":"Sanitation","type":"tied Grants"}`;
  } else if (stepValue == 1) {
    return `{"fa":"Drinking water","type":"tied Grants"}`;
  } else if (stepValue == 2) {
    return `{"fa":"NA","type":"Untied Grants"}`;
  } else if (stepValue == 3) {
    return `{"fa":"NA","type":"Untied Grants"}`;
  } else if (stepValue == 4) {
    return `{"fa":"NA","type":"Untied Grants"}`;
  }
}

function getBlockValue(stepValue) {
  if (stepValue == 0) {
    return "A";
  } else if (stepValue == 1) {
    return "B";
  } else if (stepValue == 2) {
    return "C";
  } else if (stepValue == 3) {
    return "D";
  } else if (stepValue == 4) {
    return "E";
  }
}

//const activityList = document.getElementById("activity");
/*
function setDataToThemeLst() {
  let list = themeActivitiesNameList;
  if (stepValue == 2) {
    let theme_1_ActivityList = list.filter(
      (item) => item.themeNameMr.trim() == themesArr[0].trim()
    );
    let theme_2_ActivityList = list.filter(
      (item) => item.themeNameMr.trim() == themesArr[1].trim()
    );
    list = [...theme_1_ActivityList, ...theme_2_ActivityList];
  }
  activityList.innerHTML = ""; // Clears all options
  list.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.activityNameEn; // Set option value as id
    option.textContent = item.activityNameEn; // Set option text as tharav_name
    activityList.appendChild(option);
  });
}

activityList.addEventListener("change", () => {
  // Uncheck the checkbox and update
  let activity = activityList.value;
  let list = themeActivitiesNameList;
  let filteredList = list.filter((item) => item.activityNameEn === activity);
  document.getElementById("activityDetails").value =
    filteredList[0].activityNameMr;
  document.getElementById("focusArea").value = filteredList[0].focusArea;
  document.getElementById("componentType").value =
    filteredList[0].componentTypeMr;
});
*/
function saveDataAction(rowNum) {
  GPAPI = fetchApiUrl("/exec?action=lokvarganinidhi");
  let block = getBlockValue(stepValue);
  const formData = new FormData();

  let allocatedAmount = document.getElementById(`txtAmt${rowNum}`).value;
  let activityNameEng = document.getElementById(
    `txtactivityNameEng${rowNum}`
  ).value;
  let acitityNameMr = document.getElementById(
    `txtactivityNameMr${rowNum}`
  ).value;
  let focusArea = document.getElementById(`txtfocusArea${rowNum}`).value;
  let componentType = document.getElementById(
    `txtcomponentTypeMr${rowNum}`
  ).value;
  formData.append("finYear", finYearObject);
  formData.append("gramCode", userObject.gramcode);
  formData.append("themeName", themeName);
  formData.append("activity", activityNameEng);
  formData.append("acitityNameMr", acitityNameMr);
  formData.append("focusArea", focusArea);
  formData.append("componentType", componentType);
  formData.append("schemeName", "लोकसहभाग / लोकवर्गणी");
  formData.append("allocatedAmount", allocatedAmount);
  formData.append("block", block);
  fetch(GPAPI, { method: "POST", body: formData })
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
        loadsubmitedData();
        // window.location.href = "fifteenVitaAayog.html";
      } else {
        console.log("Failed");
      }
    })
    .catch((error) => console.error("Error!", error.message));
}

function loadsubmitedData() {
  document.getElementById("closeButton").click();
  fetchDataList();
  loadTblData(tblResponseData);
}

let tblResponseData;
async function fetchDataList() {
  GPAPI = fetchApiUrl("/exec?action=lokvarganinidhi");
  GPAPI = `${GPAPI}&finYear=${finYearObject}`;
  try {
    const response = await fetch(GPAPI); // Replace with your API URL
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    tblResponseData = await response.json();
    if (tblResponseData.result.length > 0) {
      setTimeout(() => {
        loadTblData(tblResponseData);
        hideLoading();
      }, 1000);
    } else {
      hideLoading();
    }
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function loadTblData(tblResponseData) {
  // tblResponseData
  let block = getBlockValue(stepValue);
  const tableBody = document.getElementById(`table-body-${block}`);
  tableBody.innerHTML = "";

  if (tblResponseData.result.length > 0) {
    let tblResponseDataLst = tblResponseData.result.filter(
      (item) => item.block == block
    );
    tblResponseDataLst.forEach((item) => {
      // Create a new row
      const row = document.createElement("tr");
      // Create and append the ID cell
      const activityCell = document.createElement("td");
      activityCell.textContent = item.activity;
      row.appendChild(activityCell);

      // Create and append the Nidhi Head Name cell
      const acitityNameMrCell = document.createElement("td");
      acitityNameMrCell.textContent = item.acitityNameMr;
      row.appendChild(acitityNameMrCell);

      // Create and append the Nidhi Head Name cell
      const focusAreaCell = document.createElement("td");
      focusAreaCell.textContent = item.focusArea;
      row.appendChild(focusAreaCell);

      const componentTypeCell = document.createElement("td");
      componentTypeCell.textContent = item.componentType;
      row.appendChild(componentTypeCell);

      const allocatedAmountCell = document.createElement("td");
      allocatedAmountCell.textContent = item.allocatedAmount;
      row.appendChild(allocatedAmountCell);

      const actionCell = document.createElement("td");
      const inputButton = document.createElement("input");

      inputButton.type = "button";
      inputButton.className = "form-control btn text-danger"; // Add Bootstrap class for styling
      inputButton.id = "removebtn";
      inputButton.value = "X";

      inputButton.addEventListener("click", function () {
        removeData();
      });
      actionCell.appendChild(inputButton);
      row.appendChild(actionCell);
      // Append the row to the table body
      tableBody.appendChild(row);
    });
  }
}

function removeData() {
  alert("Hi remove");
}

function loadThemeTblData(themeActivitiesNamesList) {
  let list = themeActivitiesNamesList;
  // tblResponseData
  let block = getBlockValue(stepValue);
  const tableBody = document.getElementById(`table-theme-list`);
  tableBody.innerHTML = "";
  if (list.length > 0) {
    list.forEach((item) => {
      // Create a new row
      const row = document.createElement("tr");
      // Create and append the ID cell
      const themeNameEnCell = document.createElement("td");
      themeNameEnCell.textContent = item.themeNameEn;
      themeNameEnCell.className = "tbltd";
      row.appendChild(themeNameEnCell);

      // Create and append the Nidhi Head Name cell
      const themeNameMrCell = document.createElement("td");
      themeNameMrCell.textContent = item.themeNameMr;
      themeNameMrCell.className = "tbltd";
      row.appendChild(themeNameMrCell);

      // Create and append the Nidhi Head Name cell
      const activityNameEnCell = document.createElement("td");
      activityNameEnCell.textContent = item.activityNameEn;
      activityNameEnCell.className = "tbltd";

      const activityNameEnginputBox = document.createElement("input");
      activityNameEnginputBox.type = "hidden";
      activityNameEnginputBox.className = "form-control tbltxt"; // Add Bootstrap class for styling
      activityNameEnginputBox.id = `txtactivityNameEng${item.srNo}`;
      activityNameEnginputBox.value = item.activityNameEn;
      activityNameEnCell.appendChild(activityNameEnginputBox);

      row.appendChild(activityNameEnCell);

      const activityNameMrCell = document.createElement("td");
      activityNameMrCell.textContent = item.activityNameMr;
      activityNameMrCell.className = "tbltd";

      const activityNameMrinputBox = document.createElement("input");
      activityNameMrinputBox.type = "hidden";
      activityNameMrinputBox.className = "form-control tbltxt"; // Add Bootstrap class for styling
      activityNameMrinputBox.id = `txtactivityNameMr${item.srNo}`;
      activityNameMrinputBox.value = item.activityNameMr;
      activityNameMrCell.appendChild(activityNameMrinputBox);

      row.appendChild(activityNameMrCell);

      const focusAreaCell = document.createElement("td");
      focusAreaCell.className = "tbltd";
      focusAreaCell.textContent = item.focusArea;

      const focusAreainputBox = document.createElement("input");
      focusAreainputBox.type = "hidden";
      focusAreainputBox.className = "form-control tbltxt"; // Add Bootstrap class for styling
      focusAreainputBox.id = `txtfocusArea${item.srNo}`;
      focusAreainputBox.value = item.focusArea;
      focusAreaCell.appendChild(focusAreainputBox);

      row.appendChild(focusAreaCell);

      const componentTypeMrCell = document.createElement("td");
      componentTypeMrCell.className = "tbltd";
      componentTypeMrCell.textContent = item.componentTypeMr;

      const componentTypeMrinputBox = document.createElement("input");
      componentTypeMrinputBox.type = "hidden";
      componentTypeMrinputBox.className = "form-control tbltxt"; // Add Bootstrap class for styling
      componentTypeMrinputBox.id = `txtcomponentTypeMr${item.srNo}`;
      componentTypeMrinputBox.value = item.componentTypeMr;
      componentTypeMrCell.appendChild(componentTypeMrinputBox);

      row.appendChild(componentTypeMrCell);

      const workTypeCell = document.createElement("td");
      workTypeCell.className = "tbltd";
      workTypeCell.textContent = item.workType;
      row.appendChild(workTypeCell);

      const allocatedAmtCell = document.createElement("td");
      allocatedAmtCell.className = "tbltd";
      const inputBox = document.createElement("input");
      inputBox.type = "text";
      inputBox.className = "form-control amt tbltxt"; // Add Bootstrap class for styling
      inputBox.placeholder = "Enter Amount";
      inputBox.id = `txtAmt${item.srNo}`;
      inputBox.value = 0.0;
      allocatedAmtCell.appendChild(inputBox);
      row.appendChild(allocatedAmtCell);
      // Append the row to the table body  rowNum

      const actionCell = document.createElement("td");
      actionCell.className = "tbltd";
      const inputButton = document.createElement("input");

      inputButton.type = "button";
      inputButton.className = "form-control"; // Add Bootstrap class for styling
      inputButton.id = "addbtn";
      inputButton.value = "Add";

      inputButton.addEventListener("click", function () {
        saveDataAction(item.srNo);
      });

      actionCell.appendChild(inputButton);
      row.appendChild(actionCell);
      // Append the row to the table body
      tableBody.appendChild(row);
    });
  }
}

let responseData;
async function fetchThemeActivityList() {
  showLoading();

  const api = `https://script.google.com/macros/s/AKfycbwbeXqQTwh9MhXpyR56ox3597T2CyqfhXaa1VQUWN0YVesL6Ie4ia8iGEV3S205pgXL/exec?action=actTheme`;
  try {
    const response = await fetch(api); // Replace with your API URL
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    responseData = await response.json();
    if (responseData.length > 0) {
      setTimeout(() => {
        fetchThemeActivity();
        hideLoading();
      }, 1000);
    } else {
      hideLoading();
    }
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function filterTable() {
  console.log(`searchType ${searchType}`);
  const input = document.getElementById("searchBox");
  let list;
  if (searchType === "eng") {
    const filter = input.value.toLowerCase();
    list = themeActivitiesNameList.filter((item) =>
      item.activityNameEn.toLowerCase().includes(filter)
    );
  } else {
    const filter = input.value;
    list = themeActivitiesNameList.filter((item) =>
      item.activityNameMr.includes(filter)
    );
  }

  loadThemeTblData(list);
}

// Add event listeners to option buttons
const optionButtons = document.querySelectorAll(".option-btn");
let searchType;
optionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    optionButtons.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");
    searchType = button.getAttribute("data-value"); // Get the data-value
    console.log("Selected Value:", searchType); // Log the selected value
    // You can use this value as needed, e.g., populate a hidden input or display it somewhere
  });
});

const searchInput = document.getElementById("searchBox");

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    filterTable(); // Call the desired method
  }
});

function saveData(rowNum) {
  let allocatedAmount = document.getElementById(`txtAmt${rowNum}`).value;
  let activityNameEng = document.getElementById(
    `txtactivityNameEng${rowNum}`
  ).value;
  let acitityNameMr = document.getElementById(
    `txtactivityNameMr${rowNum}`
  ).value;
  let focusArea = document.getElementById(`txtfocusArea${rowNum}`).value;
  let componentType = document.getElementById(
    `txtcomponentTypeMr${rowNum}`
  ).value;
}
