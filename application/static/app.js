// Store all locations globally for filtering
let allLocations = [];

function onPageLoad() {
  console.log("document loaded");
  var url = "/get_location_names";
  $.get(url, function (data, status) {
    console.log("got response for get_location_names request");
    if (data) {
      allLocations = data.locations;
      setupAutocomplete();
    }
  });
}

function setupAutocomplete() {
  const locationInput = document.getElementById("locationInput");
  const locationDropdown = document.getElementById("locationDropdown");
  const locationValue = document.getElementById("locationValue");

  // Initialize with empty value
  locationValue.value = "";

  // Input event for typing
  locationInput.addEventListener("input", function () {
    const inputValue = this.value.toLowerCase();
    locationValue.value = inputValue; // Set the hidden value to the current input

    // Filter locations based on input
    const filteredLocations =
      inputValue.length > 0
        ? allLocations.filter((loc) => loc.toLowerCase().includes(inputValue))
        : [];

    // Display dropdown if we have matches
    if (filteredLocations.length > 0) {
      renderDropdown(filteredLocations);
      locationDropdown.style.display = "block";
    } else {
      locationDropdown.style.display = "none";
    }
  });

  // Handle dropdown item selection
  locationDropdown.addEventListener("click", function (e) {
    if (e.target.classList.contains("autocomplete-item")) {
      locationInput.value = e.target.textContent;
      locationValue.value = e.target.getAttribute("data-value");
      locationDropdown.style.display = "none";
    }
  });

  // Handle keyboard navigation
  locationInput.addEventListener("keydown", function (e) {
    const items = locationDropdown.querySelectorAll(".autocomplete-item");
    const activeItem = locationDropdown.querySelector(".active");

    // Down arrow
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!activeItem && items.length > 0) {
        items[0].classList.add("active");
      } else if (activeItem && activeItem.nextElementSibling) {
        activeItem.classList.remove("active");
        activeItem.nextElementSibling.classList.add("active");
      }
    }
    // Up arrow
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (activeItem && activeItem.previousElementSibling) {
        activeItem.classList.remove("active");
        activeItem.previousElementSibling.classList.add("active");
      }
    }
    // Enter key
    else if (e.key === "Enter" && activeItem) {
      e.preventDefault();
      locationInput.value = activeItem.textContent;
      locationValue.value = activeItem.getAttribute("data-value");
      locationDropdown.style.display = "none";
    }
    // Escape key
    else if (e.key === "Escape") {
      locationDropdown.style.display = "none";
    }
  });

  // Hide dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (e.target !== locationInput && e.target !== locationDropdown) {
      locationDropdown.style.display = "none";
    }
  });
}

function renderDropdown(locations) {
  const locationDropdown = document.getElementById("locationDropdown");
  locationDropdown.innerHTML = "";

  locations.forEach((location) => {
    const item = document.createElement("div");
    item.classList.add("autocomplete-item");
    item.textContent = toTitleCaseWithRomanNumerals(location);
    item.setAttribute("data-value", location);
    locationDropdown.appendChild(item);
  });
}

function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for (var i in uiBathrooms) {
    if (uiBathrooms[i].checked) {
      return parseInt(i) + 1;
    }
  }
  return -1; // Invalid Value
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for (var i in uiBHK) {
    if (uiBHK[i].checked) {
      return parseInt(i) + 1;
    }
  }
  return -1; // Invalid Value
}

function onClickedEstimatePrice() {
  var sqft = document.getElementById("uiSqft");
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var locationValue = document.getElementById("locationValue").value;
  var locationInput = document.getElementById("locationInput").value;
  var location = locationValue || locationInput; // Use typed location if no match selected
  var estPrice = document.getElementById("uiEstimatedPrice");

  if (!location) {
    alert("Please enter a location");
    return;
  }

  var url = "/predict_property_price";

  $.post(
    url,
    {
      total_sqft: parseFloat(sqft.value),
      bhk: bhk,
      bath: bathrooms,
      location: location,
    },
    function (data, status) {
      console.log(data.estimated_price);
      estPrice.innerHTML =
        "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
      console.log(status);
    }
  );
}

function toTitleCaseWithRomanNumerals(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      let formattedWord = word.charAt(0).toUpperCase() + word.slice(1);

      // Check if the word is a Roman numeral (matches I, II, III, IV, etc.)
      if (
        /^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii|xiii|xiv|xv|xvi|xvii|xviii|xix|xx|xl|l|lx|lxx|lxxx|xc|c|d|m)$/i.test(
          word
        )
      ) {
        formattedWord = word.toUpperCase(); // Convert entire word to uppercase
      }

      return formattedWord;
    })
    .join(" ");
}

window.onload = onPageLoad;
