import { queries } from "./user.queryResolvers";
import { mutations } from "./user.mutationResolvers";

export const resolvers = {
    Query: {
        ...queries
    },
    Mutation: {
        ...mutations
    }
};
