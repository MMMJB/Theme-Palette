// ADAPTED FROM GEORGE FRANCIS' DESIGN (https://codepen.io/georgedoescode/pen/oNzamjV?editors=1010)

import { spline } from "https://cdn.skypack.dev/@georgedoescode/spline@1.0.1";
import SimplexNoise from "https://cdn.skypack.dev/simplex-noise@2.4.0";

export default class BlobMorph {
    constructor(path) {
        this.FPS = 60;

        this.path = path;
        this.parent = this.path.parentElement;
        this.noiseStep = 0.001;
        this.rad = this.calculateRad();

        this.simplex = new SimplexNoise();
        this.points = this.createPoints();

        this.animation = setInterval(_ => this.animate(), 1000 / this.FPS);

        window.addEventListener("resize", _ => this.rad = this.calculateRad());
    }

    createPoints() {
        const points = [];
        const numPoints = 6;
        const angleStep = Math.PI * 2 / numPoints;

        for (let i = 1; i <= numPoints; i++) {
            const theta = i * angleStep;

            const x = 100 + Math.cos(theta) * this.rad;
            const y = 100 + Math.sin(theta) * this.rad;

            points.push({
                x: x,
                y: y,
                originX: x,
                originY:  y,
                noiseOffsetX: Math.random() * 1000,
                noiseOffsetY: Math.random() * 1000
            })
        }

        return points;
    }

    animate() {
        this.path.setAttribute("d", spline(this.points, 1, true));

        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i];

            const nx = this.noise(point.noiseOffsetX, point.noiseOffsetX);
            const ny = this.noise(point.noiseOffsetY, point.noiseOffsetY);

            const x = this.map(nx, -1, 1, point.originX - 20, point.originX + 20);
            const y = this.map(ny, -1, 1, point.originY - 20, point.originY + 20);

            point.x = x;
            point.y = y;

            point.noiseOffsetX += this.noiseStep;
            point.noiseOffsetY += this.noiseStep;
        }
    }

    stopAnimation() {
        clearInterval(this.animation);
    }

    calculateRad() {
        const box = this.parent.getBoundingClientRect();
        const reference = box.width > box.height ? box.height : box.width;
        const unit = reference / 200;

        return (reference / unit) * .3;
    }

    noise(x, y) {
        return this.simplex.noise2D(x, y);
    }

    map(n, start1, end1, start2, end2) {
        return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
    }
}