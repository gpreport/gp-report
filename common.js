const scriptURL =
  "https://script.google.com/macros/s/AKfycbwbeXqQTwh9MhXpyR56ox3597T2CyqfhXaa1VQUWN0YVesL6Ie4ia8iGEV3S205pgXL/exec?action=auth";

let api =
  "https://script.google.com/macros/s/AKfycbwbeXqQTwh9MhXpyR56ox3597T2CyqfhXaa1VQUWN0YVesL6Ie4ia8iGEV3S205pgXL/exec";

let m_api =
  "https://script.google.com/macros/s/AKfycbymOUVgiNtVeEfrnsOdZ_JstOowvfU0ne4sTuGbG8k-Qi0h4_xYdvdUs06KwuesdWps/exec";

let pdiScoreData;

document.addEventListener("DOMContentLoaded", function () {
  fetch("navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar").innerHTML = data;
      const userData = localStorage.getItem("user");
      const userObject = JSON.parse(userData);
      document.getElementById(
        "gpName"
      ).innerHTML = `ग्रामपंचायत - ${userObject.gramnamemr}, ${userObject.blockname}, ${userObject.distname} `;
      document.getElementById("username").textContent = userObject.personname;

      let finYear = localStorage.getItem("finYear");
      document.getElementById("financialYear").textContent = finYear;

      const logout = document.getElementById("logout");

      logout.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "login.html";
      });
    });
});

function loadInitialData() {}

function fetchApiUrl(resourceURL) {
  let userObject = fetchSessionUserData();

  const baseURL = "https://script.google.com/macros/s/";
  const key = userObject.apiKey;
  return baseURL + key + resourceURL;
}

function fetchSessionUserData() {
  const userData = localStorage.getItem("user");
  let userObject;
  if (userData) {
    userObject = JSON.parse(userData);
  }
  return userObject;
}

function fetchSessionFinYearData() {
  return localStorage.getItem("finYear");
}

// Show loading overlay
function showLoading() {
  loadingOverlay.style.display = "flex";
}

// Hide loading overlay
function hideLoading() {
  loadingOverlay.style.display = "none";
}

async function getGpPdiScoreCard(finYear) {
  let apiUrl = `${m_api}?action=pdiScore&finYear=${finYear}&gramCode=${userObject.gramcode}&blockCode=${userObject.blockNameEn}`;
  try {
    const response = await fetch(apiUrl); // Replace with your API URL
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    pdiScoreData = await response.json();
    localStorage.setItem("pdiScoreData", JSON.stringify(pdiScoreData.result));
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function formatDate(dateString) {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.match(regex);
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // Months are 0-indexed
  const year = parseInt(match[3], 10);

  const formatedDate = new Date(year, month, day);

  if (isNaN(formatedDate.getTime())) {
    throw new Error("Invalid date");
  }
  return formatedDate;
}

/*
document.addEventListener("DOMContentLoaded", function () {
  // Disable cut, copy, and paste
  document.addEventListener("cut", function (e) {
    e.preventDefault();
    // alert("Cut functionality is disabled on this page.");
  });

  document.addEventListener("copy", function (e) {
    e.preventDefault();
    //alert("Copy functionality is disabled on this page.");
  });

  document.addEventListener("paste", function (e) {
    e.preventDefault();
    //alert("Paste functionality is disabled on this page.");
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // Disable right-click on the entire webpage
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    // alert("Right-click is disabled on this page.");
  });
});
*/
