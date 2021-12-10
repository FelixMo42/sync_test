export function Message(text) {
    return {
        text,
    }
}

export function Messages(element) {
    const messages = []

    let default_post_text = null
    let locked = false;

    return {
        /* builder */

        with_default_post_text(callback) {
            default_post_text = callback
            return this
        },

        /* getters */

        get length() {
            return messages.length
        },

        /* logic */

        post(text) {
            if (!text) {
                text = default_post_text(this)
            }
            messages.push(Message(text))
        },

        set_lock(lock) {
            locked = lock;
        },

        /* view */

        update_view() {
            // update message list
            element.querySelector(".messages").replaceChildren(...messages.map((message) => {
                const element = document.createElement("div")
                element.innerText = message.text
                return element
            }))
            
            // update post text
            if (default_post_text) {
                element.querySelector(".footer p").innerText = default_post_text(this)
            }

            // update lock view
            element.querySelector(".footer button").innerText = locked ? "LOCK" : "POST"
            element.querySelector(".footer").classList.toggle("locked", locked)

            return this
        }
    }
}