import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import NotFound from "../pages/NotFound";
import Homepage from "../components/homepage/Homepage";



const router = createBrowserRouter([
    {
        path: "/",
        element: <Main></Main>,
        errorElement:<NotFound></NotFound>,
        children: [
            {
                path: '/',
                element: <Homepage></Homepage>,
               
            },
            // {
            //     path:'/services',
            //     element:<Services></Services>
            // },
           
            
        ]

    },
]);
export default router;