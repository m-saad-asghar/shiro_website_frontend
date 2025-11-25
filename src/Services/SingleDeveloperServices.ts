import { AuthAxios } from "./AxiosHandler"

class SingleDeveloperServices {
    static endPorint ="show/developer"
    static singleDeveloper(id:number){
        return AuthAxios.get(`${SingleDeveloperServices.endPorint}?devolper_id=${id}`)
    }
}
export default SingleDeveloperServices