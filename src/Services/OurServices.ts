import { AuthAxios } from "./AxiosHandler"

class OurServices {
    static endPoint = "/services"
    static AllServices(){
        return AuthAxios.get(`${OurServices.endPoint}`)
    }
}
export default OurServices