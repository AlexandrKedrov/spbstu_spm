window.addEventListener('load', main, false);


function main() {
    var ctx = canvas_example.getContext('2d');
    var w = canvas_example.width;
    var h = canvas_example.height;

    var x = w * 0.5;
    var y = h * 0.5;
    var r = 100;

    var isDragged = false;

    var color = 0;

    var x_offset = 0;
    var y_offset = 0;

    function getRandomColor() {
        return `rgb(${Math.random() * 256},${Math.random() * 256},${Math.random() * 256})`;
    }

    function getMouseCoord(e) {
        var m = {};
        var rect = canvas_example.getBoundingClientRect();
        m.x = e.clientX - rect.left;
        m.y = e.clientY - rect.top;
        return m;
    }

    function circle(x, y, c='black') {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = c;
        ctx.beginPath();
            ctx.arc(x, y, 100, 0, 2 * Math.PI);
        ctx.fill();
    }

    canvas_example.onclick = function(e) {
        // var m = getMouseCoord(e);

        // ctx.beginPath()
        //     ctx.arc(m.x, m.y, 50, 0, 2 * Math.PI);
        // ctx.stroke()
    };

    canvas_example.onmousedown = function(e) {
        var m = getMouseCoord(e);
        if ((m.x - x) * (m.x - x) + (m.y - y) * (m.y - y) < r * r) {
            x_offset = m.x - x;
            y_offset = m.y - y;
            isDragged = true;
            color = getRandomColor();
        } 
    };

   canvas_example.onmousemove = function(e) {
        if (isDragged) {
            var m = getMouseCoord(e);
            x = m.x - x_offset;
            y = m.y - y_offset;
            circle(x, y, color);
        }
    };

    canvas_example.onmouseup = function(e) {
        isDragged = false;
        circle(x, y, 'black');
    };

    circle(x, y);
}
