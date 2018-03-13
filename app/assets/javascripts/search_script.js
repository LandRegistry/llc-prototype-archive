var loggedInCheck = sessionStorage.getItem('loggedIn');
if (loggedInCheck === 'true') {
    $('.notLoggedIn').remove();
    $('#login-links').append(
        '<li class="loggedIn account"><a href="#">Jane Smith</a><ul class="menuDropdown hiddenList"><li><a href="dashboard">Dashboard</a></li><li><a href="account">My account</a></li></ul></li>'
        +
        '<li class="loggedIn signOut"><a href="start">Sign out</a></li>'
    );
    console.log('Logged in');
    $('#payContinueButton').attr('href', 'view-logged-in');
} else if (loggedInCheck === 'false' || loggedInCheck === null) {
    $('.loggedIn').remove();
    $('#login-links').append(
        '<li class="notLoggedIn"><a href="login">Sign in</a></li>' +
        '<li class="notLoggedIn"><a href="register">Register</a></li>');
}

$('.signOut').on('click', function() {
    sessionStorage.setItem('loggedIn', 'false');
});

$('.account').on('click', function() {
    if ($('.menuDropdown').hasClass('hiddenList')) {
        $('.menuDropdown').removeClass('hiddenList');
    } else {
        $('.menuDropdown').addClass('hiddenList');
    }
});