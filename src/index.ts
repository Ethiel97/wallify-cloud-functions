import {WallhavenApiResponse} from "./types";

const functions = require("firebase-functions");
const admin = require('firebase-admin');
import axios, {AxiosResponse} from "axios";

if (process.env.NODE_ENV !== 'production')
    require('dotenv').config();


admin.initializeApp(functions.config().firebase);

const instance = axios.create({
    baseURL: 'https://wallhaven.cc/api/v1/',
    timeout: 15000,
    headers: {
        'X-Api-Key': process.env.WALLHAVEN_API_KEY || ''
    }
});

//send daily push notification with london timezone at 12:40pm
exports.sendDailyPushNotification = functions.pubsub.schedule('30 16 * * *')
    .timeZone('Africa/Abidjan')
    .onRun(async () => {
        try {
            const response = await getTopWallpapers();
            const topic = "TEST" /*RANDOM_WALLPAPER*/

            if (response) {
                const image = response.data[0]

                console.log(image);

                const payload = {
                    notification: {
                        title: 'Check this awesome image - wallinice',
                    },
                    android: {
                        notification: {
                            // title: 'check this awesome image - Wallinice',
                            imageUrl: image.thumbs.small,
                            visibility: 'public'
                        },
                        priority: "high",
                    },
                    // Add APNS (Apple) config
                    apns: {
                        payload: {
                            aps: {
                                contentAvailable: true,
                            },
                        },
                        fcm_options: {
                            image: image.thumbs.small,
                        },
                        headers: {
                            "apns-push-type": "background",
                            "apns-priority": "5", // Must be `5` when `contentAvailable` is set to true.
                            "apns-topic": "io.flutter.plugins.firebase.messaging", // bundle identifier
                        },
                    },
                    // topic: "RANDOM_WALLPAPER",
                    topic,
                };

                return admin.messaging().send(payload);
            }
        } catch (e) {
            console.log(`Error occured: ${e}`)
        }

    });

async function getTopWallpapers(): Promise<WallhavenApiResponse | null> {
    try {
        let response: AxiosResponse<WallhavenApiResponse> = await instance.get<WallhavenApiResponse>('search?sorting=random&categories=100&purity=100');
        return response.data;
    } catch (error) {
        console.log(`Error occured when requesting api: ${error}`);
        return null;
    }
}
