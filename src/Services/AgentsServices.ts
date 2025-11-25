import { AuthAxios } from "./AxiosHandler"

class AgentServices {
    static endPoint = "/agents"
    static AllAgent(){
        return AuthAxios.get(`${AgentServices.endPoint}`)
    }
}
export default AgentServices