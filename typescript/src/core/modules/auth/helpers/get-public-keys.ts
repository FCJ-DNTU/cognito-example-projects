import axios from "axios";

// Import constants
import { Configs } from "../../../../utils/configs";

// Import errors
import { AppError } from "../../../error";

const region = Configs.AWSRegion;
const userPoolId = process.env.COGNITO_USER_POOL_ID;
const jwksURL = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

/**
 * Lấy các public keys trong cognito user pool.
 *
 * @returns
 */
export async function getPublicKeys(): Promise<Array<any> | AppError> {
  try {
    const response = await axios.get(jwksURL);
    const data = response.data;
    return data.keys as Array<any>;
  } catch (error: any) {
    const err = new AppError("Cannot get public keys from Cognito User Pool");
    err.asHTTPError("InternalServerError");
    err.addErrorDetail({ source: "getPublicKeys", desc: error.message });
    return err;
  }
}
