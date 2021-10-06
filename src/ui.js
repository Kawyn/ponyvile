class UI {

    static veil = document.querySelector('#veil');
    static #fade = {

        direction: -1,

        time: 0.5,
        remainingTime: 0.5,
    }

    static fade(time = 0.5) {

        this.#fade.direction *= -1;

        this.#fade.time = time;
        this.#fade.remainingTime = time;
    }

    static refresh() {

        const opacity = +this.veil.style.opacity;

        if (this.#fade.remainingTime > 0) {

            this.veil.style.opacity = opacity + this.#fade.direction * Time.deltaTime / (this.#fade.time * 1000);
            this.#fade.remainingTime -= Time.deltaTime / 1000;

            if (this.#fade.remainingTime <= 0) {

                this.veil.style.opacity = Math.round(opacity);
            }
        }
    }
}