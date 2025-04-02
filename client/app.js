function onPageLoad() {
  console.log("document loaded");
  var url = "http://127.0.0.1:5000/get_location_names";
  $.get(url, function (data, status) {
    console.log("got response for get_location_names request");
    if (data) {
      var locations = data.locations;
      var uiLocations = document.getElementById("uiLocations");
      uiLocations.innerHTML = "";
      for (var i in locations) {
        var opt = new Option(
          toTitleCaseWithRomanNumerals(locations[i]),
          locations[i]
        );
        uiLocations.appendChild(opt);
      }
    }
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
  var location = document.getElementById("uiLocations");
  var estPrice = document.getElementById("uiEstimatedPrice");

  var url = "http://127.0.0.1:5000/predict_property_price";

  $.post(
    url,
    {
      total_sqft: parseFloat(sqft.value),
      bhk: bhk,
      bath: bathrooms,
      location: location.value,
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
