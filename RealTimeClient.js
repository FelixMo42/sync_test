import { SetLock, PostMessage, DeleteMessage } from "./actions.js"
import { Div, Text, Button } from "./util.js"
import { Model } from "./Model.js"

export default function Client(name, server) {
    function dispatch(action) {
        server.sync_action(action)
    }

    function is_locked() {
        return server.get_data().data.locked
    }

    function messages() {
        return server.get_data().data.messages
    }

    function get_message_text() {
        return `${name} message #${messages().length + 1}`
    }

    return Div(["client"], () => [
        Div(["header"], () => [
            Text(() => name),

            Button(() => is_locked() ? "UNLOCK" : "LOCK", () => dispatch(SetLock(!is_locked()))),
        ]),
        Div(["messages"], () => messages().map(message => Text(() => message.text))),
        Div(["footer"], () => [
            Text(get_message_text),

            Button(() => "POST", () => dispatch(PostMessage(get_message_text()))),
        ])
    ])
}