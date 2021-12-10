import { SetLock, PostMessage, DeleteMessage } from "./actions.js"
import { get_time } from "./util.js"

export function Message(text) {
    return {
        text,
    }
}

export function Messages(element) {
    // data
    let messages = []
    let locked = false
    let last_updated = get_time()

    // callbacks
    let default_post_text = null

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

        get_post_text() {
            return default_post_text(this)
        },

        last_updated() {
            return last_updated
        },

        data() {
            return JSON.parse(JSON.stringify({
                messages,
                locked
            }))
        },

        is_locked() {
            return locked
        },

        /* actions */

        handle_action(action) {
            if (action.type === SetLock) {
                locked = action.lock
                return true
            }

            if (action.type === PostMessage) {
                if (!locked) {
                    messages.push(action.message)
                    return true
                }
                return false
            }

            if (action.type === DeleteMessage) {
                if (!locked) {
                    messages = messages.filter(message => message.time !== action.message_id)
                    return true
                }
                return false
            }
        },

        replace(data) {
            messages = data.messages
            locked = data.locked

            this.updated()

            console.log("CLIENT FULLY UPDATED")
        },

        updated() {
            last_updated = get_time()
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
            const toggle_element = element.querySelector("#toggle_lock")
            if (toggle_element) {
                toggle_element.innerText = locked ? "UNLOCK" : "LOCK"
            }

            return this
        }
    }
}