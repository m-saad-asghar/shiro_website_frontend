import { AuthAxios } from "./AxiosHandler"

class TypeServices {
    static endPoint = "types"
    static type (){
        return AuthAxios.get(`${TypeServices.endPoint}`)
    }
}
export default TypeServices