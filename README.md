jquery-idletimer
================

Simple javascript client idle control. 

For support of multiple tabs usage, the idle time is stored into browser cookie. Then this script **don't work** on direct file:// access.



Usage
---------------

Simple mode

```javascript
$.idleTimer({
    time: 15,
    end: function() {
        alert('logout!');
    }
});
```

Custom callbacks

```javascript
$.idleTimer({
    time: 15,
    format: '%m:%s',
    start: function(it) {
        $('#timer').html(it.format()).css('color', 'black');
    },
    end: function() {
        alert('logout!');
    },
    change: function(it) {
        var output = $('#timer');
        output.html(it.format());
        if (it.time <= 10) {
            if (it.time <= 5) {
                output.css('color', 'red');
            } else {
                output.css('color', 'orange');
            }
        }
    },
});
```

Parameters
---------------

- **time**: total seconds of mouse and keyboard idle
- **start**: fired on init and reset timer
- **end**: fired on idle time ends
- **change**: fired each second on idle state
- **format**: format of time returned by idleTimer.format function (*%h*, *%m*, *%s*)
