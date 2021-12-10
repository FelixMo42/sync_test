import { SetLock, PostMessage, DeleteMessage } from "./actions.js"
import { Div, Text, Button } from "./util.js"
import { Model } from "./Model.js"

export default function Client(name, server) {
    const model = Model()

    let is_connected = true
    let unsynced_actions = []

    function dispatch(action) {
        // optomistic update
        model.handle_action(action)

        // sync action
        unsynced_actions.push(action)
        if (is_connected) sync()
    }

    function sync() {
        // check if theres been any updates since we last looked
        const needs_to_update = server.last_updated() > model.last_updated()

        // sync all the action
        for (let action of unsynced_actions) {
            server.sync_action(action)
        }

        // clean the unsynced action list
        unsynced_actions = []

        // Replace the document
        if (needs_to_update) model.replace(server.data())

        model.updated()
    }

    function get_message_text() {
        return `${name} message #${model.messages().length + 1}`
    }

    return Div(["client"], () => [
        Div(["header"], () => [
            Text(() => name),

            Button(() => "PING", () => sync()),
            Button(() => model.is_locked() ? "UNLOCK" : "LOCK", () => dispatch(SetLock(!model.is_locked()))),
            Button(() => is_connected ? "DISCONNECT" : "CONNECT", () => { is_connected = !is_connected }),
        ]),
        Div(["messages"], () => model.messages().map(message => Text(() => message.text))),
        Div(["footer"], () => [
            Text(get_message_text),

            Button(() => "POST", () => dispatch(PostMessage(get_message_text()))),
        ])
    ])
}