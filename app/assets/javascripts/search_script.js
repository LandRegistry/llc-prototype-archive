var loggedInCheck = sessionStorage.getItem('loggedIn');
if (loggedInCheck === 'true') {
    $('.notLoggedIn').remove();
    $('#login-links').append(
        '<li class="loggedIn"><a href="account" style="font-size:16px; text-decoration:none; color:white; font-weight: 700">Jane Doe</a></li>' +
        '<li class="loggedIn signOut"><a href="start" style="font-size:16px; text-decoration:none; color:white; font-weight: 700">Sign out</a></li>'
    );
    console.log('Logged in');
} else if (loggedInCheck === 'false' || loggedInCheck === null) {
    $('.loggedIn').remove();
    $('#login-links').append(
        '<li class="notLoggedIn"><a href="login" style="font-size:16px; text-decoration:none; color:white; font-weight: 700">Sign in</a></li>' +
        '<li class="notLoggedIn"><a href="register" style="font-size:16px; text-decoration:none; color:white; font-weight: 700">Register</a></li>');
}

$('.signOut').on('click', function() {
    sessionStorage.setItem('loggedIn', 'false');
})