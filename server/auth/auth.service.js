'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var validateJwtSession = expressJwt({ secret: config.secrets.session });
var validateJwtRefresh = expressJwt({ secret: config.secrets.refresh });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
    return compose()
        // Validate jwt
        .use(function (req, res, next) {
            // Allow access-token to be passed through query parameter as well
            if (req.query && req.headers.hasOwnProperty('access-token')) {
                req.headers.authorization = 'Bearer ' + req.headers['access-token'];
            }
            validateJwtSession(req, res, next);
        })
        // Check token validation and use refresh token instead
        .use(function (err, req, res, next) {
            if (err) {
                console.log('Access token error... refreshing token!');
                // Allow refresh-token to be passed through query parameter as well
                if (req.query && req.headers.hasOwnProperty('refresh-token')) {
                    try {
                        var user = jwt.verify(req.headers['refresh-token'],config.secrets.refresh);
                        // If verified, renew tokens, go to catch section otherwise
                        var token = signToken(user._id);
                        var refreshToken = signRefreshToken(user._id);
                        res.set('Access-Control-Expose-Headers', 'access-token, refresh-token');
                        res.set('access-token', token);
                        res.set('refresh-token', refreshToken);
                    } catch (err) {
                        // Use expired refresh token to force auth error
                        req.headers.authorization = 'Bearer ' + req.headers['refresh-token'];
                    }
                }

                // Allow refresh-token to be passed through query parameter as well
                if (req.query && req.headers.hasOwnProperty('refresh-token')) {
                    req.headers.authorization = 'Bearer ' + req.headers['refresh-token'];
                }
                validateJwtRefresh(req, res, next);
            }
        })
        // Attach user to request
        .use(function (req, res, next) {
            User.findById(req.user._id, function (err, user) {
                if (err) return next(err);
                if (!user) return res.status(401).send('Unauthorized');

                req.user = user;
                next();
            });
        });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
    if (!roleRequired) throw new Error('Required role needs to be set');

    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
            if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
                next();
            } else {
                res.status(403).send('Forbidden');
            }
        });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
    return jwt.sign({ _id: id }, config.secrets.session, { expiresIn: config.expirationTimes.session });
}

/**
 * Returns a jwt refresh token signed by the app secret 2
 */
function signRefreshToken(id) {
    return jwt.sign({ _id: id }, config.secrets.refresh, { expiresIn: config.expirationTimes.refresh });
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.signRefreshToken = signRefreshToken;
