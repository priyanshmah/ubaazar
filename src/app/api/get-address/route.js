import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {

    const reqBody = await request.json();
    const { longitude, latitude } = reqBody;

    try {

        const addressDetails = {
            area: "",
            pinCode: "",
            city: "",
            state: "",
            address: "",
            landmark: "",
            formatted_address: ""
        };

        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_MAP_TOKEN}`;

        const response = await axios.get(url);

        if (!response.data.results || response.data.results.length === 0) {
            return addressDetails;
        }        

        const addressComponents = response.data.results[0].address_components;
        const formatted_address = response.data.results[0].formatted_address;
        addressDetails.formatted_address = formatted_address
        
        console.log(response.data.results[0]);
        
        addressComponents.forEach((component) => {
            if (component.types.includes("sublocality") ) {
                addressDetails.area = component.long_name;
            }
            if (component.types.includes("postal_code")) {
                addressDetails.pinCode = component.long_name;
            }
            if (component.types.includes("locality")) {
                addressDetails.city = component.long_name;
            }
            if (component.types.includes("administrative_area_level_1")) {
                addressDetails.state = component.long_name;
            }
            if (component.types.includes("landmark")) {
                addressDetails.landmark = component.long_name;
            }
            if (component.types.includes("premise") || component.types.includes("sublocality_level_1")) {
                addressDetails.address = component.long_name;
            }
        });


        return NextResponse.json({
            message: "Address fetched successfully....",
            success: true,
            address: addressDetails
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: error.message || "Internal server error",
            success: false
        }, { status: 500 })
    }
}
