export default async function GetCurrentLocation() {

    if (navigator.geolocation) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords;
                    resolve({ longitude, latitude });
                },
                (error) => {
                    reject(error);
                }
            );
        });
    } else {
        return Promise.reject(new Error("Geolocation is not supported by this browser."));
    }
}
