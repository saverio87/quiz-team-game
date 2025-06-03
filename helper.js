// This is a generic function to handle animations, can pass it CSS animation classes
// as attributes
export const playAnimation = (element, animationClasses, removeClasses = []) => {
    return new Promise((resolve) => {
        if (!element) {
            console.error("Error: Element not found!");
            resolve(); // Resolve immediately to avoid blocking
            return;
        }
        // Apply animation classes
        element.classList.add("animate__animated", ...animationClasses);
        const onAnimationEnd = () => {
            console.log(`Animation ended: ${animationClasses.join(', ')}`);
            //  This class always gets removed no matter what
            element.classList.remove('animate__animated');
            // Remove additional specified classes
            removeClasses.forEach(cls => element.classList.remove(cls));
            // Cleanup listener
            element.removeEventListener("animationend", onAnimationEnd);
            resolve(`Animation '${animationClasses.join(', ')}' completed!`);
        };
        element.addEventListener("animationend", onAnimationEnd);
    });
};

export const playAnimationsConcurrently = async (elements, animationClasses, removeClasses = []) => {
    // 'elements' should now just be an array of DOM elements: [element1, element2, element3]
    // 'animationClasses' and 'removeClasses' are applied to ALL of them.
    const promises = elements.map(element => {
        return playAnimation(element, animationClasses, removeClasses);
    });
    // Promise.all waits for ALL promises in the array to resolve.
    return Promise.all(promises);
};


function createReusableImage(src) {
    const img = document.createElement("img");
    img.src = `./${src}.png`;
    img.style.position = "absolute"; // Optional for positioning
    img.style.pointerEvents = "none"; // Prevent interaction
    img.style.width = "30%";
    return img;
}

const pickImgs = (imageType) => {
    return imageType == 'tick' ? createReusableImage('tick') : createReusableImage('cross')
}


export async function triggerReusableAnimation(params) {
    // Determine which image to use
    const img = pickImgs(params.imageType)
    // Append the reusable image to the target element
    params.targetElement.appendChild(img);

    img.classList.add("animate__animated", "animate__fadeOutUp");
    // Listen for the animationend event to remove the image

    return new Promise((resolve) => {
        img.addEventListener(
            "animationend",
            function handleImageAnimation(event) {
                img.classList.remove("animate__animated", "animate__fadeOutUp")
                params.targetElement.removeChild(img);
                img.removeEventListener("animationend", handleImageAnimation)
                resolve("trigger reusable animation resolved")

            },
            { once: true },
        )
    })


}


export function prepareQuestionObject(question) {
    question.options = question.type === 'true-false' ? ['true', 'false'] : question.options;
    return question
}

