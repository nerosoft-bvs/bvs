/** @odoo-module **/

import { browser } from "@web/core/browser/browser";
import { registry } from "@web/core/registry";
import { busService } from "@bus/services/bus_service";

registry.category("services").add("bvsNotificationService", {
    dependencies: ["bus_service", "notification"],
    start(env, { bus_service, notification }) {
        // Only subscribe if current user is admin
        env.services.orm.call("res.users", "has_group", ["base.group_system"])
            .then((isAdmin) => {
                if (isAdmin) {
                    bus_service.addChannel("bvs_notification_channel");
                    bus_service.addEventListener("notification", ({ detail: notifications }) => {
                        for (const notif of notifications) {
                            if (notif.type === "bvs_notification_channel") {
                                notification.add(notif.payload.message, {
                                    title: notif.payload.title,
                                    type: notif.payload.type || "warning",
                                });
                            }
                        }
                    });
                }
            });
    },

});

