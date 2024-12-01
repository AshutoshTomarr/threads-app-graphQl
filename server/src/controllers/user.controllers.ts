import { IUser, User } from "../models/user.models";
import JWT from "jsonwebtoken";
import { redis } from '../utils/redis';

export interface CreateUserPayload {
    username: string;
    email: string;
    fullName: string;
    password: string;
}

export interface LoginUserAndGetTokensPayload {
    email: string;
    password: string;
}

export interface GenerateTokensResponse {
    accessToken: string;
    refreshToken: string;
}

class UserService {

    public static async createUser(payload: CreateUserPayload) {
        const { username, email, fullName, password } = payload;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            return {
                newUser: undefined,
                message: `User already exists with username: ${existingUser.username}`,
            };
        }

        try {
            // Create a new user
            const newUser = await User.create({
                username,
                email,
                fullName,
                password, // Consider hashing this before saving
            });

            return {
                newUser,
                message: `User created successfully with username: ${newUser.username}`,
            };
        } catch (error: unknown) {
            console.error("Error creating user:", error);
            // Assert that the error is of type Error
            if (error instanceof Error) {
                throw new Error(`Failed to create user: ${error.message}`);
            } else {
                throw new Error("An unknown error occurred while creating the user.");
            }
        }
    }

    public static async getUserById(userId: string) {
        const user = await User.findById(userId)
        console.log(user);
        if (!user) {
            throw new Error("User Not Found")
        }
        return user;
    }

    public static async LoginUserAndGetTokens(payload: LoginUserAndGetTokensPayload) {
        const { email, password } = payload;
        try {
            const user = await User.findOne({ email: email });

            if (!user) {
                return `No user found with ${email}`
            }

            const isPasswordValid = await user.isPasswordCorrect(password);
            if (!isPasswordValid) {
                return `Wrong credentials were provided`
            }
            const { accessToken, refreshToken } = await UserService.generateTokens(user);
            const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
            return { loggedInUser, accessToken, refreshToken };
        } catch (error: unknown) {
            console.error("Error logging in user:", error);
            if (error instanceof Error) {
                throw new Error(`Failed to login user: ${error.message}`);
            } else {
                throw new Error("An unknown error occurred while Login the user.");
            }
        }
    }

    public static async generateTokens(user: IUser): Promise<GenerateTokensResponse> {
        try {
            if (!user) {
                throw new Error(`user not found:`);
            }

            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();

            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave: false });

            return { accessToken, refreshToken };
        } catch (error: unknown) {
            console.error("Error generating tokens:", error);
            if (error instanceof Error) {
                throw new Error(`Failed to generate Token: ${error.message}`);
            } else {
                throw new Error("An unknown error occurred while generating Token for the user.");
            }
        }
    }

    public static async getCurrentLoggedInUser(_: any, parameters: any, context: any) {
        if (context && context.user) {
            const id = context.user._id;
            console.log(id);
            const user = await UserService.getUserById(id);
            return user;
        }
        throw new Error("I dont know who are you");
    }
    public static decodeJWTToken(token: string) {
        return JWT.verify(token, String(process.env.ACCESS_TOKEN_SECRET));

    }

    public static async getAllusers() {
        const cacheKey = "users:all";

        try {
            const cachedUsers = await redis.get(cacheKey);
            const users = cachedUsers ? JSON.parse(cachedUsers) : null;

            if (users) {
                return users;
            }

            const dbUsers = await User.find().select('-password');
            if (!dbUsers) {
                throw new Error(`no users found in database`);
            }

            await redis.set(cacheKey, JSON.stringify(dbUsers), 'EX', 3600)

            return dbUsers
        } catch (error) {
            throw new Error(`error fetching users`);
        }
    }
}

export default UserService;
