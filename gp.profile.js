let GPAPI;
document.addEventListener("DOMContentLoaded", (event) => {
  loadInitialData();
  let userObject = fetchSessionUserData();
  let finYearObject = fetchSessionFinYearData();
  GPAPI = fetchApiUrl("/exec?action=gpInfo");
  document.getElementById("district").value = userObject.distname;
  document.getElementById("block").value = userObject.blockname;
  document.getElementById("gpName").value = userObject.gramnamemr;
  document.getElementById("gramCode").value = userObject.gramcode;
  document.getElementById("year").value = finYearObject;
  let gpDetails = fetchGpInfo(userObject.gramcode, finYearObject);
});

const form = document.forms["gpinfoForm"];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  showLoading();
  let apiUrl = `${m_api}?action=gpInfo`;
  fetch(apiUrl, { method: "POST", body: new FormData(form) })
    .then((response) => {
      console.log("Success!", response);
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      console.log("Success! Response data:", data);
      if (
        data.statusCode === "201 CREATED" ||
        data.statusCode === "201 UPDATED"
      ) {
        console.log("successfully!");
        hideLoading();
        showMsgModal("", "आपण भरलेली माहिती साठवण्यात आली आहे", "bg-success");
      } else {
        console.log("Failed");
        // showMsgModal("", "आपण भरलेली माहिती साठवण्यात आली आहे", "bg-success");
      }
    })
    .catch((error) => console.error("Error!", error.message));
});

async function fetchGpInfo(gramCode, finYear) {
  showLoading();
  let apiUrl = `${m_api}?action=gpInfo&gramCode=${gramCode}&finYear=${finYear}`;
  // GPAPI = `${GPAPI}&gramCode=${gramCode}&finYear=${finYear}`;
  try {
    const response = await fetch(apiUrl); // Replace with your API URL
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    let responseData = await response.json();
    if (responseData.result.length > 0) {
      setTimeout(() => {
        setGpData(responseData);
        hideLoading();
      }, 1000);
    } else {
      hideLoading();
    }
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function setGpData(gpDetails) {
  let gpinfo = gpDetails.result;
  if (gpinfo != null || gpinfo != "undefined") {
    // "✏️"
    //document.getElementById("newGpButton").style.display = "none";
    document.getElementById("newGpButton").textContent = "✏️";
    document.getElementById("newGpButton").className = "btn btn-secondary";
  }
  document.getElementById("sarpanchLbl").textContent = gpinfo[0].sarpanchName;
  document.getElementById("sarpanchName").value = gpinfo[0].sarpanchName;
  document.getElementById("tpoLbl").textContent = gpinfo[0].tpoName;
  document.getElementById("tpoName").value = gpinfo[0].tpoName;

  document.getElementById("gramsevakLbl").textContent = gpinfo[0].gramsevakName;
  document.getElementById("gramsevakName").value = gpinfo[0].gramsevakName;

  document.getElementById("sarpanchmbLbl").textContent =
    gpinfo[0].sarpanchMobileNo;
  document.getElementById("sarpanchMobileNo").value =
    gpinfo[0].sarpanchMobileNo;

  document.getElementById("tpombLbl").textContent = gpinfo[0].tpoMobileNo;
  document.getElementById("tpoMobileNo").value = gpinfo[0].tpoMobileNo;

  document.getElementById("gramsevakmbLbl").textContent =
    gpinfo[0].gramsevakMobileNo;
  document.getElementById("gramsevakMobileNo").value =
    gpinfo[0].gramsevakMobileNo;

  document.getElementById("anusuchitJatiMaleLbl").textContent =
    gpinfo[0].maleAnusuchitJati;
  document.getElementById("maleAnusuchitJati").value =
    gpinfo[0].maleAnusuchitJati;

  document.getElementById("anusuchitJatiFemaleLbl").textContent =
    gpinfo[0].femaleAnusuchitJati;
  document.getElementById("femaleAnusuchitJati").value =
    gpinfo[0].femaleAnusuchitJati;

  document.getElementById("totalAnusuchitJatiLbl").textContent =
    gpinfo[0].totalAnusuchitJati;
  document.getElementById("totalAnusuchitJati").value =
    gpinfo[0].totalAnusuchitJati;

  document.getElementById("anusuchitJamatiMaleLbl").textContent =
    gpinfo[0].maleAnusuchitJamati;
  document.getElementById("maleAnusuchitJamati").value =
    gpinfo[0].maleAnusuchitJamati;

  document.getElementById("anusuchitJamatiFemaleLbl").textContent =
    gpinfo[0].femaleAnusuchitJamati;
  document.getElementById("femaleAnusuchitJamati").value =
    gpinfo[0].femaleAnusuchitJamati;

  document.getElementById("totalAnusuchitJamatiLbl").textContent =
    gpinfo[0].totalAnusuchitJamati;
  document.getElementById("totalAnusuchitJamati").value =
    gpinfo[0].totalAnusuchitJamati;

  document.getElementById("otherMaleLbl").textContent = gpinfo[0].maleOthers;
  document.getElementById("maleOthers").value = gpinfo[0].maleOthers;

  document.getElementById("otherFemaleLbl").textContent =
    gpinfo[0].femaleOthers;
  document.getElementById("femaleOthers").value = gpinfo[0].femaleOthers;

  document.getElementById("totalOtherLbl").textContent = gpinfo[0].totalOthers;
  document.getElementById("totalOthers").value = gpinfo[0].totalOthers;

  document.getElementById("totalMaleLbl").textContent = gpinfo[0].totalMale;
  document.getElementById("totalMale").value = gpinfo[0].totalMale;

  document.getElementById("totalFemaleLbl").textContent = gpinfo[0].totalFemale;
  document.getElementById("totalFemale").value = gpinfo[0].totalFemale;

  document.getElementById("totalPopulationLbl").textContent =
    gpinfo[0].totalPopulation;
  document.getElementById("totalPopulation").value = gpinfo[0].totalPopulation;

  document.getElementById("totalAnusuchitJatiJamatiPopulationLbl").textContent =
    gpinfo[0].totalAnusuchitJatiJamati;

  document.getElementById("totalAnusuchitJatiJamati").value =
    gpinfo[0].totalAnusuchitJatiJamati;

  document.getElementById(
    "totalAnusuchitJatiJamatiPopulationPerLbl"
  ).textContent = `${gpinfo[0].anusuchitJatiJamatiPer}`;

  document.getElementById(
    "anusuchitJatiJamatiPer"
  ).value = `${gpinfo[0].anusuchitJatiJamatiPer}`;
}

function calculate() {
  addition("maleAnusuchitJati", "femaleAnusuchitJati", "totalAnusuchitJati");
  addition(
    "maleAnusuchitJamati",
    "femaleAnusuchitJamati",
    "totalAnusuchitJamati"
  );
  addition("maleOthers", "femaleOthers", "totalOthers", "totalOthers");
  additionVertical(
    "maleAnusuchitJati",
    "maleAnusuchitJamati",
    "maleOthers",
    "totalMale"
  );
  additionVertical(
    "femaleAnusuchitJati",
    "femaleAnusuchitJamati",
    "femaleOthers",
    "totalFemale"
  );

  additionVertical(
    "totalAnusuchitJati",
    "totalAnusuchitJamati",
    "totalOthers",
    "totalPopulation"
  );

  let totalAnusuchitJati = document.getElementById("totalAnusuchitJati").value;
  let totalAnusuchitJamati = document.getElementById(
    "totalAnusuchitJamati"
  ).value;

  let totalAnusuchitJatiJamati =
    parseInt(totalAnusuchitJati) + parseInt(totalAnusuchitJamati);
  document.getElementById("totalAnusuchitJatiJamati").value =
    totalAnusuchitJatiJamati;

  let totalPopulation = document.getElementById("totalPopulation").value;
  document.getElementById("anusuchitJatiJamatiPer").value = `${(
    (totalAnusuchitJatiJamati * 100) /
    totalPopulation
  ).toFixed(2)}`;
}

function addition(prmOne, prmTwo, result) {
  let prmOneValue = parseFloat(document.getElementById(prmOne).value) || 0;
  let prmTwoValue = parseFloat(document.getElementById(prmTwo).value) || 0;

  let totalValue = prmOneValue + prmTwoValue;
  document.getElementById(result).value = totalValue;
}

function additionVertical(prmOne, prmTwo, prmThird, result) {
  let prmOneValue = parseFloat(document.getElementById(prmOne).value) || 0;
  let prmTwoValue = parseFloat(document.getElementById(prmTwo).value) || 0;
  let prmThirdValue = parseFloat(document.getElementById(prmThird).value) || 0;

  let totalValue = prmOneValue + prmTwoValue + prmThirdValue;
  document.getElementById(result).value = totalValue;
}
