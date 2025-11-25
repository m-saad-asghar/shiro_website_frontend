import type { FormikValues } from "formik"
import { AuthAxios } from "./AxiosHandler"

class FavouritesServices {
    static endPoint = "favourites"
    static ToggleFavourite(body:FormikValues){
        return AuthAxios.post(`${FavouritesServices.endPoint}/toggle`,body)
    }
    static AllFavourite(){
        return AuthAxios.get(`${FavouritesServices.endPoint}`)
    }
}
export default FavouritesServices