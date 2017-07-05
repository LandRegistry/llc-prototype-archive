var add_location = {
    init : function () {
        $('#search').bind('click', add_location.performSearch);
        $("#search_term").keyup(function(event){
            if(event.keyCode == 13){
                $("#search").click();
            }
        });
    },

    performSearch : function () {
        $.getJSON($SCRIPT_ROOT + '/_search/addresses', {
            search_term: $('#search_term').val()
        }, function(response){
            add_location.processResponse(response)
        })
    },

    processResponse : function(response) {
        if (response.status == "success") {
            if (document.getElementById("error-summary")) {
                document.getElementById("error-summary").remove();
                document.getElementById("error-message-search").remove();
                $("#search-fieldset").removeClass("form-group-error");
            }
            var extent = new ol.extent.boundingExtent(response.coordinates)
            map.getView().fit(extent, {duration: 1000});
        } else {
            if (document.getElementById("error-summary")) {
                document.getElementById("error-summary").remove();
                document.getElementById("error-message-search").remove();
                $("#search-fieldset").removeClass("form-group-error");
            }
            var errorMsg = '<div id="error-summary" class="error-summary" role="group" ' +
                'aria-labelledby="error-summary-heading-example-1" tabindex="-1">' +
                '<h1 class="heading-medium error-summary-heading" id="error-summary-heading-example-1">' +
                'There are errors on this page</h1>' +
                '<ul id="error-summary-list" class="error-summary-list">' +
                '<li><a href="#search_term">' + response.add_land_charge_message + '</a></li>' +
                '</ul></div>';

            var inlineMsg = '<span class="error-message" id="error-message-search">' + response.add_land_charge_inline_message + '</span>';
            $("#search-error").html(errorMsg);
            $("#search_term").before(inlineMsg);
            $("#search-fieldset").addClass("form-group-error");
        }
    }
};