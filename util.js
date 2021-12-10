export function get_time() {
    return new Date().getTime()
}

export const on_update = []

export function Div(classes, children) {
    return () => {
        const element = document.createElement("div")

        element.classList.add(...classes)

        element.replaceChildren(...children().map(child => child()))

        return element
    }
}

export function Button(text, onclick) {
    return () => {
        const element = document.createElement("button")

        element.innerText = text()
        element.onclick = () => {
            onclick()
            on_update.forEach(cb => cb())
        }

        return element
    }
}

export function Text(text) {
    return () => {
        const element = document.createElement("p")

        element.innerText = text()

        return element
    }
}