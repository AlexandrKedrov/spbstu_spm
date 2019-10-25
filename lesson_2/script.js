window.addEventListener('load', main, false);

function main() {
    var ctx = canvas_example.getContext('2d');
    var width = canvas_example.width;
    var height = canvas_example.height;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(400, 20, 50, 50);
    
    // Draw line
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#eeff32';

    ctx.beginPath();
    ctx.moveTo(300, 100);
    ctx.lineTo(100, 300);
    ctx.stroke();

    ctx.lineWidth = 5;
    ctx.fillStyle = '#10ee32';

    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.5, 50, 0, Math.PI * 2);
    ctx.fill();
    //ctx.stroke();

}