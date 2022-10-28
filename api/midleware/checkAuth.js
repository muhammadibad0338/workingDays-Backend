const expressJwt = require('express-jwt')


function authJwt(next) {

    const secret = process.env.secret
    // const api = process.env.API_URL
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        // isRevoked: isRevoked
    })
        // EXCLUDING ROUTES FROM AUTH CHEK  "OR"  ROUTES CAN BE ACCESS WITHOUT AUTHORIZATION
        .unless({
            path: [

                /*  
                this regular expression allows every get route after products 
                                *** EXAMPLE ***
                 ======    /\/api\/v1\/products(.*)/   =======*/

                // allowed public folder  to access without authentication
                { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
                { url: /\/products(.*)/, methods: ['GET', 'OPTIONS'] },
                { url: '/category', methods: ['GET', 'OPTIONS'] },
                `/auth/login`,
                `/auth/signup`

            ]
        })
}


// restrict unauthorize user to delete or post product 
const isRevoked = async (req, payload, done) => {
    // payload contains data in jwt

    if (!payload.isAdmin) {
        done(null, true)
    }

    done();

}
module.exports = authJwt;