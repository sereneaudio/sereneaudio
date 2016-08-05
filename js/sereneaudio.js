//we'll use a window.onload for simplicity, but typically it is best to use either jQuery's $(document).ready() or $(window).load() or cross-browser event listeners so that you're not limited to one.

ABalytics.init({
    experiment1_name: [
        {
            name: 'variant1_name',
            "experiment1_class1_name": "wireless speaker system"
        },
        {
            name: 'variant2_name',
            "experiment1_class1_name": "product"
        }
    ]

});

$( document ).ready(function() {
    ABalytics.applyHtml();

});

