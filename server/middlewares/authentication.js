const jwt = require('jsonwebtoken');

let verificationToken = (req, res, next) => {

    let token = req.get('Authorization');
    jwt.verify( token, process.env.SEED, (err, decoded) => {
        
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    msg: 'Invalid TOKEN'
                }
            });
        }
        req.user = decoded.user;
        next();
    });
};

let verificationRole = (req, res, next) => {

    let user = req.user;
    if (user.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                msg: 'User without privileges'
            }
        })
    } else {
        next();
    }
};

let verificationTokenImg = (req, res, next) => {

    let token = req.query.token;
    jwt.verify( token, process.env.SEED, (err, decoded) => {
        
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    msg: 'Invalid TOKEN'
                }
            });
        }
        req.user = decoded.user;
        next();
    });
};

module.exports = {
    verificationToken,
    verificationRole,
    verificationTokenImg
}