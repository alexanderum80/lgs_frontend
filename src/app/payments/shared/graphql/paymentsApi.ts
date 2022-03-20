export const paymentsApi = {
    all: require('graphql-tag/loader!./all-payments.query.gql'),
    byId: require('graphql-tag/loader!./payment-by-id.query.gql'),
    instruments: require('graphql-tag/loader!./payment-instrument.query.gql'),
    create: require('graphql-tag/loader!./create-payment.mutation.gql'),
    update: require('graphql-tag/loader!./update-payment.mutation.gql'),
    delete: require('graphql-tag/loader!./delete-payment.mutation.gql'),
}