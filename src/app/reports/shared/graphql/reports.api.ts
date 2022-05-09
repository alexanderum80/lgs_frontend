export const reportsApi = {
    masterTracking: require('graphql-tag/loader!./master-tracking.query.gql'),
    currentTracking: require('graphql-tag/loader!./current-players-tracking.query.gql'),
    finalPlayerSession: require('graphql-tag/loader!./final-player-sessions.query.gql'),
    dropResults: require('graphql-tag/loader!./drop-results.query.gql'),
} 