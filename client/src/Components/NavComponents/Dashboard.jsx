import { useSelector } from "react-redux";


const Dashboard = () => {
    const {user} = useSelector((state) => state.auth);
        if(user.role === 'superadmin') <h1>Superadmin</h1>
        if(user.role === 'admin') <h1>admin</h1>
}

export default Dashboard;