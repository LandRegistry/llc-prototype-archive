$(document).ready(function() {
	// lick charge type to reveal legislation list
	$(".control li a").click(function() {
		var charge = $(this).attr("href");
		var chargeType = $(this).html();
		sessionStorage.setItem("chargeType", chargeType);
		$("#result_1").load("../v4-1/lists/" + charge);
		return false;
	});

	$(".charge_label").click(function() {
		var charge = $(this).children().val().toLowerCase();
		if(charge == "miscellaneous") {
			var charge__target = "misc";
		} else if (charge == "listed building") {
			var charge__target = "listed";
		} else if (charge == "general financial") {
			var charge__target = "general";
		} else {
			var charge__target = charge;
		}
		var chargeType = charge;
		sessionStorage.setItem("chargeType", chargeType);
		$(".charge_button").attr("href", charge__target);
	});

	if($("#content").hasClass("v4")) {
		$("#global-header-bar").css("background-color", "#005ea5");
	};

	$(".postcode_button").click(function() {
		var postcode = $(".postcode_field").val();
		sessionStorage.setItem("postcode", postcode);
	});

	// address
	// potscode search only
	$(".list li a").click(function() {
		var address = $(this).html();
		sessionStorage.setItem("address", address);
	});

	$(".description_button").click(function() {
		var description = $("#description").val();
		sessionStorage.setItem("description", description);
	});

	$(".description_city").click(function() {
		var origin = "city";
		sessionStorage.setItem("origin", origin);
	});

	$(".description_street").click(function() {
		var origin = "street";
		sessionStorage.setItem("origin", origin);
	});

	$(".further_info_button").click(function() {
		var furtherInfo = $("#further_info").val();
		var reference = $("#reference").val();
		sessionStorage.setItem("furtherInfo", furtherInfo);
		sessionStorage.setItem("reference", reference);
	});

	$(".instrument_button").click(function() {
		var instrument = $(".instrument_radio").val();
		var docDay = $("#doc-day").val();
		var docMonth = $("#doc-month").val();
		var docYear = $("#doc-year").val();
		sessionStorage.setItem("instrument", instrument);
		sessionStorage.setItem("docDay", docDay);
		sessionStorage.setItem("docMonth", docMonth);
		sessionStorage.setItem("docYear", docYear);
	});

	$(".expiry_button").click(function() {
		var expiry = $("#expiry-date").val();
		sessionStorage.setItem("expiry", expiry);
	});

	$(".charge_type").html(chargeType);
	$(".charge_type_v1-1").html(newChargeType);
	$(".post_code").html(postcode);
	$(".postcode_searched").val(postcode);
	$(".address").html(address);
	$(".description").html(description);
	$(".further_info").html(furtherInfo);
	$(".instrument_result").html(instrument);
	$(".doc-day").html(docDay);
	$(".doc-month").html(docMonth);
	$(".doc-year").html(docYear);
	$(".expiry").html(expiry);
	$(".reference").html(reference);
	$(".legislation").html(legislation);
});
