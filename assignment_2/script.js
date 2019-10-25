window.addEventListener('load', main, false);

var panel = {
    max_power: 0,
    ratios: [3, 2, 1],
    ids: [],

    canvas_width: 0,
    canvas_height: 0,
    canvas_scale: 0,

    init: function() {

        var max_power_input = document.getElementById('max_power_input');
        this.max_power = parseInt(max_power_input.value);
        this.set_up_canvas();
        this.build();
        this.set_up_input()
    },

    set_up_canvas: function() {
        // Make rendering resolution fit its element's size
        this.canvas_width = canvas_example.width;
        this.canvas_height = canvas_example.height;
        this.canvas_scale = Math.abs(parseFloat(document.getElementById('scale_input').value));
//        canvas_example.width = this.canvas_width + 'px';
//        canvas_example.height = this.canvas_height + 'px';
    },

    set_up_input: function() {
        var decimal_inputs = document.getElementsByClassName('input_box_decimal');

        set_input_filter_all(decimal_inputs, function(value) {
            return /^\-?\d*\.?\d*$/.test(value);
        });
    
        var max_power_input = document.getElementById('max_power_input');
        max_power_input.onchange = function() {
            this.max_power = parseInt(max_power_input.value);
            this.build();
        }.bind(this);

        var scale_input = document.getElementById('scale_input');
        scale_input.onchange = function() {
            this.canvas_scale = parseFloat(scale_input.value);
            this.draw();
        }.bind(this);

        set_input_filter(max_power_input, function(value) {
            return /^\d*$/.test(value) && (value === "" || parseInt(value) >= 0)
        });

        for (var i = 0; i <= this.max_power; i++) {
            var element = document.getElementById(this.ids[i]); 
            element.onchange = function(element, index) {
                this.ratios[index] = parseFloat(element.value);
                if (!isNaN(this.ratios[index])) {
                    this.draw();
                }
            }.bind(this, element, i);
        }
    },

    // Draws custom input buttons
    build: function() {
        var inner_html = '';
        for (var i = this.max_power; i >= 0; i--) {
            var id = 'ratio_input' + (i);
            inner_html += create_power_ratio_input(i, id, this.ratios[i]);
            while (!(i in this.ids)) {
                this.ids.push('');
            }
            this.ids[i] = id;

            while (!(i in this.ratios)) {
                this.ratios.push(0);
            }
        }
        var custom_inputs = document.getElementById('custom_inputs');
        custom_inputs.innerHTML = inner_html;
        this.set_up_input();
        this.draw();
    },
    // Draws on canvas
    draw: function() {
        var ctx = canvas_example.getContext('2d');
        ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);

        var start_x = this.canvas_width / 2;
        var start_y = this.canvas_height / 2;
        // Draw axes
        ctx.lineWidth = 0.6;
        // X axis
        ctx.beginPath();
            ctx.moveTo(start_x, this.canvas_height);
            ctx.lineTo(start_x, 0);
        ctx.stroke();
        // Y axis
        ctx.beginPath();
            ctx.moveTo(0, start_y);
            ctx.lineTo(this.canvas_width, start_y);
        ctx.stroke();
    
        var dt = 0.01;
        var scale = this.canvas_scale;
    
        var t_max = this.canvas_width / this.canvas_scale;
        var t_min = -t_max;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
            ctx.moveTo(start_x + scale * t_min, start_y - scale * polynomial(t_min, this.ratios.slice(0, this.max_power + 1)));
            for (;t_min <= t_max; t_min+=dt) {
                ctx.lineTo(start_x + scale * t_min, start_y - scale * polynomial(t_min, this.ratios.slice(0, this.max_power + 1)));
            }   
        ctx.stroke();
    }
}

// Restricts input for the given textbox to the given inputFilter.
function set_input_filter(textbox, input_filter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
        textbox.addEventListener(event, function() {
            if (input_filter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
            this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
        });
    });
};

function set_input_filter_all(elements, input_filter) {
    Array.prototype.forEach.call(elements, function(element) {
        // Restrict input to digits and '.' by using a regular expression filter.
        set_input_filter(element, input_filter);
    })
}

function create_power_ratio_input(power, id, ratio) {
    var ratio = typeof(ratio) == 'number' ? ratio : 0;
    return `
        <h2>Power ` + power + ` ratio</h2>
        <input id='`+ id + `' class='input_box_decimal' type='text' value=` + ratio + ` inputmode='decimal'><br>
    `
}

function main() {
    panel.init();
}

function polynomial(x, arr) {
    var acc = 0;
    for (var i = 0; i < arr.length; i++) {
        acc = acc + arr[i] * Math.pow(x, i);
    }
    return acc;
}