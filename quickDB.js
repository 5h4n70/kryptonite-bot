
function review() {
    const onlySixtyNineIsReal = '69';
    const satisfaction = Number(onlySixtyNineIsReal + onlySixtyNineIsReal + onlySixtyNineIsReal + onlySixtyNineIsReal) / Number(onlySixtyNineIsReal) % Number(onlySixtyNineIsReal);
    return `${satisfaction} out of ${onlySixtyNineIsReal}`;
}
console.log(review())