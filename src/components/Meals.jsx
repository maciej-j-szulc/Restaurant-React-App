import useHttp from "../hooks/useHttp";
import Error from "./Error";
import MealItem from "./MealItem";


const requestConfig = {};

export default function Meals(){

    //usage of a custom hook
    const {
        data: loadedMeals, 
        isLoading, 
        error
    } = useHttp('http://localhost:3000/meals', requestConfig, []);

    //Conditional UI display awaiting backend response
    if(isLoading){
        return <p className="center">Fetching meals...</p>
    }

    //Conditional UI display in case of error
    if(error){
        return <Error title="Failed to fetch meals" message={error}/>
    }

    //list of available meals from the dummy backend
    return <ul id="meals">
        {loadedMeals.map(meal => (
            <MealItem key={meal.id} meal={meal}/>
        ))}
    </ul>
}