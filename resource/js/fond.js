function resize() {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
}
resize();

function randX() {
    return Math.floor(Math.random() * screen.width);
}

function randY() {
    return Math.floor(Math.random() * screen.height);
}

function randR() {
    return Math.random() + 0.1;
}

function getDist(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}
addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    newCamX = -mx / camCDivisor;
    newCamY = -my / camCDivisor;
    moved = true;
});
var ctx = canvas.getContext('2d'),
    mx = null,
    my = null,
    r = 128,
    moved = false,
    particles = [],
    camSP = 5,
    camCDivisor = 16,
    camX = -canvas.width / 2 / camCDivisor,
    camY = -canvas.height / 2 / camCDivisor,
    newCamX = camX,
    newCamY = camY;
class particle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.ang = Math.floor(Math.random() * 180) - 180;
        this.sp = 0.25;
        this.dist = r;
    }
}
for (let i = 0; i < 256; i++) {
    particles.push(new particle(randX(), randY(), randR()));
}
setInterval(() => {
    var dx = newCamX - camX,
        dy = newCamY - camY,
        dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > camSP) {
        camX += dx / dist * camSP;
        camY += dy / dist * camSP;
        camSP = dist / 10;
    }
    var _break = false;
    for (let i = 0; i < particles.length; i++) {
        let particle = particles[i],
            MX = mx - (camX + canvas.width / 2 / camCDivisor),
            MY = my - (camY + canvas.height / 2 / camCDivisor);
        particle.dist = getDist(MX, MY, particle.x, particle.y);
        var collide = checkBorderCollision(particle);
        if ((!collide) && moved && mx !== null && my !== null && particle.dist < r) {
            particle.sp = (0.50 + (r - particle.dist) / r * 2);
            let dx = particle.x - MX,
                dy = particle.y - MY;
            if (particle.dist > particle.r) {
                particle.x += dx / particle.dist * particle.sp;
                particle.y += dy / particle.dist * particle.sp;
                particle.ang = -Math.atan2(particle.y - MY, particle.x - MX) + 0.5 * Math.PI;
            }
            _break = true;
        } else {
            particle.sp = 0.25;
            let dx = Math.sin(particle.ang),
                dy = Math.cos(particle.ang);
            particle.x += dx * particle.sp;
            particle.y += dy * particle.sp;
        }
    }
    if (!_break)
        moved = false;
}, 1e3 / 60);

function checkBorderCollision(particle) {
    var collide = false,
        _camX = (camX + canvas.width / 2 / camCDivisor),
        _camY = (camY + canvas.height / 2 / camCDivisor)
    if (particle.y - particle.r < -_camY || particle.y + particle.r > canvas.height - _camY) {
        reflect_v(particle);
        collide = true;
    }
    if (particle.x - particle.r < -_camX || particle.x + particle.r > canvas.width - _camX) {
        reflect_h(particle);
        collide = true;
    }
    return collide;
}

function reflect_h(particle) {
    var ang = -particle.ang,
        x = -Math.sin(ang) * Math.cos(180 / 180 * Math.PI) - Math.cos(ang) * Math.sin(180 / 180 * Math.PI),
        y = -Math.cos(ang) * Math.cos(180 / 180 * Math.PI) - Math.sin(ang) * Math.sin(180 / 180 * Math.PI);
    particle.ang = Math.atan2(y, x);
}

function reflect_v(particle) {
    var ang = -particle.ang,
        x = Math.cos(ang) * Math.cos(180 / 180 * Math.PI) - Math.sin(ang) * Math.sin(180 / 180 * Math.PI),
        y = Math.sin(ang) * Math.cos(180 / 180 * Math.PI) - Math.cos(ang) * Math.sin(180 / 180 * Math.PI);
    particle.ang = Math.atan2(y, x);
}

function draw() {
    ctx.translate(camX + canvas.width / 2 / camCDivisor, camY + canvas.height / 2 / camCDivisor);
    ctx.fillStyle = "#e6e6e6";
    for (let i = 0; i < particles.length; i++) {
        let particle = particles[i];
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
    }
}

function tick() {
    resize();
    draw();
    requestAnimationFrame(tick);
}
tick();