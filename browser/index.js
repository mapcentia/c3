/*
 * @author     Martin Høgh <mh@mapcentia.com>
 * @copyright  2013-2023 MapCentia ApS
 * @license    http://www.gnu.org/licenses/#AGPL  GNU AFFERO GENERAL PUBLIC LICENSE 3
 */

'use strict';

let cloud;
const config = require('../../../config/config.js');
const customer = config?.extensionConfig?.c3?.customer

module.exports = {

    /**
     *
     * @param o
     * @returns {exports}
     */
    set: function (o) {
        cloud = o.cloud;
        return this;
    },

    /**
     *
     */
    init: function () {
        const toastContainer = document.createElement("div");
        toastContainer.setAttribute("id", "alarm-toast")
        toastContainer.classList.add("toast-container", "position-fixed", "bottom-0", "end-0", "p-3", "pb-5");
        document.getElementById("main-container").append(toastContainer);
        window._c3 = (e) => {
            const m = cloud.get().map;
            const alertToastEl = document.getElementById("alarm-toast");
            alertToastEl.innerHTML = "";
            e.geoJSON.features.forEach(f => {
                const properties = f.properties;
                const coordinates = f.geometry.coordinates;
                const id = `alert-toast-${properties.id}`
                if (properties.status !== "closed") {
                    /*
                    if (document.getElementById(id)) {
                        console.log("Already toasted!");
                        return;
                    } else {
                        console.log(`${id} not in feed`);
                    }
                    */
                    let divElement = document.createElement("div");
                    divElement.setAttribute("id", id);
                    divElement.classList.add("toast");
                    divElement.innerHTML = `
            <div class="toast-header text-bg-danger border-0"">
            <strong class="me-auto">${properties.address}</strong>
            <small>${properties.time}</small>
            </div>
            <div class="toast-body">
            <button class="btn btn-outline-secondary show-alarm">Vis</button>
            <button class="btn btn-outline-success acknowledge-alarm" ${properties.status === "acknowledged" ? "disabled" : ""}><span class="spinner-border spinner-border-sm d-none"></span>Kvittere</button>
            <button class="btn btn-outline-danger close-alarm ${properties.status === "acknowledged" && properties.status !== "close" ? "" : "invisible"}"><span class="spinner-border spinner-border-sm d-none"></span>Luk</button>
            </div>
            `;
                    alertToastEl.appendChild(divElement)
                    let toast = new bootstrap.Toast(divElement, {autohide: false});
                    toast.show();
                    divElement.querySelector(".show-alarm").addEventListener("click", (b) => {
                        console.log(coordinates);
                        m.setView([coordinates[1], coordinates[0]], 17);
                    });
                    divElement.querySelector(".acknowledge-alarm").addEventListener("click", (b) => {
                        b.target.setAttribute("disabled", true);
                        b.target.querySelector(".acknowledge-alarm span").classList.remove("d-none");
                        const url = "/api/c3";
                        const data = {
                            "incidentId": properties.id,
                            "status": "acknowledged",
                            "customer": customer,
                        };
                        const options = {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(data),
                        };
                        fetch(url, options)
                            .then(response => {
                                if (response.ok) {
                                    console.log("Data updated successfully.");
                                    b.target.querySelector(".acknowledge-alarm span").classList.add("d-none");
                                    document.querySelector(".close-alarm").classList.remove("invisible");
                                } else {
                                    alert("Kunne ikke opdatere alarm!");
                                    b.target.removeAttribute("disabled");
                                    b.target.querySelector(".acknowledge-alarm span").classList.add("d-none");


                                }
                            })
                            .catch(error => {
                                alert("Kunne ikke opdatere alarm!");
                                b.target.removeAttribute("disabled");
                                b.target.querySelector("span").classList.add("d-none");
                            });
                    });
                    divElement.querySelector(".close-alarm").addEventListener("click", (b) => {
                        b.target.setAttribute("disabled", true);
                        b.target.querySelector(".close-alarm span").classList.remove("d-none");
                        const url = "/api/c3";
                        const data = {
                            "incidentId": properties.id,
                            "status": "closed",
                            "customer": customer
                        };
                        const options = {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(data),
                        };
                        fetch(url, options)
                            .then(response => {
                                if (response.ok) {
                                    console.log("Data updated successfully.");
                                    b.target.querySelector("span").classList.add("d-none");
                                    document.getElementById(id).remove();
                                    //t.hide();
                                } else {
                                    alert("Kunne ikke opdatere alarm!");
                                    b.target.removeAttribute("disabled");
                                    b.target.querySelector(".close-alarm span").classList.add("d-none");


                                }
                            })
                            .catch(error => {
                                alert("Kunne ikke opdatere alarm!");
                                b.target.removeAttribute("disabled");
                                b.target.querySelector("span").classList.add("d-none");
                            });
                    })
                }
            })
        }

    }
}
