/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2023 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");
const config = require('../../../config/config.js');
const apiUrl = config?.extensionConfig?.c3?.apiUrl
router.put('/api/c3/', (req, res) => {
    const url = apiUrl;
    console.log(req.body)
    const options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
    };
    fetch(url, options)
        .then(response => {
            res.header('content-type', 'application/json');
            if (response.ok) {
                console.log("Data updated successfully.");
                res.send({"success": true});
            } else {
                res.send("Kunne ikke opdatere alarm!");
            }
        })
        .catch(error => {
            console.log(error)
            res.send("Kunne ikke opdatere alarm!sddd");
        });
});
module.exports = router;
