window.addEventListener('load', main, false);

function main() {
    var ctx = canvas_example.getContext('2d');
    var w = canvas_example.width;
    var h = canvas_example.height;

    var x_start = 100;
    var y_start = h - 110 - 80;

    var x = 65;
    var y = 445;
    var r = 20;

    var impulse = {x: 0, y: 0};
    var dt = 1 / 60;

    var isDragged = false;

    var color = 0;

    var x_offset = 0;
    var y_offset = 0;

    var b_fly = false;

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

    function circle(x, y, c='red') {
//        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = c;
        ctx.beginPath();
            ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
    }

    function sling_front(x, y, c={r: 150, g: 75, b: 0}) {
      ctx.strokeStyle = `rgb(${c.r},${c.g},${c.b})`;
      ctx.lineWidth = 10;
      ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - 100);
      ctx.stroke();

      ctx.lineWidth = 10;
      ctx.beginPath();
        ctx.moveTo(x, y - 100);
        ctx.lineTo(x + 10, y - 110 - 90)
      ctx.stroke();

    }

    function sling_back(x, y, c={r: 150, g: 75, b: 0}) {
      ctx.strokeStyle = `rgb(${c.r * 0.7},${c.g * 0.7},${c.b * 0.7})`;
      ctx.lineWidth = 8;
      ctx.beginPath();
        ctx.moveTo(x, y - 100);
        ctx.lineTo(x - 10, y - 110 - 90)
      ctx.stroke();
    }

    function ropes(x0, y0, x, y, c={r: 30, g: 30, b: 30}) {
      ctx.strokeStyle = `rgb(${c.r},${c.g},${c.b})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
        ctx.moveTo(x0 + 10, y0 - 110 - 80);
        ctx.lineTo(x, y);

        ctx.moveTo(x0 - 10, y0 - 110 - 80);
        ctx.lineTo(x, y);
      ctx.stroke();
    }

    function clear() {
      ctx.clearRect(0, 0, w, h);
    }

    function phys() {
      if (!b_fly) {
        return;
      }

      if (y > h-r) {
        y = h-r;
        impulse.y = 0;
        impulse.x = 0;
      }

      if (x >= w - r) {
        impulse.x = -impulse.x;
        x = w - r;
      }

      if (x <= r) {
        impulse.x = -impulse.x;
        x = r;
      }

      if (impulse.x != 0 || !(impulse.y >= 0 && y == h-r)) {
        x += impulse.x / 0.1 * dt;
        y += impulse.y / 0.1 * dt;
      }
      impulse.y += 0.1 * 980 * dt;
    }
    canvas_example.onmousedown = function(e) {
        var m = getMouseCoord(e);
        if ((m.x - x) * (m.x - x) + (m.y - y) * (m.y - y) < r * r) {
            x_offset = m.x - x;
            y_offset = m.y - y;
            isDragged = true;
            color = 'red';
        }
    };

   canvas_example.onmousemove = function(e) {
        if (isDragged) {
            var m = getMouseCoord(e);
            x = m.x - x_offset;
            y = m.y - y_offset;
        }
    };

    canvas_example.onmouseup = function(e) {
        isDragged = false;
        if (!b_fly) {
          b_fly = true;
          impulse.x = -(x - x_start);
          impulse.y = -(y - y_start);
        }
    };

    setInterval(function() {
      phys();
      clear();
      sling_back(100, h);
      if (!b_fly) {
        ropes(100, h, x, y);
      }
      circle(x, y, 'red');
      sling_front(100, h);
    }, 1000 / 60);
}
