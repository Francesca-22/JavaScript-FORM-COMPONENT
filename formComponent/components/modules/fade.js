// animate display none fade in
export function fadeIn(element, speed) {
    element.style.display = "block"
    var opacityUpLevels = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    var pop = 0;

    var interval = setInterval(function () {
        if (pop >= opacityUpLevels.length) {
            clearInterval(interval);
        } else {
            element.style.opacity = opacityUpLevels[pop];
            pop = pop + 1
        }
    }, speed);
};

// animate display none fade out
export function fadeOut(element, speed) {
    var opacityDownLevels = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0]
    var pop = 0;

    var interval = setInterval(function () {
        if (pop >= opacityDownLevels.length) {
            clearInterval(interval);
            element.style.display = "none"
        } else {
            element.style.opacity = opacityDownLevels[pop];
            pop = pop + 1
        }
    }, speed);
}
