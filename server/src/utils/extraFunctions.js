
const checkTimeValidity = (time) => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time)
}


export {
    checkTimeValidity
}