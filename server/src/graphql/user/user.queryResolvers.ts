import UserService, { LoginUserAndGetTokensPayload } from "../../controllers/user.controllers";

export const queries = {
    LoginUserAndGetTokens: async (_: any, payload: LoginUserAndGetTokensPayload) => {
        const response = await UserService.LoginUserAndGetTokens(payload);

        if (typeof response === "string") {
            throw new Error(response); // Handle error messages as exceptions
        }

        const { loggedInUser, accessToken, refreshToken } = response;
        return { loggedInUser, accessToken, refreshToken };
    },

    getCurrentLoggedInUser: async (_: any, parameters: any, context: any) => {
        const user = await UserService.getCurrentLoggedInUser(_, parameters, context);
        if(!user) {
            throw new Error('User not found or token expired');
        }
        return user;
    },

    //for fetching users and implementation of redis 
    getAllusers: async () => {
        const users = await UserService.getAllusers();
        if(!users) {
            throw new Error("error while fetching users")
        }
        return users;
    }
};
