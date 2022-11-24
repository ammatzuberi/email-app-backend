import smallerUuid from "./config/tools.js";

let uniqueArray = [];

for (let i = 0; i < 100000; i++) {
  uniqueArray.push(smallerUuid());
}
console.log(uniqueArray);

const tryItwithPromise = async (arr) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("timeout");
      reject({ err: "its taking too long" });
    }, 600);

    arr = arr.filter((item, index) => arr.indexOf(item) !== index);

    resolve(arr);
  });
};
tryItwithPromise(uniqueArray)
  .then((res) => {
    console.log(res);
  })
  .catch((er) => {
    console.log(er);
  });
