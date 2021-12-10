import { Model } from "./Model.js"

export default function Server() {
    // create the model
    const model = Model()

    // return possible api request
    return {
        last_updated() {
            return model.last_updated()
        },

        get_data() {
            return model.data()
        },

        sync_action(action) {
            const success = model.handle_action(action)
            model.updated()

            return success
        }
    }
}