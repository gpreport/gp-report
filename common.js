const scriptURL =
  "https://script.google.com/macros/s/AKfycbwbeXqQTwh9MhXpyR56ox3597T2CyqfhXaa1VQUWN0YVesL6Ie4ia8iGEV3S205pgXL/exec?action=auth";

let api =
  "https://script.google.com/macros/s/AKfycbwbeXqQTwh9MhXpyR56ox3597T2CyqfhXaa1VQUWN0YVesL6Ie4ia8iGEV3S205pgXL/exec";

let m_api =
  "https://script.google.com/macros/s/AKfycbymOUVgiNtVeEfrnsOdZ_JstOowvfU0ne4sTuGbG8k-Qi0h4_xYdvdUs06KwuesdWps/exec";

let pdiScoreData;
const logout = document.getElementById("logout");
logout.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

function loadInitialData() {
  const userData = localStorage.getItem("user");

  // Parse the JSON string back into an object
  if (userData) {
    const userObject = JSON.parse(userData);

    document.getElementById("lblGPName").textContent = userObject.gramnamemr;
    document.getElementById("lblPanchayat").textContent = userObject.blockname;
    document.getElementById("lblDistrict").textContent = userObject.distname;
    document.getElementById("username").textContent = userObject.personname;
  }

  let finYear = localStorage.getItem("finYear");
  document.getElementById("finYearLbl").textContent = finYear;
}

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
