window.addEventListener('load', main, false);

function main()
{
    var cplot = canvas_plot.getContext('2d');
    var ctx = canvas_example.getContext('2d');

    var w = canvas_example.width;
    var h = canvas_example.height;

    var wp = canvas_plot.width;
    var hp = canvas_plot.height;
    var fps = 60;
    var r = 25;

    var x = w / 2;
    var y = h / 2;

    var v = 20;
    var phi = Math.random() * 2 * Math.PI;
    
    var vx = Math.cos(phi) * v * 10;
    
    var vy = Math.sin(phi) * v * 10;

    var dt = 0.1;

    var b = -0.2;

    var E = [vx*vx+vy*vy];
    var t_max = 0;


    function phys() {
        // Уравнение движения
        x = x + vx * dt;
        y = y + vy * dt;

        vx = vx + b * vx * dt;
        vy = vy + b * vy * dt;
        // E
        
        if (vx * vx + vy * vy > 0.01) {
            E.push(vx*vx+vy*vy)
            t_max += dt;
        } else {
            vx = 0;
            vy = 0;
            console.log('finished');
        }
        // Границчные условия

        if (x - r < 0 || x + r > w) {
            vx = -vx;
        }

        if (y - r < 0 || y + r > h) {
            vy = -vy
        }

    }

    function draw() {
        // particle
        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();

        // plot
        cplot.clearRect(0, 0, wp, hp);
        var E_scale = hp / Math.max.apply(null, E);
        var t_scale = wp / t_max;
        cplot.beginPath();
        for (var i = 0; i < E.length; i++) {
            cplot.moveTo(dt * i * t_scale, hp - E[i] * E_scale);
            cplot.lineTo(dt * (i+1) * t_scale, hp - E[i+1] * E_scale);
        }
        cplot.stroke();
    }

    function control() {
        draw()
        phys()
    }

    setInterval(control, 1000 / fps);
}

