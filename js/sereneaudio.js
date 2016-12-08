//we'll use a window.onload for simplicity, but typically it is best to use either jQuery's $(document).ready() or $(window).load() or cross-browser event listeners so that you're not limited to one.

$( document ).ready(function() {
    ABalytics.applyHtml();
});

//Sets the expiry of Mailchimp popup cookie to 1 day
if (document.cookie.indexOf("MCEvilPopupClosed") >= 0) {
    // If cookie exists
    expiry = new Date();
    expiry.setTime(expiry.getTime()+(1*24*60*60*1000)); // 1 day
    document.cookie = "MCEvilPopupClosed=yes; expires=" + expiry.toGMTString();
}
