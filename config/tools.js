import { v4 as uuidv4 } from "uuid";

const smallerUuid = () => {
  let hexString = uuidv4();
  return hexString.split("-")[4];
};

export default smallerUuid;

export const validateEmail = (email) => {
  if (
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  )
    return true;
  return false;
};

export const validateRequestBody = (keys, requiredParams) => {
  console.log({
    keys: keys.sort().toString(),
    required: requiredParams.sort().toString(),
  });
  if (keys.sort().toString() == requiredParams.sort().toString()) return true;
  return false;
};
