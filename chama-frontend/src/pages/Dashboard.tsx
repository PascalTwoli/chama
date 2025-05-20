import Membership from "../components/membership"
import { useParams } from "react-router-dom";


export default function Dashboard() {

    const { chamaId } = useParams();
    return (
        <div className="">
            <Membership
                chamaId={chamaId}
            />
        </div>
    )
}