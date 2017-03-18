(function ($) {
    "use strict";

    $(function () {
        tooltipInit();
        postInit();
        waypointsInit();
    });

    // Init waypoints for header and footer animations
    function waypointsInit() {
        new Waypoint({
            element: document.getElementById('masthead'),
            offset: -5,
            handler: function (direction) {
                if (direction === 'down')
                    this.element.classList.remove('animation-on');
                else
                    this.element.classList.add('animation-on');
            }
        });

        new Waypoint({
            element: document.getElementById('footer'),
            handler: function () {
                this.element.classList.toggle('animation-on');
            }
        });

    }

    // Init bootstrap tooltip
    function tooltipInit() {
        $('[data-toggle]').tooltip();
    }

    function postInit() {
        // Set lead paragraphs
        $('.post-body p:first-child').addClass('lead');

        // Set feature image
        var featured = $('.featured-image').find('img').attr('src');
        if (featured) {
            $('#masthead').css('backgroundImage', 'url(' + featured + ')');
            $('#footer').css('backgroundImage', 'url(' + featured + ')');
        }
    }
}(jQuery));

