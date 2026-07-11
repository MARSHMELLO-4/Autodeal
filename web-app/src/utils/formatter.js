// utils/formatter.js

export const formatPrice = (price) => {

    if(price == null)
        return "Price on request";

    return new Intl.NumberFormat("en-IN",{
        style:"currency",
        currency:"INR",
        maximumFractionDigits:0
    }).format(price);

};

export const formatKm = (km)=>
    `${new Intl.NumberFormat("en-IN").format(km || 0)} km`;