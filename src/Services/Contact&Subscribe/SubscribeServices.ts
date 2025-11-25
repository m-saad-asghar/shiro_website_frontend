import type { FormikValues } from "formik"
import { AuthAxios } from "../AxiosHandler"

class SubscribeServices {
    static endPoint ="/subscribe"
    static subscribe(body:FormikValues){
        return AuthAxios.post(`${SubscribeServices.endPoint}`,body)
    }
}
export default SubscribeServices