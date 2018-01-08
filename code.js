var alphabet = "abcdefghiklmnoprstuvwxyzjq0123456789";
var domains  = "";
var count    = 0;

var id = 0;
var premiumCount = 0;
var idHttp = 0;
var httpCount = 0;

var requestsCounts = $("#requestsCounts");
var domainsCounts  = $("#domainsCounts");
var premiumsCounts = $("#premiumsCounts");
var requestsNotFinishedCounts = $("#requestsNotFinishedCounts");

///////////////////////////////////////////////
var domain_zone = "";
var table = $("#domains");

var makeRequest = function(domains, callback) {
	var id = ++idHttp;
  requestsCounts.text(idHttp);
  requestsNotFinishedCounts.text(++httpCount);
  
	$.ajax({
    url: "https://xs.rs/godaddy.php",
    type: "POST",
    tryCount : 0,
    data: {
    	domains: domains
    },
    dataType : "json",
    success: function(response) {
      requestsNotFinishedCounts.text(--httpCount);
      callback(response, id);
    },
    error : function(xhr, textStatus, errorThrown) {
      if (xhr.status == 429) {
      	setTimeout(function() {
        	$.ajax(this);
          return;
      	}, xhr.responseText * 1000);
      } else {
          $.ajax(this);
          return;
      }
      return;
    }
	});
}

var addRow = function(objResponse, requestId) {
	for (var ii = 0; ii < objResponse.domains.length; ii++) {
    if (objResponse.domains[ii].available == true) {
      var newRow = table[0].insertRow(table[0].rows.length);
      
      var idRow								= newRow.insertCell(0);
      var domainName  				= newRow.insertCell(1);
      var domainPremium  			= newRow.insertCell(2);
      var domainRegistration  = newRow.insertCell(3);
      var domainRenewal  			= newRow.insertCell(4);
      var Hid					  			= newRow.insertCell(5);
			
      domainsCounts.text(++id);
      var idRowText  = document.createTextNode(id);
      idRow.appendChild(idRowText);
      var HidText  = document.createTextNode(requestId);
      Hid.appendChild(HidText);

      var domainNameText  = document.createTextNode(objResponse.domains[ii].domain);
      domainName.appendChild(domainNameText);
      var isPremium = "-";
      if (objResponse.domains[ii].domain.length - domain_zone.length <= 3 &&
          objResponse.domains[ii].domain.match(/^[a-z.]+$/))
      {
        isPremium = "+";
        premiumCount++;
        premiumsCounts.text(premiumCount);
      }
      var domainPremiumText  = document.createTextNode(isPremium);
      domainPremium.appendChild(domainPremiumText);
      var domainRegistrationText  = document.createTextNode(objResponse.domains[ii].price / 1000000 + " " + objResponse.domains[ii].currency);
      domainRegistration.appendChild(domainRegistrationText);
      var domainRenewalText  = document.createTextNode("-");
      domainRenewal.appendChild(domainRenewalText);
    }
  }
}

var startSearch = function() {
  for (var i = 0; i < alphabet.length; i++) {
    for (var j = 0; j < alphabet.length; j++) {
      for (var q = 0; q < alphabet.length; q++) {
        domains += "\"" + alphabet[i] + alphabet[j] + alphabet[q] + domain_zone + "\"";
        if (++count == 500) {
          domains = "[" + domains + "]";
          makeRequest(domains, addRow);

          domains = "";
          count 	= 0;
        } else {
          domains += ",";
        }
      }
    }
  }
}

$('#startSearch')
.click(function() {
	domain_zone = "." + $('#domainZone').val();
  startSearch();
});

$('#domainPremiumCol, #domainNameCol')
  .each(function(){
  var th = $(this),
      thIndex = th.index(),
      inverse = false;

  th.click(function(){
    console.log("TRIGGERED");
    table.find('td').filter(function(){
      return $(this).index() === thIndex;
    }).sortElements(function(a, b){
      return $.text([a]) > $.text([b]) ?
        inverse ? -1 : 1
      : inverse ? 1 : -1;
    }, function(){
      // parentNode is the element we want to move
      return this.parentNode; 
    });
    inverse = !inverse;
  });
});