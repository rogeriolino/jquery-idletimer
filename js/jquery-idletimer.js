/**
 * Idle Timer
 * @author Rogério Lino <rogeriolino.com>
 */
;(function($) {
    "use strict";
    var defaults = {
        time: 300,
        format: '%h:%m:%s',
        cookieName: 'idleTimer.time',
    };
    var setup = false;
    $.idleTimer = function(opts) {
        var it = this;
        if (setup) {
            it.options = $.extend(it.options, opts);
            return it;
        }
        setup = true;
        it.started = true;
        it.options = $.extend(defaults, opts);
        
        reset(it);
        
        it.format = function() {
            return formatter.time(it.time, it.options.format);
        };
        
        it.intervalId = setInterval(function() {
            interval(it);
        }, 1000);
        
        $(document).on('mousemove keydown', function() {
            if (it.started) {
                reset(it);
                if (typeof(it.options.start) === 'function') {
                    it.options.start(it);
                }
            }
        });
        
        if (typeof(it.options.start) === 'function') {
            it.options.start(it);
        }
        
        return it;
    };

    var reset = function(it) {
        cookie.write(it.options.cookieName, (new Date()).getTime());
        it.time = it.options.time;
    }

    var diff = function(it)  {
        var startTime = cookie.read(it.options.cookieName);
        var currTime = (new Date()).getTime();
        return parseInt((currTime - startTime) / 1000);
    }
    
    var interval = function(it) {
        it.time = it.options.time - diff(it);

        if (it.time <= 0) {
            it.time = 0;
        }
        
        if (typeof(it.options.change) === 'function') {
            it.options.change(it);
        }
        if (it.time === 0) {
            it.started = false;
            clearInterval(it.intervalId);
            if (typeof(it.options.end) === 'function') {
                it.options.end(it);
            }
        }
    };

    var formatter = {
        
        mask: { 
            '%h': 'hours',
            '%m': 'minutes',
            '%s': 'seconds'
        },
                
        time: function(seconds, format) {
            var value = format;
            for (var i in this.mask) {
                var fn = this[this.mask[i]];
                if (typeof(fn) === 'function') {
                    value = value.replace(i, fn(seconds));
                }
            }
            return value;
        },
                
        hours: function(seconds) {
            var h = Math.floor(seconds / 60 / 60);
            return (h < 10) ? '0' + h : h;
        },
                
        minutes: function(seconds) {
            var m = Math.floor(seconds / 60);
            return (m < 10) ? '0' + m : m;
        },
        
        seconds: function(seconds) {
            var s = seconds % 60;
            return (s < 10) ? '0' + s : s;
        },
    };

    var cookie = {
        write: function(name, value) {
            var date = new Date();
            date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
            document.cookie = name + "=" + value + expires + "; path=/";
        },

        read: function(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
            return null;
        }
    };

})(jQuery);
