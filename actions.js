import { get_time } from "./util.js"

export function SetLock(lock) {
    return {
        type: SetLock,
        lock,
    }
}

export function PostMessage(text) {
    return {
        type: PostMessage,
        message: {
            text,
            time: get_time(),
        },
    }
}

export function DeleteMessage(message) {
    return {
        type: DeleteMessage,
        message_id: message.time,
    }
}