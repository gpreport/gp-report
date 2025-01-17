let userObject;
let finYearObject;
let themeName;
let themesArr;

document.addEventListener("DOMContentLoaded", (event) => {
  loadInitialData();
  userObject = fetchSessionUserData();
  finYearObject = fetchSessionFinYearData();
  themeName = localStorage.getItem("themeName");
  themesArr = themeName.split("|").map((item) => item.trim());
  console.log(`themeName: ${themeName}`);

  let schemeNo = document.getElementById("schemeNo").textContent;
  let schemeName = document.getElementById("schemeName").textContent;

  setSchemeWiseNidhi(schemeNo, schemeName);
  fetchThemeActivityList();
  fetchDataList();
  setTimeout(() => {
    fetchThemeActivity();
  }, 1000);
  setSchemeWiseTabBalance(schemeName, schemeNo);
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
  calculateTotal(stepValue);
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
  let filterInput = JSON.parse(getFilterValues());
  if (filterInput.fa == "NA") {
    themeActivitiesNameList = responseData.filter(
      (theme) => theme.componentTypeEn == filterInput.type
    );
  } else {
    themeActivitiesNameList = responseData.filter(
      (theme) =>
        theme.componentTypeEn == filterInput.type &&
        theme.focusArea == filterInput.fa
    );
  }
  let lst = JSON.stringify(themeActivitiesNameList[0]);
  console.log(`theme List: ${lst}`);
  //setDataToThemeLst();
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

function saveDataAction(rowNum, formName) {
  let tab_balancedFund = document
    .getElementById("tab_balanceAmount")
    .textContent.split(".");
  let allocatedAmount = document.getElementById(`txtAmt${rowNum}`).value;
  showLoading();
  if (parseFloat(allocatedAmount) > parseFloat(tab_balancedFund[1].trim())) {
    hideLoading();
    showMsgModal(
      "Warning",
      "भरलेली रक्कम ही शिल्लक रकमेपेक्षा जास्त आहे. कृपया आपण बदल करावा.",
      "bg-warning"
    );
    return;
  }

  let apiUrl = `${m_api}?action=saveAarakhada&actionTabName=${formName}`;
  let block = getBlockValue(stepValue);
  const formData = new FormData();

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
  formData.append("schemeName", "१५ वा वित्त आयोग ");
  formData.append("allocatedAmount", allocatedAmount);
  formData.append("block", block);
  fetch(apiUrl, { method: "POST", body: formData })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      if (data.statusCode === "201 CREATED") {
        hideLoading();
        showMsgModal("", "आपण भरलेली माहिती साठवण्यात आली आहे", "bg-success");
        loadsubmitedData();
      } else {
        hideLoading();
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
  const formName = document.getElementById("formName").value;
  let apiUrl = `${m_api}?action=fifteenVitha&finYear=${finYearObject}&actionTabName=${formName}&gramCode=${userObject.gramcode}`;
  try {
    const response = await fetch(apiUrl); // Replace with your API URL
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    tblResponseData = await response.json();
    if (tblResponseData.result.length > 0) {
      setTimeout(() => {
        loadTblData(tblResponseData);
        calculateTotalAllocatedAmount(tblResponseData.result);
        hideLoading();
      }, 1000);
    } else {
      hideLoading();
    }
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function calculateTotalAllocatedAmount(tblResponseData) {
  const totalAllocatedAmount = tblResponseData.reduce((total, item) => {
    return total + item.allocatedAmount;
  }, 0);
  let allocatedNidhi = document
    .getElementById("allocatedNidhi")
    .textContent.split(" ");

  let balanceNidhi =
    parseInt(allocatedNidhi[1]) - parseInt(totalAllocatedAmount);
  document.getElementById("BalanceNidhi").textContent = `रु. ${balanceNidhi}`;
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
      allocatedAmountCell.className = `amount_${stepValue}`;
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

      createEditIcon(actionCell);

      row.appendChild(actionCell);
      // Append the row to the table body
      tableBody.appendChild(row);
    });
  }
  calculateTotal(stepValue);
}

function removeData() {
  alert("Hi remove");
}

function loadThemeTblData(themeActivitiesNamesList) {
  let list = themeActivitiesNamesList;
  // tblResponseData
  let block = getBlockValue(stepValue);
  const tableBody = document.getElementById(`table-theme-list`);
  const formName = document.getElementById("formName").value;
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
      //activityNameMrCell.textContent = item.activityNameMr;
      activityNameMrCell.className = "editable-cell";
      const cellValueSpan = document.createElement("span");
      cellValueSpan.textContent = item.activityNameMr;
      activityNameMrCell.appendChild(cellValueSpan);

      createEditIcon(activityNameMrCell, item.srNo);

      const activityNameMrinputBox = document.createElement("input");
      activityNameMrinputBox.type = "hidden";
      activityNameMrinputBox.className = "form-control tbltxt"; // Add Bootstrap class for styling
      activityNameMrinputBox.id = `txtactivityNameMr${item.srNo}`;
      activityNameMrinputBox.value = item.activityNameMr;
      activityNameMrCell.appendChild(activityNameMrinputBox);

      /*activityNameMrCell.addEventListener("click", function () {
        editCell(activityNameMrCell);
      });*/

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
      inputButton.className = "form-control btn btn-success"; // Add Bootstrap class for styling
      inputButton.id = "addbtn";
      inputButton.value = "Add";

      inputButton.addEventListener("click", function () {
        saveDataAction(item.srNo, formName);
      });

      actionCell.appendChild(inputButton);
      row.appendChild(actionCell);
      // Append the row to the table body
      tableBody.appendChild(row);
    });
  }
}

function createEditIcon(cell, srno) {
  // Create a new <span> element
  const editIcon = document.createElement("span");

  // Add class and content
  editIcon.className = "edit-icon";
  editIcon.textContent = "✏️";

  // Add the click event using addEventListener
  editIcon.addEventListener("click", function () {
    editCellValue(this, srno); // Call the editCell function and pass the clicked icon element
  });

  // Append the edit icon to the specified cell
  cell.appendChild(editIcon);
}

function editCellValue(icon, srno) {
  const cell = icon.parentElement;
  const span = cell.querySelector("span");
  const currentValue = span.textContent;

  // Create an editable div
  const editableDiv = document.createElement("div");
  editableDiv.className = "editable-div";
  editableDiv.contentEditable = "true";
  editableDiv.textContent = currentValue;

  // Add blur event to save the changes
  editableDiv.onblur = () => saveCell(cell, editableDiv, srno);

  // Replace the span with the editable div
  cell.replaceChild(editableDiv, span);

  // Focus the div and move the cursor to the end
  editableDiv.focus();
  const range = document.createRange();
  range.selectNodeContents(editableDiv);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

// Function to save the updated value
function saveCell(cell, editableDiv, srno) {
  const newValue = editableDiv.textContent.trim();
  const span = document.createElement("span");
  span.textContent = newValue;
  document.getElementById(`txtactivityNameMr${srno}`).value = newValue;

  // Replace the editable div with the span
  cell.replaceChild(span, editableDiv);
}

let responseData;
async function fetchThemeActivityList() {
  showLoading();

  const api = `https://script.google.com/macros/s/AKfycbwbeXqQTwh9MhXpyR56ox3597T2CyqfhXaa1VQUWN0YVesL6Ie4ia8iGEV3S205pgXL/exec?action=actTheme`;
  let apiUrl = `${m_api}?action=actTheme`;
  try {
    const response = await fetch(apiUrl); // Replace with your API URL
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

function setSchemeWiseNidhi(schemeNo, schemeName) {
  let allocatedNidhiAmountLst = JSON.parse(
    localStorage.getItem("allocatedNidhiAmountLst")
  );
  let usedNidhiAmountLst = JSON.parse(
    localStorage.getItem("usedNidhiAmountLst")
  );

  let totalNidhi = getAmountById(allocatedNidhiAmountLst, parseInt(schemeNo));
  document.getElementById("allocatedNidhi").textContent = `रु. ${totalNidhi}`;
  console.log(allocatedNidhiAmountLst);
  console.log(usedNidhiAmountLst);
  let balanceNidhi = totalNidhi - usedNidhiAmountLst[schemeName];
  document.getElementById("BalanceNidhi").textContent = `रु. ${balanceNidhi}`;
}

function getAmountByName(data, name) {}

function getAmountById(data, id) {
  const record = data.find((item) => item.id === id);
  if (record) {
    return record.amount; // Return the amount if the record is found
  } else {
    return "0.00"; // Handle the case where the record doesn't exist
  }
}

function calculateTotal(stepValue) {
  let total = 0;
  document.querySelectorAll(`.amount_${stepValue}`).forEach((cell) => {
    total += parseFloat(cell.textContent || 0);
  });
  document.getElementById(`total-amount_${stepValue}`).textContent = total;

  let schemeNo = document.getElementById("schemeNo").textContent;
  let schemeName = document.getElementById("schemeName").textContent;
  setSchemeWiseTabBalance(schemeName, schemeNo);
}

function setSchemeWiseTabBalance(schemeName, schemeNo) {
  let allocatedNidhiAmountLst = JSON.parse(
    localStorage.getItem("allocatedNidhiAmountLst")
  );
  let usedNidhiAmountLst = JSON.parse(
    localStorage.getItem("usedNidhiAmountLst")
  );

  let totalNidhi = getAmountById(allocatedNidhiAmountLst, parseInt(schemeNo));
  let tabBalanceNidhi;
  if (schemeName === "fifteenVitha") {
    if (stepValue == 0 || stepValue == 1) {
      tabBalanceNidhi = (parseInt(totalNidhi) * 30) / 100;
    } else if (stepValue == 2) {
      let foutyPer = (parseInt(totalNidhi) * 40) / 100;
      tabBalanceNidhi = (parseInt(foutyPer) * 25) / 100;
    } else if (stepValue == 3) {
      let foutyPer = (parseInt(totalNidhi) * 40) / 100;
      tabBalanceNidhi = (parseInt(foutyPer) * 65) / 100;
    } else if (stepValue == 4) {
      let foutyPer = (parseInt(totalNidhi) * 40) / 100;
      tabBalanceNidhi = (parseInt(foutyPer) * 10) / 100;
    }
  } else if (schemeName === "swa_nidhi") {
    if (stepValue == 0) {
      tabBalanceNidhi = (parseInt(totalNidhi) * 15) / 100;
    } else if (stepValue == 1) {
      tabBalanceNidhi = (parseInt(totalNidhi) * 10) / 100;
    } else if (stepValue == 2) {
      tabBalanceNidhi = (parseInt(totalNidhi) * 5) / 100;
    } else if (stepValue == 3) {
      tabBalanceNidhi = (parseInt(totalNidhi) * 35) / 100;
    } else if (stepValue == 4) {
      tabBalanceNidhi = (parseInt(totalNidhi) * 35) / 100;
    }
  } else {
    tabBalanceNidhi = totalNidhi;
  }
  let tabTotalAmount = document.getElementById(
    `total-amount_${stepValue}`
  ).textContent;

  let tab_balanceFund = tabBalanceNidhi - tabTotalAmount;
  document.getElementById(
    `balanceAmount_${stepValue}`
  ).textContent = `शिल्लक निधी रु. ${tab_balanceFund}`;
  document.getElementById(
    "tab_balanceAmount"
  ).textContent = `शिल्लक निधी रु. ${tab_balanceFund}`;

  if (tab_balanceFund == 0) {
    document.getElementById("addNewButton").disabled = true;
  }
}

let backToDashboard = document.getElementById("backToDashboard");

backToDashboard.addEventListener("click", () => {
  updateValue();
  window.location.href = "aarakhara-menu.html";
});

function updateValue() {
  let schemeName = document.getElementById("schemeName").textContent;
  let data = JSON.parse(localStorage.getItem("usedNidhiAmountLst"));
  let balanceNidhi = document
    .getElementById("BalanceNidhi")
    .textContent.split(" ");
  let allocatedNidhi = document
    .getElementById("allocatedNidhi")
    .textContent.split(" ");
  if (data.hasOwnProperty(schemeName)) {
    data[schemeName] = parseInt(allocatedNidhi[1]) - parseInt(balanceNidhi[1]);
    localStorage.setItem("usedNidhiAmountLst", JSON.stringify(data));
  } else {
    console.error(`Key "${schemeName}" not found in the data.`);
  }
}
