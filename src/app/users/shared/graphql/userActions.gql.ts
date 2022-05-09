export const userApi = {
    authenticate: require('graphql-tag/loader!./authenticate.query.gql'),
    logout: require('graphql-tag/loader!./logout.query.gql'),
    refreshToken: require('graphql-tag/loader!./refresh-token.query.gql'),
    all: require('graphql-tag/loader!./all-users.query.gql'),
    byId: require('graphql-tag/loader!./user-by-id.query.gql'),
    changePassword: require('graphql-tag/loader!./change-password.mutation.gql'),
    create: require('graphql-tag/loader!./create-user.mutation.gql'),
    update: require('graphql-tag/loader!./update-user.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-user.mutation.gql'),
    recover: require('graphql-tag/loader!./recover-user.mutation.gql'),
};

