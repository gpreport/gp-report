let GPAPI;
let themeNameList;
let finYear;
let gramCode;
let gramNidhiHeads;
document.addEventListener("DOMContentLoaded", (event) => {
  let userObject = fetchSessionUserData();
  let finYearObject = fetchSessionFinYearData();
  loadInitialData();
  document.getElementById("finYearLbl").textContent = finYearObject;
  finYear = finYearObject;
  gramCode = userObject.gramcode;
  let gramTharav = fetchGramTharav();
  fetchsarvaSadharanMahiti();
  fetchNidhiList();
  fetchGramInfo(userObject.gramcode, finYearObject);
  fetchThemeNames();
  addDropdownOptions();
  setPdiScoreData();
  //console.log(`themeNameList : ${themeNameList.result}`);
  //addDropdownOptions(themeNameList.result);
});

document.getElementById("modalwindow").addEventListener("change", () => {
  const modalElement = document.getElementById("myModal");
  const modal = new bootstrap.Modal(modalElement); // Initialize the modal
  modal.show(); // Show the modal
});

function setPdiScoreData() {
  let pdiScoreData = localStorage.getItem("pdiScoreData");
  console.log(`pdiScoreData: ${pdiScoreData}`);
  let pdiScore = JSON.parse(pdiScoreData)[0];
  document.getElementById("totalpdi").textContent = pdiScore.totoalPIDScore;
  document.getElementById("theme_1").textContent = pdiScore.theme_1;
  document.getElementById("theme_2").textContent = pdiScore.theme_2;
  document.getElementById("theme_3").textContent = pdiScore.theme_3;
  document.getElementById("theme_4").textContent = pdiScore.theme_4;
  document.getElementById("theme_5").textContent = pdiScore.theme_5;
  document.getElementById("theme_6").textContent = pdiScore.theme_6;
  document.getElementById("theme_7").textContent = pdiScore.theme_7;
  document.getElementById("theme_8").textContent = pdiScore.theme_8;
  document.getElementById("theme_9").textContent = pdiScore.theme_9;
  //EE7E2A
  //#F3D05A
  //#86C68E
  const table = document.getElementById("pditable");
  Array.from(table.getElementsByTagName("td")).forEach((cell, index) => {
    console.log(cell.innerHTML);
    if (cell.innerHTML < 60) {
      // Example: Apply color to even-indexed cells
      cell.style.backgroundColor = "#EE7E2A";
    } else if (cell.innerHTML >= 60 && cell.innerHTML < 80) {
      cell.style.backgroundColor = "#F3D05A";
    } else if (cell.innerHTML >= 80) {
      cell.style.backgroundColor = "#86C68E";
    }
  });
}

async function fetchGramTharav() {
  showLoading();
  //GPAPI = fetchApiUrl("/exec?action=gramTharav");
  let apiUrl = `${m_api}?action=gramTharav`;
  try {
    const response = await fetch(apiUrl); // Replace with your API URL
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    let responseData = await response.json();
    if (responseData.result.length > 0) {
      setTimeout(() => {
        setDataToTarav(responseData.result);
        hideLoading();
      }, 1000);
    } else {
      hideLoading();
    }
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

async function fetchNidhiHeads() {
  showLoading();
  //GPAPI = fetchApiUrl("/exec?action=nidhiHead");
  let apiUrl = `${m_api}?action=nidhiHead`;
  try {
    const response = await fetch(apiUrl); // Replace with your API URL
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    let responseData = await response.json();
    if (responseData.result.length > 0) {
      setTimeout(() => {
        console.log(JSON.stringify(responseData));
        setDataToNidhiHeads(responseData.result, "initial");
        gramNidhiHeads = responseData.result;
        hideLoading();
      }, 1000);
    } else {
      hideLoading();
    }
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

async function fetchGramInfo(gramCode, finYear) {
  showLoading();
  //GPAPI = fetchApiUrl("/exec?action=gpInfo");
  // GPAPI = `${GPAPI}&gramCode=${gramCode}&finYear=${finYear}`;
  let apiUrl = `${m_api}?action=gpInfo&gramCode=${gramCode}&finYear=${finYear}`;
  try {
    const response = await fetch(apiUrl); // Replace with your API URL
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    let responseData = await response.json();
    if (responseData.result.length > 0) {
      setTimeout(() => {
        setGramInfoData(responseData.result);
        hideLoading();
      }, 1000);
    } else {
      hideLoading();
    }
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function setGramInfoData(gramInfo) {
  document.getElementById("totalAnusushitJatiJamati").textContent =
    gramInfo[0].totalAnusuchitJatiJamati;
  document.getElementById("totalAnusushitJatiJamatiPer").textContent =
    gramInfo[0].anusuchitJatiJamatiPer;
  document.getElementById("anusuchitJatiMale").textContent =
    gramInfo[0].maleAnusuchitJati;
  document.getElementById("anusuchitJamatiMale").textContent =
    gramInfo[0].maleAnusuchitJamati;
  document.getElementById("othersMale").textContent = gramInfo[0].maleOthers;
  document.getElementById("totalMale").textContent = gramInfo[0].totalMale;
  document.getElementById("anusuchitJamatiFeMale").textContent =
    gramInfo[0].femaleAnusuchitJamati;
  document.getElementById("anusuchitJatiFeMale").textContent =
    gramInfo[0].femaleAnusuchitJati;
  document.getElementById("othersFeMale").textContent =
    gramInfo[0].femaleOthers;
  document.getElementById("totalFeMale").textContent = gramInfo[0].totalFemale;
  document.getElementById("totalAnusushitJamati").textContent =
    gramInfo[0].totalAnusuchitJamati;
  document.getElementById("totalAnusushitJati").textContent =
    gramInfo[0].totalAnusuchitJati;
  document.getElementById("totalOthers").textContent = gramInfo[0].totalOthers;
  document.getElementById("totalPopulation").textContent =
    gramInfo[0].totalPopulation;
}

function setDataToTarav(tharavData) {
  const selectBox = document.getElementById("tharav-select");
  tharavData.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.tharav_name; // Set option value as id
    option.textContent = item.tharav_name; // Set option text as tharav_name
    selectBox.appendChild(option);
  });
}
let totalHeads = 0;
function setDataToNidhiHeads(nidhiHeads, actionType) {
  const tableBody = document.getElementById("table-body");
  let totalAmount = 0.0;
  nidhiHeads.forEach((item) => {
    // Create a new row
    totalAmount = totalAmount + item.amount;
    const row = document.createElement("tr");
    totalHeads++;
    // Create and append the ID cell
    const idCell = document.createElement("td");
    idCell.textContent = item.id;
    row.appendChild(idCell);

    // Create and append the Nidhi Head Name cell
    const nameCell = document.createElement("td");

    if (item.id === 1 || item.id === 2) {
      let dataType;
      if (item.id === 1) {
        dataType = "fifteen";
      } else {
        dataType = "swanidhi";
      }
      const viewImage = document.createElement("img");
      viewImage.src = "https://cdn-icons-png.flaticon.com/512/709/709612.png"; // Use an appropriate view icon
      viewImage.alt = "View";
      viewImage.style.cursor = "pointer";
      viewImage.style.width = "20px";
      viewImage.style.marginLeft = "10px";
      viewImage.onclick = () => calculateFifteenVithaVargikaran(dataType);
      viewImage.setAttribute("data-bs-toggle", "modal");
      viewImage.setAttribute("data-bs-target", "#tableModal");
      // button.textContent = "View Table";

      // Append the button to the container div
      //containerDiv.appendChild(button);

      // Append the container div to the body (or any other desired parent element)
      //document.body.appendChild(containerDiv);

      nameCell.textContent = `${item.nidhi_head_name}`;
      nameCell.appendChild(viewImage);
    } else {
      nameCell.textContent = item.nidhi_head_name;
    }

    row.appendChild(nameCell);

    // Create and append the Rupees cell with input
    const rupeesCell = document.createElement("td");
    const inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.className = "form-control amt"; // Add Bootstrap class for styling
    inputBox.placeholder = "Enter Amount";
    inputBox.id = `txt${item.id}`;
    if (actionType === "fetch") {
      inputBox.value = item.amount;
    } else {
      inputBox.value = 0.0;
    }

    if (item.id === 2) {
      inputBox.addEventListener("change", function () {
        document.getElementById("txt3").value = Math.round(
          (inputBox.value / 100) * 10
        );
      });
    }
    inputBox.addEventListener("change", function () {
      let totalAmount = 0;
      let totalHeadsArr = Array.from(
        { length: totalHeads },
        (_, index) => index
      );
      totalHeadsArr.forEach((i) => {
        if (i !== 2) {
          totalAmount =
            parseFloat(totalAmount) +
            parseFloat(document.getElementById(`txt${i + 1}`).value);
        }
      });
      document.getElementById("total-amount").value = totalAmount;
    });
    rupeesCell.appendChild(inputBox);
    row.appendChild(rupeesCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  });
  document.getElementById("total-amount").value = totalAmount;
}

function calculateFifteenVithaVargikaran(actionType) {
  let apiUrl = `${m_api}?action=categoryHeadLst`;
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, false); // `false` makes it synchronous
    xhr.send();
    if (xhr.status === 200) {
      createTableRows(xhr.responseText, actionType);
    } else {
      console.error("Error:", xhr.statusText);
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

function calculateAmounts(total, categories) {
  return categories.map((category) => ({
    ...category,
    amount: Math.round((category.percentage / 100) * total).toFixed(2),
  }));
}

function createTableRows(categories, actionType) {
  let categoriesLst = JSON.parse(categories);

  let categoryAmounts;
  if (actionType === "fifteen") {
    let fifteenVithaTotalAmount = document.getElementById("txt1").value;

    document.getElementById("allocatedNidhi").textContent =
      fifteenVithaTotalAmount;
    const categoryAmountsLst_1 = calculateAmounts(
      fifteenVithaTotalAmount,
      categoriesLst.result.slice(0, 3)
    );

    const categoryAmountsLst_2 = calculateAmounts(
      categoryAmountsLst_1[2].amount,
      categoriesLst.result.slice(3, 6)
    );

    categoryAmounts = [...categoryAmountsLst_1, ...categoryAmountsLst_2];
  } else {
    let swanidhiTotalAmount = document.getElementById("txt2").value;
    let categoryList = categoriesLst.result.filter(
      (item) => item.type === "swanidhi"
    );
    document.getElementById("allocatedNidhi").textContent = swanidhiTotalAmount;
    categoryAmounts = calculateAmounts(swanidhiTotalAmount, categoryList);
  }

  const tableBody = document.getElementById("vargikarn-table");
  tableBody.innerHTML = "";
  categoryAmounts.forEach((item, index) => {
    const row = document.createElement("tr");

    // Sr. No. Cell
    //const srNoCell = document.createElement("td");
    //srNoCell.textContent = index + 1;
    // row.appendChild(srNoCell);

    // Category Name Cell
    const nameCell = document.createElement("td");
    nameCell.textContent = item.category.replace("_", item.percentage);
    row.appendChild(nameCell);

    // Percentage Cell
    //const percentageCell = document.createElement("td");
    // percentageCell.textContent = `${item.percentage}%`;
    //row.appendChild(percentageCell);

    // Amount Cell
    const amountCell = document.createElement("td");
    amountCell.textContent = `₹${item.amount}`;
    row.appendChild(amountCell);

    // Append row to table body
    tableBody.appendChild(row);
  });
}

const tableBody = document.getElementById("dynamic-table");
const addMoreButton = document.getElementById("add-more-btn");
let rowCount = 1; // Keep track of row count

// Function to update row numbers
const updateRowNumbers = () => {
  const rows = tableBody.querySelectorAll("tr");
  rows.forEach((row, index) => {
    row.querySelector("td:first-child").textContent = index + 1; // Update the row number
  });
};

function fetchThemeNames() {
  showLoading();
  //GPAPI = fetchApiUrl("/exec?action=thmlst");
  let apiUrl = `${m_api}?action=thmlst`;
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiUrl, false); // `false` makes it synchronous
    xhr.send();
    if (xhr.status === 200) {
      themeNameList = xhr.responseText;
    } else {
      console.error("Error:", xhr.statusText);
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

const dropdownMenu = document.getElementById("checkboxDropdown");
// Function to dynamically add options to the dropdown
function addDropdownOptions() {
  let list = JSON.parse(themeNameList);

  // Clear existing options
  dropdownMenu.innerHTML = "";

  // Add new options with checkboxes
  list.result.forEach((option) => {
    const listItem = document.createElement("li");
    const label = document.createElement("label");
    label.className = "dropdown-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = option.themeNameMr;
    checkbox.addEventListener("change", updateSelectedValues); // Add event listener

    label.appendChild(checkbox);
    label.append(` ${option.themeNameMr}`);
    listItem.appendChild(label);
    dropdownMenu.appendChild(listItem);
  });
}

// Function to update the input box based on selected checkboxes
function updateSelectedValues() {
  const selectedValuesInput = document.getElementById("selectedValues");
  const selectedValuesContainer = document.getElementById(
    "selectedValuesContainer"
  );
  selectedValuesContainer.innerHTML = "";
  const selectedOptions = Array.from(
    dropdownMenu.querySelectorAll("input[type=checkbox]:checked")
  );

  // Update the input field with comma-separated values
  selectedValuesInput.value = selectedOptions
    .map((checkbox) => checkbox.value)
    .join(" | ");

  // Add badges for each selected option
  selectedOptions.forEach((option) => {
    const badge = document.createElement("span");
    badge.className = "badge bg-primary";

    badge.textContent = option.value;

    // Add a close button for the badge
    const closeButton = document.createElement("button");
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", () => {
      // Uncheck the checkbox and update
      option.checked = false;
      updateSelectedValues();
    });

    badge.appendChild(closeButton);
    selectedValuesContainer.appendChild(badge);
  });
}

function calculateFifteenVithaAmount() {
  let andajeetAllocatedAmount = document.getElementById(
    "andajeetAllocatedAmount"
  ).value;
  let yearlyNidhiper = document.getElementById("yearlyNidhiper").value;

  document.getElementById("txt1").value = Math.round(
    andajeetAllocatedAmount * yearlyNidhiper
  );
}
const inputs = document.getElementsByClassName("amt");
const specificInput = inputs[0]; // Target the first input with

function saveData() {
  const formData = new FormData();
  let themeName = document.getElementById("selectedValues").value;
  formData.append("finYear", finYear);
  formData.append("themeName", themeName);
  formData.append("gramCode", gramCode);
  formData.append(
    "andajeetAllocatedAmt",
    document.getElementById("andajeetAllocatedAmount").value
  );
  formData.append(
    "yearlyNidhiper",
    document.getElementById("yearlyNidhiper").value
  );
  formData.append("tharav", document.getElementById("tharav-select").value);
  formData.append(
    "gramTharavNo",
    document.getElementById("gramTharavNo").value
  );

  //GPAPI = fetchApiUrl("/exec?action=sarvsadharanmahiti");
  let apiUrl = `${m_api}?action=sarvsadharanmahiti`;
  fetch(apiUrl, { method: "POST", body: formData })
    .then((response) => {
      console.log("Success!", response);
      if (response.ok) {
        localStorage.setItem("themeName", themeName);
        return response.json();
      }
    })
    .then((data) => {
      console.log("Success! Response data:", data);
      if (data.statusCode === "201 CREATED") {
        console.log("successfully!");
      } else if (data.statusCode === "201 UPDATED") {
        console.log("updated successfully!");
      } else {
        console.log("Failed");
      }
    })
    .catch((error) => console.error("Error!", error.message));
  let counter = 0;
  let responses = [];
  gramNidhiHeads.forEach((item) => {
    let amt = document.getElementById(`txt${item.id}`).value;
    responses = saveNidhiData(
      finYear,
      gramCode,
      item.nidhi_head_name,
      amt,
      item.id
    );
  });
  console.log(responses);
}

function saveNidhiData(finYear, gramCode, nidhiHead, amount, srno) {
  const formGramNidhiData = new FormData();
  formGramNidhiData.append("srno", srno);
  formGramNidhiData.append("year", finYear);
  formGramNidhiData.append("gramCode", gramCode);
  formGramNidhiData.append("nidhiHead", nidhiHead);
  formGramNidhiData.append("amount", amount);

  //GPAPI = fetchApiUrl("/exec?action=saveNidhi");
  let apiUrl = `${m_api}?action=saveNidhi`;
  fetch(apiUrl, { method: "POST", body: formGramNidhiData })
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
        return "CREATED";
      } else if (data.statusCode === "201 UPDATED") {
        console.log("updated successfully!");
        return "UPDATED";
      } else {
        console.log("Failed");
        return "FAILED";
      }
    })
    .catch((error) => console.error("Error!", error.message));
}

async function fetchNidhiList() {
  showLoading();
  //GPAPI = fetchApiUrl("/exec?action=nidhiHead");
  let apiUrl = `${m_api}?action=nidhiHeadLst&finYear=${finYear}&gramCode=${gramCode}`;
  try {
    const response = await fetch(apiUrl); // Replace with your API URL
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    let responseData = await response.json();
    if (responseData.result.length > 0) {
      setTimeout(() => {
        gramNidhiHeads = responseData.result;
        setDataToNidhiHeads(responseData.result, "fetch");
        hideLoading();
      }, 1000);
    } else {
      hideLoading();
      fetchNidhiHeads();
    }
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

async function fetchsarvaSadharanMahiti() {
  showLoading();
  let apiUrl = `${m_api}?action=sarvsadharanmahiti&finYear=${finYear}&gramCode=${gramCode}`;
  try {
    const response = await fetch(apiUrl); // Replace with your API URL
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    let responseData = await response.json();
    if (responseData.result.length > 0) {
      setTimeout(() => {
        setData(responseData.result);
        hideLoading();
      }, 1000);
    } else {
      hideLoading();
    }
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function setData(data) {
  /*document.getElementById("selectedValuesContainer").innerHTML =
    data[0].aarakhadaName;*/
  document.getElementById("andajeetAllocatedAmount").value =
    data[0].andajeetAmount;
  document.getElementById("yearlyNidhiper").value = data[0].yearlyNidhiPer;
  document.getElementById("tharav-select").text = data[0].tharavName;
  document.getElementById("tharav-select").value = data[0].tharavName;
  document.getElementById("gramTharavNo").value = data[0].tharavNo;

  //let themeNames = data[0].aarakhadaName.split("|").trim();
  const themeNames = data[0].aarakhadaName
    .split("|")
    .map((item) => item.trim());

  const checkboxes = document.querySelectorAll(
    '#checkboxDropdown input[type="checkbox"]'
  );

  // Loop through each checkbox and mark it as checked if it matches the input values
  checkboxes.forEach((checkbox) => {
    if (themeNames.includes(checkbox.value.trim())) {
      checkbox.checked = true; // Mark the checkbox as checked
    } else {
      checkbox.checked = false; // Uncheck it if not in the list
    }
  });

  themeNames.forEach((option) => {
    const badge = document.createElement("span");
    badge.className = "badge bg-primary";

    badge.textContent = option;

    // Add a close button for the badge
    const closeButton = document.createElement("button");
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", () => {
      // Uncheck the checkbox and update
      option.checked = false;
      updateSelectedValues();
    });

    badge.appendChild(closeButton);
    selectedValuesContainer.appendChild(badge);
  });
}
