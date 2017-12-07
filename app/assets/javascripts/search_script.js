var loggedInCheck = sessionStorage.getItem('loggedIn');
if (loggedInCheck === 'true') {
    // append sign out link
    console.log('Logged in');
} else if (loggedInCheck !== 'true') {
    // append sign in link
}