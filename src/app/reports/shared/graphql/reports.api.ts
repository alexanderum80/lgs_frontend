export const reportsApi = {
    currentTracking: require('graphql-tag/loader!./current-players-tracking.query.gql'),
    finalPlayerSession: require('graphql-tag/loader!./final-player-sessions.query.gql'),
    dropResults: require('graphql-tag/loader!./drop-results.query.gql'),
} 