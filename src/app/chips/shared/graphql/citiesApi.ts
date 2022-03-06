export const chipsApi = {
    all: require('graphql-tag/loader!./all-chips.query.gql'),
    byId: require('graphql-tag/loader!./chip-by-id.query.gql'),
    create: require('graphql-tag/loader!./create-chip.mutation.gql'),
    update: require('graphql-tag/loader!./update-chip.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-chip.mutation.gql'),
}