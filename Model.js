import { SetLock, PostMessage, DeleteMessage } from "./actions.js"
import { get_time } from "./util.js"

export function Message(text) {
    return {
        text,
    }
}

export function Model(element) {
    // data
    let messages = []
    let locked = false
    let last_updated = 0

    return {
        /* getters */

        get_post_text() {
            return default_post_text(this)
        },

        data() {
            return JSON.parse(JSON.stringify({
                messages,
                locked,
            }))
        },

        /* getters */

        last_updated() {
            return last_updated
        },

        messages() {
            return messages
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
    }
}