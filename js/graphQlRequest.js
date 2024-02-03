// const userQuery = `
// {
//     user{
//         login
//         firstName
//         lastName
//         email
//         campus
//         auditRatio
//         attrs
//     }
// }
// `

// const xpQuery = `
// {
//     xpTotal: transaction_aggregate(
//       where: {
//         type: { _eq: "xp" },
//         _and: [
//           { path: { _ilike: "/dakar/div-01%" } },
//           { path: { _nlike: "%/dakar/div-01/piscine-js/%" } },
//           { path: { _nlike: "%/dakar/div-01/piscine-js-2/%" } }
//         ]
//       }
//     ) {
//       aggregate {
//         sum {
//           amount
//         }
//       }
//     }
//   }`

//   const levelQuery = `
//   {
//     maxLevelTransaction: transaction_aggregate(
//       where: { type: { _eq: "level" }, path: { _ilike: "%/dakar/div-01%" } },
//       order_by: { amount: desc },
//       limit: 1
//     ) {
//       nodes {
//         amount
//       }
//     }
//   }`

//   const skillsQuery = `
//   {
//     skillTransactions: transaction(
//       distinct_on:[type]
//       where: {
//         type: { _ilike: "%skill%" },
//       },
//       order_by:{amount:desc,type:asc}
      
//     ) {
//       type
//       amount
//     }
//   }`

//   const auditRatioQuery = `
//   {
//     user{
//      upAmount: transactions_aggregate(
//        where: {type: {_eq: "up"}}
//      ){
//        aggregate{
//          sum{amount}
//        }
//      }
//      downAmount: transactions_aggregate(
//        where: {type: {_eq: "down"}}
//      ){
//        aggregate{
//          sum{amount}
//        }
//      }
//    }
//    }`