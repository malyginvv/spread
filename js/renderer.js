const END_ANGLE = Math.PI * 2;

export default class Renderer {
    constructor(canvas, context, state) {
        this.context = context;
        this.state = state;
    }

    render() {
        this.context.clearRect(0, 0, 600, 600);
        for (let particle of this.state.particles) {
            let x = particle.positionX * 600;
            let y = particle.positionY * 600;
            this.context.fillStyle = particle.state.color;
            this.context.beginPath();
            this.context.arc(x, y, particle.radius * 600, 0, END_ANGLE, false);
            this.context.fill();
        }
    }

}