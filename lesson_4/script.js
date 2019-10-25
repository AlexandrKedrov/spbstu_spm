window.addEventListener('load', main, false);

function main()
{
    // TODO
    // Floating centre
    // Coordinates of hovered points

    var ctx = canvas_example.getContext('2d');
    var w = canvas_example.width;
    var h = canvas_example.height;

    var x_min = 0;
    var x_max = 10 * Math.PI;

    function fun(x) {
        return Math.sin(x) * Math.exp(x/x_max);
    }

    function drawAxes() {
        ctx.beginPath();
        ctx.moveTo(0, h/2);
        ctx.lineTo(w, h/2);

        ctx.stroke();
    }

    var y_scale = h / 2;
    var x_scale = w / (x_max - x_min);

    function Plot(x, y) {
        ctx.beginPath();
        for (var i = 0; i < x.length-1; i++) {
            ctx.moveTo(x_scale * x[i], h * 0.5 - y_scale * y[i]);
            ctx.lineTo(x_scale * x[i+1], h * 0.5 - y_scale * y[i+1]);
        }
        ctx.stroke();
    }

    var x = [];
    var y = [];

    var y_max = 0;

    var N = 500;
    var dx = (x_max - x_min) / N    ;
    var x_our = x_min;

    // for (var i = 0; i < N; i++) {
    //     x.push(x_our);
    //     x_our += dx;
    //     y.push(fun(x_our));
    // }

    for (var i = 0; i <= N; i++) {
        x.push(x_min + i * dx);
        y.push(fun(x[i]));
        if (y_max < Math.abs(y[i])) {
            y_max = Math.abs(y[i]);
            y_scale = h / (2 * y_max);
        }
    }
    console.log(x, y);

    drawAxes();
    Plot(x, y);

    // var dt = 0.01;
    // var t_max = 2 * Math.PI;

    // var N = 20;
    
    // ctx.moveTo(w * 0.5 + 100, h * 0.5)
    // ctx.beginPath();
    // for (var t = 0; t <= t_max; t+=dt) {
    //     ctx.lineTo(w * 0.5 + 100 * Math.cos(t), h * 0.5 - 100 * Math.sin(t));
    // }
    // ctx.stroke();
}

