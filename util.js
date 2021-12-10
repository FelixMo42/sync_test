export function get_time() {
    return new Date().getTime()
}

export const on_update = []

export function Div(classes, children, locked=()=>false) {
    return () => {
        const element = document.createElement("div")

        element.classList.add(...classes)
        element.classList.toggle("locked", locked())

        element.replaceChildren(...children().map(child => child()))

        return element
    }
}

export function Button(text, onclick, locked=()=>false) {
    return () => {
        const element = document.createElement("button")

        element.innerText = text()
        element.onclick = () => {
            onclick()
            on_update.forEach(cb => cb())
        }
        element.classList.toggle("locked", locked())

        return element
    }
}

export function Text(text, locked=()=>false) {
    return () => {
        const element = document.createElement("p")

        element.innerText = text()
        element.classList.toggle("locked", locked())

        return element
    }
}