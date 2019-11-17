const express = require('express')
const request = require('request')
const querystring = require('querystring')

const Concert = require('../schemas/concert')
const utils = require('./utils')

let concertRouter = express()

concertRouter.route('/')
    .get((req, res) => {
        const x = Concert.aggregate([
            {
                $group: {_id: "$categoryId" }
            }
        ])
        console.log(x)
    })
    .post((req, res) => {
        const { spotifyUserId, concertName, category } = req.body

        const createPlaylistRequest = {
            url: `https://api.spotify.com/v1/users/${spotifyUserId}/playlists`,
            headers: {
                'Authorization': 'Bearer ' + access_token,
            },
            body: {
                name: `${concertName} ${Date.now}`,
                public: true,
                collaborative: true,
            },
            json: true,
        }

        request.post(createPlaylistRequest, (playlistError, playlistResponse, playlistBody) => {
            const playlistId = playlistBody.id
            const concert = Concert({
                name: concertName,
                playlistId,
                category,
                users: [userId],
                djs: [userId],
            })
            concert.save(() => {
                let redirectUrl = process.env.FRONTEND_URI || 'localhost:3000'
                redirectUrl += '/room'
                res.redirect(redirectUrl)
            })
        })
    })



concertRouter.route('/category/:categoryId')
    .get((req, res) => {

    })

module.exports = concertRouter