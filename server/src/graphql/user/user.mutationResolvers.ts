import UserService, { CreateUserPayload } from "../../controllers/user.controllers";

export const mutations = {
    createUser: async (_: any, payload: CreateUserPayload) => {
        const { newUser, message } = await UserService.createUser(payload);

        if (!newUser) {
            console.error(message);
            throw new Error(message);
        }

        console.log(message);
        return newUser._id; // Return the ID of the created user
    }
};
